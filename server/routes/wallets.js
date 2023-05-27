require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

// Important Packages
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Middlewares
const checkAuth = require("../middleware/checkAuth");

// Models
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
  const { uid } = req.user;

  try {
    const isWallet = await Wallets.findOne({ userId: uid });
    if (isWallet != null) {
      return res.status(200).json(isWallet);
    }
    return res.status(200).json({ totalBalance: 0, pendingBalance: 0 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
