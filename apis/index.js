const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.api"));
router.use("/email", require("./email.api"));
router.use("/product", require("./product.api"));
router.use("/event", require("./event.api"));
router.use("/cart", require("./cart.api"));
router.use("/order", require("./orders.api"));
router.use("/qr", require("./qr.api"));
router.use("/user", require("./user.api"));

module.exports = router;
