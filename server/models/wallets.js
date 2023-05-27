const mongoose = require("mongoose");

const walletsSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  pendingBalance: {
    type: Number,
    default: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  userType: {
    type: String,
  },
});

module.exports = mongoose.model("Wallets", walletsSchema);
