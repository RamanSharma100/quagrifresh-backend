const express = require("express");
const router = express.Router();
const { checkAuth, checkSeller } = require("../middlewares");

const {
  createProduct,
  getProducts,
  getProduct,
} = require("../controllers/product.controller");

router.get("/get/all", getProducts);
router.get("/get/:id", getProduct);
router.post("/create", checkAuth, checkSeller, createProduct);

module.exports = router;
