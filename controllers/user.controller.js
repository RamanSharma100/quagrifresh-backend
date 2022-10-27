const { findById, updateDocument } = require("../models/auth-cloudant");

const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ message: "Invalid Request!" });
    return;
  }

  let user;
  try {
    user = await findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "No User Found" });
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "Could not find user for the provided id." });
  }
  const {
    _id,
    _rev,
    name,
    email,
    type,
    address,
    phone,
    loginMedium,
    longitude,
    latitude,
    history,
    isVerified,
    rating,
    avatar,
    createdAt,
    updatedAt,
  } = user.doc;
  res.json({
    user: {
      _id,
      _rev,
      name,
      email,
      type,
      address,
      phone,
      loginMedium,
      longitude,
      latitude,
      history,
      isVerified,
      rating,
      avatar,
      createdAt,
      updatedAt,
    },
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ message: "Invalid Request!" });
    return;
  }

  let user;
  try {
    user = await findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "No User Found" });
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "Could not find user for the provided id." });
  }

  const { name, email, phone, address } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name Required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email Required" });
  }

  // update user
  const updatedUser = user.doc;
  updatedUser.name = name;
  updatedUser.email = email;
  updatedUser.phone = phone;
  updatedUser.address = address;
  updatedUser.updatedAt = new Date().toISOString();

  try {
    await updateDocument(updatedUser);
    return res.status(200).json({ message: "User Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Could not update user." });
  }
};

module.exports = {
  getUser,
  updateUser,
};
