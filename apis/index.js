const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.api"));
router.use("/email", require("./email.api"));
router.use("/product", require("./product.api"));
router.use("/event", require("./event.api"));

module.exports = router;
