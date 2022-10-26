const express = require("express");
const router = express.Router();
const { checkAuth, checkSeller } = require("../middlewares");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
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
router.post("/update/:id", checkAuth, checkSeller, updateProduct);
router.post("/delete/:id", checkAuth, checkSeller, deleteProduct);

module.exports = router;
