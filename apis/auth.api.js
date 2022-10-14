const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
