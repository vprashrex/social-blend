const mongoose = require("mongoose");

const influencerSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: false,
    default: "",
  },
  location: {
    type: String,
    required: false,
    default: "",
  },
  heading: {
    type: String,
    required: false,
    default: "",
  },
  about: {
    type: String,
    required: false,
    default: "",
  },
  gender: {
    type: String,
    required: false,
    default: "",
  },
  handles: {
    type: Array,
    required: false,
    default: [
      {
        name: "instagram",
        username: "",
      },
      {
        name: "youtube",
        username: "",
      },
      {
        name: "twitter",
        username: "",
      },
      {
        name: "youtube",
        username: "",
      },
      {
        name: "website",
        username: "",
      },
    ],
  },
  niches: {
    type: Array,
    required: false,
  },
  profileImg: {
    type: String,
    required: false,
    default: "",
  },
  coverImg: {
    type: String,
    required: false,
    default: "",
  },
  contentImg1: {
    type: String,
    required: false,
    default: "",
  },
  contentImg2: {
    type: String,
    required: false,
    default: "",
  },
  contentImg3: {
    type: String,
    required: false,
    default: "",
  },
  packages: {
    type: Array,
    required: false,
  },
  faqs: [
    {
      id: String,
      question: String,
      answer: String,
      required: false,
    },
  ],
  currentLevel: {
    type: Number,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  type: {
    type: String,
  },
  fullName: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  lastOnline: {
    type: Number,
  },
});

module.exports = mongoose.model("Influencers", influencerSchema);
