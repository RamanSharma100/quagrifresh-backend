const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = (req, res) => {};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { findByEmail, getDbConnection } = require("../models/auth-cloudant");

  await getDbConnection();
  // Check if user already exists
  const oldUser = await findByEmail(email);
  if (oldUser) {
    return res.status(400).json({ msg: "User already exists" });
  }

  return res.status(200).json({ msg: req.body });
};

module.exports = {
  login,
  register,
};
