const { uploadImage } = require("../helpers/cloudinary.helper");
const fs = require("fs");
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
  const {
    title,
    description,
    startDate,
    endDate,
    deliveryDate,
    deliveryCost,
    products,
    eventBy,
  } = req.body;

  if (
    !title ||
    !description ||
    !startDate ||
    !endDate ||
    !deliveryDate ||
    !deliveryCost ||
    !products
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
    products: typeof products === "string" ? products.split(",") : products,
    eventBy,
    buyers: [],
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const newEvent = await createDocument(data);
    // upload images to cloudinary with promises
    const promises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          uploadImage(file.path, newEvent.id, "quagrifresh_events")
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        })
    );
    const results = await Promise.all(promises);
    // extract secure_url from results
    const images = results.map((result) => ({
      secure_url: result.secure_url,
      original_filename: result.original_filename,
    }));
    data.images = images;
    data._id = newEvent.id;
    data._rev = newEvent.rev;

    const updatedEvent = await updateDocument(data);

    // delete files from server
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    res.status(201).json({
      event: { id: newEvent.id, rev: newEvent.rev, doc: data },
      msg: "Event created successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, msg: "Error creating event!" });
  }
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
    eventBy,
  } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  const oldEvent = await findDocumentById(id);

  if (!oldEvent) {
    return res.status(400).json({ msg: "Event not found!" });
  }

  if (oldEvent.eventBy !== eventBy) {
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
    eventBy,
    images: oldEvent.images,
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
