const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  currentLevel: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  otp: {
    type: Number,
    required: true,
  },
  brandName: {
    type: String,
  },
});

module.exports = mongoose.model("Users", usersSchema);
