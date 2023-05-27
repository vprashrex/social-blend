require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

// Important Packages
const { v1: uuid } = require("uuid");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middlewares
const checkAuth = require("../middleware/checkAuth");

// Models
const Influencers = require("../models/influencer");
const Orders = require("../models/orders");

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

router.post("/create-intent", checkAuth, async (req, res) => {
  const { productId } = req.body;

  try {
    const influencer = await Influencers.findOne({
      packages: { $elemMatch: { id: productId } },
    });

    if (influencer !== null) {
      const influencerPackage = await influencer.packages.filter(
        (userPackage) => {
          return userPackage.id === productId;
        }
      )[0];
      const paymentIntent = await stripe.paymentIntents.create({
        amount:
          (influencerPackage.price + (10 / 100) * influencerPackage.price) *
          100,
        currency: "inr",
        payment_method_types: ["card"],
        capture_method: "manual",
      });
      return res
        .status(200)
        .json({ clientSecret: paymentIntent.client_secret });
    }
    return res.json(409).json({ meesage: "You shouldn't be here!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/save-intent-id", checkAuth, async (req, res) => {
  const { id, clientSecret, influencerUid, packageId } = req.body;
  const currentUser = req.user;

  const order = await Orders.create({
    id: uuid(),
    brandUid: currentUser.uid,
    clientSecret: clientSecret,
    influencerUid,
    paymentIntentId: id,
    brandRequirements: {},
    order: {
      packageId,
    },
    createdAt: Date.now(),
  });

  await order.save();

  res.status(200).json({ success: true });
});

module.exports = router;
