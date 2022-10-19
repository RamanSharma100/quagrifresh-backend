const express = require("express");
const router = express.Router();
const {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
} = require("../controllers/orders.controller");
const { checkAuth, checkSeller } = require("../middlewares");

router.post("/create/:cartId", checkAuth, createOrder);
router.post("/delete/:orderId", checkAuth, deleteOrder);
router.get("/get/:orderId", checkAuth, getOrder);
router.put("/update/:orderId", checkAuth, updateOrder);

module.exports = router;
