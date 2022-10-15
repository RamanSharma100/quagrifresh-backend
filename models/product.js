const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: Array,
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Array,
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    productBy: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    buyers: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
