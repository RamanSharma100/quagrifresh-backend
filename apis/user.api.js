const express = require("express");
const router = express.Router();

const { getUser, updateUser } = require("../controllers/user.controller");

router.get("/get/:id", getUser);
router.post("/update/:id", updateUser);

module.exports = router;
