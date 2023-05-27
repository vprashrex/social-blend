const mongoose = require("mongoose");

const brandListsSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: false,
    default: "",
  },
  lists: {
    type: Array,
  },
});

module.exports = mongoose.model("BrandLists", brandListsSchema);
