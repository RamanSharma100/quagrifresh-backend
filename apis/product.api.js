const express = require("express");
const router = express.Router();
const { checkAuth, checkSeller } = require("../middlewares");

const {
  createProduct,
  getProducts,
  getProduct,
} = require("../controllers/product.controller");
const upload = require("../middlewares/multer.middleware");

router.get("/get/all", getProducts);
router.get("/get/:id", getProduct);
router.post(
  "/create",
  checkAuth,
  checkSeller,
  upload.array("images"),
  createProduct
);

module.exports = router;
