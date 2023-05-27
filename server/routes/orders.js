require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

// Important Packages
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middlewares
const checkAuth = require("../middleware/checkAuth");
const { uploadChat } = require("../middleware/upload");

// Models
const Orders = require("../models/orders");
const Chats = require("../models/chats");
const Influencers = require("../models/influencer");
const Wallets = require("../models/wallets");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(
  cors({
    origin: process.env.CLIENT_HOST_NAME,
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true,
  })
);
router.use(cookieParser());

router.get("/", checkAuth, async (req, res) => {
  const currentUser = req.user;

  try {
    const resData =
      currentUser.type === "Influencer"
        ? await Orders.find({ influencerUid: currentUser.uid })
        : await Orders.find({ brandUid: currentUser.uid });
    res.status(200).json(resData);
  } catch (err) {
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/accept", checkAuth, async (req, res) => {
  const { orderId } = req.body;
  const currentUser = req.user;
  try {
    const order = await Orders.findOne({
      $and: [{ id: orderId }, { influencerUid: currentUser.uid }],
    });
    if (order !== null) {
      const userWallet = await Wallets.findOne({ userId: currentUser.uid });
      const { error, paymentIntent } = await stripe.paymentIntents.capture(
        order.paymentIntentId
      );
      await Orders.updateOne(
        { paymentIntentId: order.paymentIntentId },
        { $set: { isAccepted: true } }
      );
      const userPackage = currentUser.packages.filter(
        (pack) => pack.id === order.order.packageId
      )[0];
      if (userWallet != null) {
        await Wallets.updateOne(
          { userId: currentUser.uid },
          {
            $set: {
              totalBalance: userWallet.totalBalance + userPackage.price,
              pendingBalance: userWallet.pendingBalance + userPackage.price,
            },
          }
        );
      } else {
        const newWallet = new Wallets({
          totalBalance: userPackage.price,
          pendingBalance: userPackage.price,
          userId: currentUser.uid,
          userType: "Influencer",
        });
        await newWallet.save();
      }
      return res.status(200).json({ success: true });
    }
    return res.json(409).json({ meesage: "You shouldn't be here!" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/mark-complete", checkAuth, async (req, res) => {
  const { orderId } = req.body;
  const currentUser = req.user;
  try {
    const order = await Orders.findOne({
      $and: [{ id: orderId }, { influencerUid: currentUser.uid }],
    });
    if (order !== null) {
      await Orders.updateOne(
        { id: orderId },
        { $set: { isMarkComplete: true } }
      );
      return res.status(200).json({ success: true });
    }
    return res.json(409).json({ meesage: "You shouldn't be here!" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/decline", checkAuth, async (req, res) => {
  const { orderId } = req.body;
  const currentUser = req.user;
  try {
    const order = await Orders.findOne({
      $and: [{ id: orderId }, { influencerUid: currentUser.uid }],
    });
    if (order !== null) {
      await stripe.paymentIntents.cancel(order.paymentIntentId);
      await Orders.updateOne(
        { paymentIntentId: order.paymentIntentId },
        { $set: { isDeclined: true } }
      );
      return res.status(200).json({ success: true });
    }
    return res.json(409).json({ meesage: "You shouldn't be here!" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/cancel", checkAuth, async (req, res) => {
  const { orderId } = req.body;
  const currentUser = req.user;
  try {
    const order = await Orders.findOne({
      $and: [{ id: orderId }, { brandUid: currentUser.uid }],
    });
    if (order !== null) {
      await stripe.paymentIntents.cancel(order.paymentIntentId);
      await Orders.updateOne(
        { paymentIntentId: order.paymentIntentId },
        { $set: { isCanceled: true } }
      );
      return res.status(200).json({ success: true });
    }
    return res.json(409).json({ meesage: "You shouldn't be here!" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/save-requirements", checkAuth, async (req, res) => {
  const { requirements, order } = req.body;

  try {
    await Orders.updateOne(
      {
        $and: [
          { brandUid: order.brandUid },
          {
            influencerUid: order.influencerUid,
          },
          { "order.packageId": order.packageId },
        ],
      },
      { brandRequirements: requirements }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/already-exists", checkAuth, async (req, res) => {
  const { brandUid, influencerUid, packageId } = req.query;

  try {
    const isExists = await Orders.findOne({
      $and: [{ brandUid }, { influencerUid }, { "order.packageId": packageId }],
    });
    if (
      isExists &&
      !(isExists.isCanceled || isExists.isDeclined || isExists.isPaymentRelease)
    ) {
      return res.status(200).json({ alreadyExists: true });
    }
    return res.status(200).json({ alreadyExists: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/check-order", checkAuth, async (req, res) => {
  const { id } = req.query;
  const currentUser = req.user;

  try {
    const isExists = await Orders.findOne({
      $and: [
        { id },
        {
          $or: [
            { influencerUid: currentUser.uid },
            { brandUid: currentUser.uid },
          ],
        },
      ],
    });

    if (isExists != null) {
      const chats = await Chats.findOne({ orderId: id }).sort({
        "chat.createdAt": -1,
      });
      const userId =
        currentUser.type === "Influencer"
          ? isExists.brandUid
          : isExists.influencerUid;
      return res
        .status(200)
        .json({ success: true, chats /* userId, order: isExists */ });
    }
    return res
      .status(409)
      .json({ message: "You shouldn't be here!", success: false });
  } catch (err) {
    return res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/save-chat", checkAuth, async (req, res) => {
  const msg = req.body;
  const currentUser = req.user;
  try {
    const isExists = await Orders.findOne({
      $and: [
        { id: msg.orderId },
        {
          $or: [
            { influencerUid: currentUser.uid },
            { brandUid: currentUser.uid },
          ],
        },
      ],
    });
    if (isExists != null) {
      const isChatExists = await Chats.findOne({ orderId: msg.orderId });
      if (isChatExists != null) {
        await Chats.updateOne(
          { orderId: msg.orderId },
          { $push: { chat: msg } }
        );
        await Chats.updateOne(
          { orderId: msg.orderId },
          { $set: { lastMessage: msg } }
        );
      } else {
        const newChat = new Chats({
          orderId: msg.orderId,
          chat: msg,
          lastMessage: msg,
        });
        await newChat.save();
      }

      return res.status(200).json({ success: true });
    }
    return res
      .status(409)
      .json({ message: "You shouldn't be here!", success: false });
  } catch (err) {
    console.log(err);
  }
});

router.post("/save-chat-img", checkAuth, uploadChat.any(), async (req, res) => {
  const file = req.files[0];
  const { chatId, orderId } = req.body;
  try {
    await Chats.updateOne(
      { orderId },
      {
        $set: {
          "chat.$[chatId].imgName": file.filename,
        },
      },
      {
        arrayFilters: [{ "chatId.id": chatId }],
      }
    );
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({
    success: true,
  });
});

router.post("/release-payment", checkAuth, async (req, res) => {
  const { orderId } = req.body;
  const currentUser = req.user;

  try {
    const isExists = await Orders.findOne({
      $and: [
        { id: orderId },
        {
          $or: [
            { influencerUid: currentUser.uid },
            { brandUid: currentUser.uid },
          ],
        },
      ],
    });
    if (isExists != null) {
      const influencerData = await Influencers.findOne({
        uid: isExists.influencerUid,
      });
      const userPackage = influencerData.packages.filter((availPackage) => {
        return availPackage.id === isExists.order.packageId;
      })[0];
      const walletExists = await Wallets.findOne({
        userId: influencerData.uid,
      });
      if (walletExists != null) {
        await Wallets.updateOne(
          { userId: influencerData.uid },
          {
            $set: {
              availableBalance:
                walletExists.availableBalance + userPackage.price,
              pendingBalance: walletExists.pendingBalance - userPackage.price,
            },
          }
        );
      }
      await Orders.updateOne(
        { id: orderId },
        { $set: { isPaymentRelease: true } }
      );
      return res.status(200).json({ success: true });
    }
    return res
      .status(409)
      .json({ message: "You shouldn't be here!", success: false });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
