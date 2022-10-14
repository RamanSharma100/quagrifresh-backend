const express = require("express");
const router = express.Router();

const {
  verifyEmail,
  resendVerificationEmail,
  sendResetPasswordEmail,
} = require("../controllers/email.controller");

router.get("/verify/:token", verifyEmail);
router.post("/resend", resendVerificationEmail);
router.post("/resetPassword", sendResetPasswordEmail);

module.exports = router;
