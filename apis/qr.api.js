const express = require("express");
const router = express.Router();

const { generateEventQr } = require("../controllers/qr.controller");

router.get("/generate/event/:eventId", generateEventQr);

module.exports = router;
