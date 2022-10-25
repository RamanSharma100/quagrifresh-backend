const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  findByEmail,
  createDocument,
  updateDocument,
} = require("../models/auth-cloudant");
const { sendMail } = require("../helpers/mail.helper");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill in all fields!" });
  }

  // Check if user exists
  const user = await findByEmail(email);
  if (!user) {
    return res.status(400).json({ msg: "Invalid Email/Password!" });
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.doc.password);
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
  res.status(200).json({
    token,
    user: {
      _id: user.id,
      name: user.doc.name,
      email: user.doc.email,
      type: user.doc.type,
      loginMedium: user.doc.loginMedium,
    },
    msg: "Logged in successfully",
  });
};

const register = async (req, res) => {
  const { name, email, password, type, loginMedium } = req.body;

  if (!name || !email || !password || !type || !loginMedium) {
    return res.status(400).json({ msg: "Please fill in all fields!" });
  }

  // email validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email!" });
  }

  // Check if user already exists
  const oldUser = await findByEmail(email);
  if (oldUser) {
    return res.status(400).json({ msg: "User already exists" });
  }
  // validate password length
  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password should be atleast 8 characters long!" });
  }

  // validate password has one uppercase, one lowercase, one number and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "Password should have atleast one uppercase, one lowercase, one number and one special character!",
    });
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
    rating: [],
    avatar: "",
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
    return res
      .status(500)
      .json({ msg: "Something went wrong but you can login!" });
  }

  // Save user to database
  const user = await createDocument(newUser);
  if (!user) {
    return res.status(400).json({ msg: "Something went wrong" });
  }

  return res.status(200).json({ msg: "User registered successfully!" });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({ msg: "No token provided!" });
  }

  if (!password) {
    return res.status(400).json({ msg: "Please enter a new password!" });
  }

  // Check if token is valid
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(400).json({ msg: "Invalid token or expired!" });
  }
  if (!decoded) {
    return res.status(400).json({ msg: "Invalid token" });
  }

  // Check if user exists
  const user = await findByEmail(decoded.email);

  if (!user) {
    return res.status(404).json({ msg: "User does not exist!" });
  }

  if (user.doc.loginMedium !== "email") {
    return res.status(400).json({
      msg: "You cannot reset password for this account as you are loggedin with OAuth!",
    });
  }

  if (!password) {
    return res.status(400).json({ msg: "Please fill in all fields!" });
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update password
  user.doc.password = hashedPassword;

  const updatedUser = await updateDocument(user.doc);

  if (!updatedUser) {
    return res.status(400).json({ msg: "Something went wrong" });
  }

  // send email to user for password reset
  const html = `
    <h1>Password reset successful</h1>
    <p>Your password has been reset successfully</p>
    <br/>
    <p>If you did not reset your password, please contact us immediately</p>
    `;

  const subject = "Password reset successful";

  try {
    await sendMail(user.doc.email, subject, html);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong" });
  }

  return res
    .status(200)
    .json({ msg: "Password updated successfully!", user: updatedUser.doc });
};

module.exports = {
  login,
  register,
  resetPassword,
};
