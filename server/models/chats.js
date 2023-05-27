const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  chat: {
    type: Array,
    default: [],
  },
  lastMessage: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("Chats", chatSchema);
