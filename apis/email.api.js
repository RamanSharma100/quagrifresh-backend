const express = require("express");
const router = express.Router();

const { verifyEmail } = require("../controllers/email.controller");

router.get("/verify/:token", verifyEmail);

module.exports = router;
