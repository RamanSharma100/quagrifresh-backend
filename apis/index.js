const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.api"));
router.use("/email", require("./email.api"));
router.use("/product", require("./product.api"));

module.exports = router;
