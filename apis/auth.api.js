const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth.controller");

// router.use("/login", login);
router.post("/register", register);

module.exports = router;
