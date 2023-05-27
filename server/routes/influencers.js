require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const Users = require("../models/users");
const Influencers = require("../models/influencer");
const Brands = require("../models/brand");
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

router.get("/get-by-id", async (req, res) => {
  const { uid } = req.query;

  try {
    const isUserExists = await Users.findOne({ _id: uid });
    if (isUserExists !== null) {
      const userData =
        isUserExists.type === "Influencer"
          ? await Influencers.findOne(
              { uid: isUserExists._id },
              {
                currentLevel: 0,
                email: 0,
                isFeatured: 0,
                isVerified: 0,
              }
            )
          : await Brands.findOne(
              { uid: isUserExists._id },
              {
                currentLevel: 0,
                email: 0,
                isFeatured: 0,
                isVerified: 0,
              }
            );
      return res.status(200).json(userData);
    }
    return res.status(500).json({ message: "Page Not Found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/get-by-username", async (req, res) => {
  const { username } = req.query;
  try {
    const userData = await Users.findOne({ username });

    if (userData == null) {
      return res.status(404).json({ message: "Page Not Found" });
    }

    const resData =
      userData.type === "Influencer"
        ? await Influencers.findOne({ uid: userData._id })
        : await Brands.findOne({ uid: userData._id });

    if (resData == null) {
      return res.status(404).json({ message: "Page Not Found" });
    }
    resData.email = undefined;
    resData.isFeatured = undefined;
    resData.isVerified = undefined;
    resData.lastOnline = undefined;
    return res.status(200).json(resData);
  } catch (err) {
    return res.status(500).json({ err, message: "Something went wrong" });
  }
});

router.get("/get-featured-users", async (req, res) => {
  try {
    const resData = await Influencers.find(
      {
        currentLevel: 11,
        isFeatured: true,
      },
      {
        currentLevel: 0,
        email: 0,
        isFeatured: 0,
        isVerified: 0,
        lastOnline: 0,
      }
    ).limit(4);
    res.status(200).json(resData);
  } catch (err) {
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/get-users-by-platform", async (req, res) => {
  const { platform } = req.query;
  try {
    const resData = await Influencers.find(
      {
        currentLevel: 11,
        handles: { $elemMatch: { name: platform, username: { $ne: "" } } },
      },
      {
        email: 0,
        isFeatured: 0,
        isVerified: 0,
        lastOnline: 0,
        currentLevel: 0,
      }
    ).limit(4);
    res.status(200).json(resData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/get-users-by-query", async (req, res) => {
  const { platform, niches } = req.query;
  try {
    if (platform === "any" && niches === "all") {
      const resData = await Influencers.find(
        {
          currentLevel: 11,
        },
        {
          email: 0,
          isFeatured: 0,
          isVerified: 0,
          lastOnline: 0,

          currentLevel: 0,
        }
      );

      return res.status(200).json(resData);
    }
    if (platform !== "any" && niches !== "all") {
      const resData = await Influencers.find(
        {
          currentLevel: 11,
          packages: {
            $elemMatch: { platform: new RegExp(platform, "i") },
          },
          niches: { $elemMatch: { name: new RegExp(niches, "i") } },
        },
        {
          email: 0,
          isFeatured: 0,
          isVerified: 0,
          lastOnline: 0,

          currentLevel: 0,
        }
      );

      return res.status(200).json(resData);
    }

    if (platform === "any" && niches !== "all") {
      const resData = await Influencers.find(
        {
          currentLevel: 11,
          niches: { $elemMatch: { name: new RegExp(niches, "i") } },
        },
        {
          email: 0,
          isFeatured: 0,
          isVerified: 0,
          lastOnline: 0,

          currentLevel: 0,
        }
      );

      return res.status(200).json(resData);
    }
    if (platform !== "any" && niches === "all") {
      const resData = await Influencers.find(
        {
          currentLevel: 11,
          packages: { $elemMatch: { platform: new RegExp(platform, "i") } },
        },
        {
          email: 0,
          isFeatured: 0,
          isVerified: 0,
          lastOnline: 0,

          currentLevel: 0,
        }
      ).limit(4);

      return res.status(200).json(resData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

router.get("/package-by-id", checkAuth, async (req, res) => {
  const { packageId } = req.query;
  try {
    const influencer = await Influencers.findOne({
      packages: { $elemMatch: { id: packageId } },
    });
    if (influencer) {
      const resData = influencer.packages.filter((userPackage) => {
        return userPackage.id === packageId;
      })[0];

      return res.status(200).json(resData);
    }
    return res.status(409).json({ message: "Package not available" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

module.exports = router;
