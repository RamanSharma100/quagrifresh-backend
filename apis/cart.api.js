const express = require("express");
const router = express.Router();
const {
  createCart,
  deleteCart,
  getCart,
  updateCart,
} = require("../controllers/cart.controller");
const { checkAuth, checkSeller } = require("../middlewares");

router.post("/create", checkAuth, createCart);
router.get("/get/:userId", checkAuth, getCart);
router.post("/update/:cartId", checkAuth, updateCart);
router.post("/delete/:cartId", checkAuth, deleteCart);

module.exports = router;
