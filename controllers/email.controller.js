const jwt = require("jsonwebtoken");
const { findByEmail, updateDocument } = require("../models/auth-cloudant");
const { sendMail } = require("../helpers/mail.helper");

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const { email } = decoded;
  const user = await findByEmail(email);

  if (user) {
    const document = user.doc;
    if (document.isVerified) {
      return res.status(200).json({ message: "User already verified!" });
    }

    document.isVerified = true;

    // send email verified email
    const subject = "Thank you for verifying your email!";
    const html = `<h1>Email Verified</h1>
    <p>Thank you for verifying your email!</p>`;
    await sendMail(email, subject, html);

    await updateDocument(document);

    return res.status(200).json({
      message: "Email verified successfully!",
      user: document,
    });
  } else {
    res.status(400).send("Invalid token!");
  }
};

module.exports = {
  verifyEmail,
};
