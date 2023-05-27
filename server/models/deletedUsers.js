const mongoose = require("mongoose");

const deleteUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  reason: {
    type: String,
  },
});

module.exports = mongoose.model("DeletedUsers", deleteUserSchema);
