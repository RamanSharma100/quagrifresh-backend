const express = require("express");
const router = express.Router();
const {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
  getMyOrder,
} = require("../controllers/orders.controller");
const { checkAuth, checkSeller } = require("../middlewares");

router.post("/create", checkAuth, createOrder);
router.get("/get/myorders/:userId", checkAuth, getMyOrder);
router.post("/delete/:orderId", checkAuth, deleteOrder);
router.get("/get/:orderId", checkAuth, getOrder);
router.put("/update/:orderId", checkAuth, updateOrder);

module.exports = router;
