const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  brandUid: {
    type: String,
  },
  influencerUid: {
    type: String,
  },
  paymentIntentId: {
    type: String,
  },
  clientSecret: {
    type: String,
  },
  brandRequirements: {
    type: Object,
    default: {},
  },
  order: {
    type: Object,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  isDeclined: {
    type: Boolean,
    default: false,
  },
  chats: {
    type: Array,
    default: [],
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
  isPaymentRelease: {
    type: Boolean,
    default: false,
  },
  isMarkComplete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Orders", ordersSchema);
