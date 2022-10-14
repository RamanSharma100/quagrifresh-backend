const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findByEmail, createDocument } = require("../models/auth-cloudant");
const { sendMail } = require("../helpers/mail.helper");

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await findByEmail(email);
  console.log(user);
  if (!user) {
    return res.status(400).json({ msg: "Invalid Email/Password!" });
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.doc.password);
  console.log(isMatch);
  if (!isMatch) {
    return res.status(400).json({ msg: "invalid Email/Password!" });
  }

  // Create and assign a token
  const token = jwt.sign(
    {
      _id: user.id,
      name: user.doc.name,
      email: user.doc.email,
      type: user.doc.type,
      loginMedium: user.doc.loginMedium,
    },
    process.env.TOKEN_SECRET
  );
  res.status(200).json({ token, user, msg: "Logged in successfully" });
};

const register = async (req, res) => {
  const { name, email, password, type, loginMedium } = req.body;

  // Check if user already exists
  const oldUser = await findByEmail(email);
  if (oldUser) {
    return res.status(400).json({ msg: "User already exists", oldUser });
  }

  let pass = password;
  if (loginMedium === "email") {
    const salt = await bcrypt.genSalt(10);
    pass = bcrypt.hashSync(password, salt);
  }

  // Create new user
  const newUser = {
    name,
    email,
    password: loginMedium === "email" ? pass : "",
    type,
    address: "",
    phone: "",
    loginMedium: "email",
    longitude: 0.0,
    latitude: 0.0,
    history: [],
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // send verification email
  const verificationToken = jwt.sign(
    {
      email: newUser.email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const verificationLink = `${process.env.FRONTEND_URL}/email/verify/${verificationToken}`;

  const html = `
    <h1>Verify your email</h1>
    <p>Click on the link below to verify your email</p>
    <a href="${verificationLink}">${verificationLink}</a>
  `;

  const subject = "Verify your email";

  try {
    await sendMail(newUser.email, subject, html);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }

  // Save user to database
  const user = await createDocument(newUser);
  if (!user) {
    return res.status(400).json({ msg: "Something went wrong" });
  }

  return res.status(200).json({ msg: "User created successfully", user });
};

module.exports = {
  login,
  register,
};
