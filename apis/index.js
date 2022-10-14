const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.api"));
router.use("/email", require("./email.api"));

module.exports = router;
