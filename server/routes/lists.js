require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const BrandLists = require("../models/brandLists");
const checkAuth = require("../middleware/checkAuth");

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
router.use(express.static(__dirname + "../public"));

router.get("/get-by-id", checkAuth, async (req, res) => {
  const currentUser = req.user;
  try {
    const resData = await BrandLists.findOne({ uid: currentUser.uid });
    res.status(200).json(resData);
  } catch (err) {
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/single-list", checkAuth, async (req, res) => {
  const { id } = req.query;
  const currentUser = req.user;
  try {
    let resData = await BrandLists.findOne({
      uid: currentUser.uid,
      lists: { $elemMatch: { id } },
    });
    if (resData) {
      resData = resData.lists.filter((list) => {
        return list.id === id;
      });
    }
    res.status(200).json(resData[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/update-name", checkAuth, async (req, res) => {
  const { name, oldName } = req.body;
  const currentUser = req.user;
  try {
    let resData = await BrandLists.findOne({
      uid: currentUser.uid,
      lists: { $elemMatch: { name: oldName } },
    });
    resData = resData.lists.map((list) => {
      if (list.name === oldName) {
        list.name = name;
      }
      return list;
    });
    await BrandLists.updateOne(
      { uid: currentUser.uid, lists: { $elemMatch: { name: oldName } } },
      { lists: resData }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/delete-list", checkAuth, async (req, res) => {
  const currentUser = req.user;
  const { name } = req.body;

  try {
    let resData = await BrandLists.findOne({
      uid: currentUser.uid,
      lists: { $elemMatch: { name } },
    });
    resData = resData.lists.filter((list) => {
      return list.name !== name;
    });
    await BrandLists.updateOne(
      { uid: currentUser.uid, lists: { $elemMatch: { name } } },
      { lists: resData }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/add-influencer-list", checkAuth, async (req, res) => {
  const { id, name, influencers } = req.body;
  const currentUser = req.user;

  try {
    const isAlreadyInList = await BrandLists.findOne({
      uid: currentUser.uid,
    });
    let isNameAlreadyInList = await BrandLists.findOne({
      uid: currentUser.uid,
      lists: { $elemMatch: { name } },
    });
    if (isAlreadyInList && isNameAlreadyInList) {
      let oldInfluencers = [];
      isNameAlreadyInList = isNameAlreadyInList.lists.filter((list) => {
        if (list.name === name) {
          oldInfluencers = list.influencers;
        }
        return list.name !== name;
      });
      await BrandLists.updateOne(
        { uid: currentUser.uid, lists: { $elemMatch: { name } } },
        {
          $set: {
            lists: [
              ...isNameAlreadyInList,
              {
                id,
                name,
                influencers: [...oldInfluencers, influencers[0]],
              },
            ],
          },
        }
      );
      return res.status(200).json({ success: true });
    }
    if (isAlreadyInList) {
      await BrandLists.updateOne(
        { uid: currentUser.uid },
        { lists: [...isAlreadyInList.lists, { id, name, influencers }] }
      );
      return res.status(200).json({ success: true });
    }
    const newList = await BrandLists.create({
      uid: currentUser.uid,
      lists: [{ id, name, influencers }],
    });
    await newList.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.post("/remove-influencer-list", checkAuth, async (req, res) => {
  const { uid } = req.body;
  const currentUser = req.user;

  let updatedList = [];

  const currentList = await BrandLists.findOne({ uid: currentUser.uid });

  await currentList.lists.forEach(async (list) => {
    await updatedList.push({
      id: list.id,
      name: list.name,
      influencers: await list.influencers.filter((influencer) => {
        return influencer.uid !== uid;
      }),
    });
  });

  updatedList = updatedList.filter((list) => list.influencers.length > 0);

  try {
    await BrandLists.updateOne(
      { uid: currentUser.uid },
      { lists: updatedList }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

module.exports = router;
