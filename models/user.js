const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    profileType: {
      type: String,
      enum: ["seller", "buyer"],
    },
    avatar: {
      type: String,
    },
    loginSource: {
      type: String,
      required: true,
      enum: ["local", "google", "facebook"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
