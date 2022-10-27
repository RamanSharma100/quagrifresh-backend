const express = require("express");
const router = express.Router();
const { checkAuth, checkSeller } = require("../middlewares");
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

router.get("/all/get", getAllEvents);
router.get("/get/:id", getEvent);
router.post("/create", checkAuth, checkSeller, createEvent);
router.post("/update/:id", checkAuth, checkSeller, updateEvent);
router.delete("/delete/:id", checkAuth, checkSeller, deleteEvent);

module.exports = router;
