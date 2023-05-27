const mongoose = require("mongoose");

const resetTokensSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  expiresIn: {
    type: Date,
  },
});

module.exports = mongoose.model("ResetTokens", resetTokensSchema);
