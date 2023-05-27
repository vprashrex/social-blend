require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = express.Router();

// Important Packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Manage OTP & Reset Email
const { generateOTP } = require("../services/otp");
const { sendOTP, sendResetMail } = require("../services/emailService");

// Models
const Users = require("../models/users");
const Influencers = require("../models/influencer");
const Brand = require("../models/brand");
const DeletedUsers = require("../models/deletedUsers");
const ResetTokens = require("../models/resetTokens");

// Router Middlewares
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

// Middlewares
const checkAuth = require("../middleware/checkAuth");
const { upload } = require("../middleware/upload");

/* All Routes for auth */

// Check Username
router.post("/check-username", async (req, res) => {
  const { username } = req.body;
  try {
    const alreadyExists = await Users.findOne({ username });
    if (alreadyExists != null)
      return res.status(409).json({
        message: "Username not available",
      });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Something went wrong",
    });
  }
  return res.status(200).json({
    message: "Username available",
  });
});

// Sign Up
router.post("/signup", async (req, res) => {
  const {
    username,
    email,
    password,
    fullName,
    about,
    type,
    currentLevel,
    brandName,
  } = req.body;
  if (about == "default") {
    return res.status(409).json({
      message: "Please fill out every details",
    });
  }
  try {
    const alreadyExists = await Users.findOne({ email });

    if (alreadyExists != null) {
      return res.status(409).json({
        message: "Email Already In Use",
      });
    }

    const OTP = generateOTP();
    const emailRes = await sendOTP({ OTP, to: email });

    if (emailRes.rejected.length != 0)
      return res.status(500).json({
        message: "Something went wrong! Try Again",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new Users({
      fullName,
      username,
      email,
      password: hashPassword,
      type,
      about,
      currentLevel,
      isVerified: false,
      otp: OTP,
      brandName: type == "Influencer" ? undefined : brandName,
    });

    await user.save();

    user.password = undefined;
    user.otp = undefined;

    const token = jwt.sign({ user }, process.env.JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: "/",
    };

    res.status(200).cookie("token", token, options).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

router.post("/resend-email", checkAuth, async (req, res) => {
  const { email } = req.user;
  try {
    const OTP = generateOTP();
    const emailRes = await sendOTP({ OTP, to: email });
    if (emailRes.rejected.length != 0)
      return res.status(500).json({
        message: "Something went wrong! Try Again",
      });
    await Users.updateOne({ email }, { otp: OTP });
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

router.get("/check-auth", checkAuth, (req, res) => {
  const currentUser = req.user;
  return res.status(200).json(currentUser);
});

router.post("/verify-otp", checkAuth, async (req, res) => {
  const { email } = req.user;
  const { code } = req.body;

  try {
    const emailExists = await Users.findOne({ email });
    if (emailExists != null && code == emailExists.otp) {
      await Users.updateOne(
        { email },
        {
          $set: {
            isVerified: true,
            currentLevel: 1,
          },
        }
      );
      const newUser =
        emailExists.type === "Influencer"
          ? await Influencers.create({
              uid: emailExists._id,
              currentLevel: 1,
              about: "",
              location: "",
              heading: "",
              gender: "",
              handles: [],
              niches: [],
              packages: [],
              faqs: [],
              username: emailExists.username,
              profileImg: "",
              coverImg: "",
              contentImg1: "",
              contentImg2: "",
              contentImg3: "",
              email,
              fullName: emailExists.fullName,
              type: emailExists.type,
              isVerified: true,
              lastOnline: new Date().getTime(),
            })
          : await Brand.create({
              uid: emailExists._id,
              currentLevel: 1,
              about: "",
              location: "",
              heading: "",
              handles: [],
              niches: [],
              username: emailExists.username,
              profileImg: "",
              coverImg: "",
              contentImg1: "",
              contentImg2: "",
              contentImg3: "",
              email,
              fullName: emailExists.fullName,
              type: emailExists.type,
              isVerified: true,
              brandName: emailExists.brandName,
              lastOnline: new Date().getTime(),
            });

      /*       const customer =
        emailExists.type === "Brand" &&
        (await stripe.customers.create({
          email: currentUser.email,
        }));

      const setupIntent =
        emailExists.type === "Brand" &&
        (await stripe.setupIntents.create({
          customer: customer.id,
          payment_method_types: ["card"],
        }));

      emailExists.type === "Brand" &&
        (newUser.clientSecret = setupIntent.client_secret); */

      const token = jwt.sign({ user: newUser }, process.env.JWT_SECRECT_KEY, {
        expiresIn: "1d",
      });

      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        path: "/",
      };

      return res.status(200).cookie("token", token, options).json({
        success: true,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid OTP Try again!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

// Add Influencer Data In DB
router.post("/add-data-influencer", checkAuth, async (req, res) => {
  const {
    currentLevel,
    about,
    location,
    heading,
    gender,
    handles,
    niches,
    packages,
    faqs,
    fullName,
  } = req.body;
  const { uid, email } = req.user;

  try {
    await Users.updateOne(
      { _id: uid },
      { currentLevel: currentLevel === 11 ? 11 : currentLevel + 1 }
    );
    await Influencers.updateOne(
      { uid },
      {
        $set: {
          currentLevel: currentLevel !== 11 ? currentLevel + 1 : currentLevel,
          about,
          location,
          heading,
          gender,
          handles,
          niches,
          packages,
          faqs,
          email,
          fullName,
        },
      }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

// Add Brand Data In DB
router.post("/add-data-brand", checkAuth, async (req, res) => {
  const { currentLevel, location, heading, handles, niches } = req.body;
  const { uid, email } = req.user;

  try {
    await Users.updateOne(
      { _id: uid },
      { currentLevel: currentLevel === 6 ? 6 : currentLevel + 1 }
    );
    await Brand.updateOne(
      { uid },
      {
        $set: {
          currentLevel: currentLevel === 6 ? 6 : currentLevel + 1,
          location,
          heading,
          handles,
          niches,
          email,
        },
      }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).js4on({
      err,
      message: "Something went wrong!",
    });
  }
});

// Add Images
router.post("/add-imgs", checkAuth, upload.any(), async (req, res) => {
  const currentUser = req.user;
  let profileImg = currentUser.profileImg;
  let coverImg = currentUser.coverImg;
  let contentImg1 = currentUser.contentImg1;
  let contentImg2 = currentUser.contentImg2;
  let contentImg3 = currentUser.contentImg3;
  try {
    await req.files.forEach((file) => {
      if (file.fieldname === "profileImg") {
        return (profileImg = file.filename);
      }
      if (file.fieldname === "coverImg") {
        return (coverImg = file.filename);
      }
      if (file.fieldname === "contentImg1") {
        return (contentImg1 = file.filename);
      }
      if (file.fieldname === "contentImg2") {
        return (contentImg2 = file.filename);
      }
      if (file.fieldname === "contentImg3") {
        return (contentImg3 = file.filename);
      }
    });
    await Users.updateOne(
      { _id: currentUser.uid },
      {
        currentLevel:
          currentUser.type === "Influencer"
            ? currentUser.currentLevel === 11
              ? 11
              : currentUser.currentLevel + 1
            : currentUser.currentLevel === 6
            ? 6
            : currentUser.currentLevel + 1,
      }
    );
    currentUser.type == "Influencer"
      ? await Influencers.updateOne(
          { uid: currentUser.uid },
          {
            $set: {
              currentLevel: currentUser.currentLevel === 11 ? 11 : 8,
              profileImg,
              coverImg,
              contentImg1,
              contentImg2,
              contentImg3,
            },
          }
        )
      : await Brand.updateOne(
          { uid: currentUser.uid },
          {
            $set: {
              currentLevel: 6,
              profileImg,
              coverImg,
              contentImg1,
              contentImg2,
              contentImg3,
            },
          }
        );
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, message: "Something went wrong!" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isEmailExists = await Users.findOne({ email });
    if (
      isEmailExists &&
      (await bcrypt.compare(password, isEmailExists.password))
    ) {
      isEmailExists.type == "Influencer"
        ? await Influencers.updateOne(
            {
              uid: isEmailExists._id,
            },
            { $set: { lastOnline: new Date().getTime() } }
          )
        : await Brand.updateOne(
            { uid: isEmailExists._id },
            { $set: { lastOnline: new Date().getTime() } }
          );
      const userData =
        isEmailExists.type == "Influencer"
          ? await Influencers.findOne({
              uid: isEmailExists._id,
            })
          : await Brand.findOne({ uid: isEmailExists._id });
      const token = jwt.sign({ user: userData }, process.env.JWT_SECRECT_KEY, {
        expiresIn: "1d",
      });
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        path: "/",
      };
      return res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true });
    }
    return res.status(401).json({
      message: "Email/Password is Invalid!",
    });
  } catch (err) {
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

// Update Password
router.post("/update-password", checkAuth, async (req, res) => {
  const { currPass, newPass } = req.body;
  const currentUser = req.user;

  try {
    const isUserExists = await Users.findOne({ _id: currentUser.uid });
    if (
      isUserExists &&
      (await bcrypt.compare(currPass, isUserExists.password))
    ) {
      const newPassword = await bcrypt.hash(newPass, 10);
      await Users.updateOne(
        { _id: currentUser.uid },
        { password: newPassword }
      );
      return res.status(200).json({ success: true });
    }
    return res.status(409).json({
      message: "Password is invalid!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

// Logout
router.post("/logout", checkAuth, async (req, res) => {
  const currentUser = req.user;
  if (currentUser.type == "Influencer") {
    await Influencers.updateOne(
      { uid: currentUser.uid },
      { $set: { lastOnline: new Date().getTime() - 300000 } }
    );
  } else {
    await Brand.updateOne(
      { uid: currentUser.uid },
      { $set: { lastOnline: new Date().getTime() - 300000 } }
    );
  }
  return res.status(200).clearCookie("token").json({ success: true });
});

// Delete Account //
router.post("/delete-account", checkAuth, async (req, res) => {
  const currentUser = req.user;
  const { reason } = req.body;

  try {
    await Users.deleteOne({ _id: currentUser.uid });
    currentUser.type === "Influencer"
      ? await Influencers.deleteOne({ uid: currentUser.uid })
      : await Brand.deleteOne({ uid: currentUser.uid });
    const deleteUser = await DeletedUsers.create({
      email: currentUser.email,
      isVerified: currentUser.isVerified,
      type: currentUser.type,
      username: currentUser.username,
      reason,
    });
    await deleteUser.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, message: "Something went wrong!" });
  }
});

// Send Reset Email
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  try {
    const isUserExists = await Users.findOne({ email });

    if (isUserExists) {
      isUserExists.password = undefined;
      isUserExists.otp = undefined;
      const token = jwt.sign(
        { user: isUserExists },
        process.env.JWT_SECRECT_KEY,
        {
          expiresIn: "2h",
        }
      );
      const newToken = await ResetTokens.create({
        token,
        expiresIn: new Date(Date.now() + 2 * 60 * 60 * 1000),
      });
      await newToken.save();
      await sendResetMail({ name: isUserExists.fullName, token, to: email });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

// Verfiy Token Of Resent Email
router.post("/check-token", async (req, res) => {
  const { token } = req.body;
  try {
    const isValidInDB = await ResetTokens.findOne({ token });

    if (isValidInDB && isValidInDB.expiresIn > new Date(Date.now())) {
      return res.status(200).json({ success: true });
    }
    return res.status(409).json({
      message:
        "Oops, this link has expired or already been used. Please reset your password again.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, message: "Something went wrong!" });
  }
});

// Update Password
router.post("/reset-password", async (req, res) => {
  const { token, newPass } = req.body;
  const isValidInDB = await ResetTokens.findOne({ token });

  try {
    if (isValidInDB && isValidInDB.expiresIn > new Date(Date.now())) {
      const { user } = jwt.verify(token, process.env.JWT_SECRECT_KEY);
      const newPassword = await bcrypt.hash(newPass, 10);
      await Users.updateOne({ _id: user._id }, { password: newPassword });
      await ResetTokens.deleteOne({ token });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ err, message: "Something went wrong!" });
  }
});

module.exports = router;
