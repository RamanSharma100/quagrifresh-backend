const {
  createDocument,
  getAllDocuments,
  findDocumentById,
  updateDocument,
} = require("../models/event-cloudant");

const getAllEvents = async (req, res) => {
  const events = await getAllDocuments();
  return res.status(200).json({ events, msg: "Events fetched successfully" });
};

const getEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  const event = await findDocumentById(id);

  if (!event) {
    return res.status(400).json({ msg: "Event not found!" });
  }

  return res.status(200).json({ event, msg: "Event fetched successfully" });
};

const createEvent = async (req, res) => {
  const { title, description, startDate, endDate, deliveryDate, deliveryCost } =
    req.body;

  if (
    !title ||
    !description ||
    !startDate ||
    !endDate ||
    !deliveryDate ||
    !deliveryCost
  ) {
    return res.status(400).json({ msg: "Please fill in all fields!" });
  }

  // create document
  const data = {
    title,
    description,
    startDate,
    endDate,
    deliveryDate,
    deliveryCost,
    products: [],
    buyers: [],
    eventBy: req.userData._id,
  };

  const event = await createDocument(data);
  return res.status(200).json({ event, msg: "Event created successfully" });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    startDate,
    endDate,
    deliveryDate,
    deliveryCost,
    products,
    buyers,
  } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  const oldEvent = await findDocumentById(id);

  if (!oldEvent) {
    return res.status(400).json({ msg: "Event not found!" });
  }

  if (oldEvent.eventBy !== req.userData._id) {
    return res
      .status(400)
      .json({ msg: "You are not authorized to edit this event!" });
  }

  if (
    !title ||
    !description ||
    !startDate ||
    !endDate ||
    !deliveryDate ||
    !deliveryCost ||
    !products ||
    !buyers
  ) {
    return res.status(400).json({ msg: "Please fill in all fields!" });
  }

  // update document
  const data = {
    _id: id,
    _rev: oldEvent._rev,
    title,
    description,
    startDate,
    endDate,
    deliveryDate,
    deliveryCost,
    products,
    buyers,
    eventBy: req.userData._id,
  };

  const event = await updateDocument(data);

  if (event) {
    return res.status(200).json({ event, msg: "Event updated successfully" });
  } else {
    return res.status(400).json({ msg: "Event not updated!" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  const oldEvent = await findDocumentById(id);

  if (!oldEvent) {
    return res.status(400).json({ msg: "Event not found!" });
  }

  if (oldEvent.eventBy !== req.userData._id) {
    return res
      .status(400)
      .json({ msg: "You are not authorized to edit this event!" });
  }

  // delete document
  const result = await deleteDocument(id);

  if (result) {
    return res.status(200).json({ msg: "Event deleted successfully" });
  } else {
    return res.status(400).json({ msg: "Event not deleted!" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
