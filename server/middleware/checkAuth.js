const Users = require("../models/users");
const Influencers = require("../models/influencer");
const Brand = require("../models/brand");
const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Please Login" });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRECT_KEY);
    const { user } = decode;
    const isInfluencerExists = await Influencers.findOne({
      uid: user.uid ? user.uid : user._id,
    });
    if (isInfluencerExists != null) {
      await Influencers.updateOne(
        {
          uid: user.uid ? user.uid : user._id,
        },
        { $set: { lastOnline: new Date().getTime() } }
      );
    }
    const isBrandExists = await Brand.findOne({
      uid: user.uid ? user.uid : user._id,
    });
    if (isBrandExists != null) {
      await Brand.updateOne(
        {
          uid: user.uid ? user.uid : user._id,
        },
        { $set: { lastOnline: new Date().getTime() } }
      );
    }
    const isUserExists = isInfluencerExists
      ? await Influencers.findOne({ uid: user.uid })
      : isBrandExists
      ? await Brand.findOne({ uid: user.uid })
      : await Users.findOne({
          _id: user.uid ? user.uid : user._id,
        });
    if (isUserExists == null) {
      res.clearCookie("token");
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    isUserExists.otp = undefined;
    isUserExists.password = undefined;
    req.user = isUserExists;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err,
      message: "Something went wrong!",
    });
  }
  next();
};

module.exports = checkAuth;
