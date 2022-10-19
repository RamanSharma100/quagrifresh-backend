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
router.get("/get/:cartId", checkAuth, getCart);
router.put("/update/:cartId", checkAuth, updateCart);
router.delete("/delete/:cartId", checkAuth, deleteCart);

module.exports = router;
