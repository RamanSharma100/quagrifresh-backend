const jwt = require("jsonwebtoken");
const { findByEmail, updateDocument } = require("../models/auth-cloudant");
const { sendMail } = require("../helpers/mail.helper");

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token not present!" });
  }

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

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email not present!" });
  }

  const user = await findByEmail(email);

  if (user) {
    const document = user.doc;
    if (document.isVerified) {
      return res.status(200).json({ message: "User already verified!" });
    }

    // send verification email
    const subject = "Please verify your email!";
    const html = `<h1>Verify your email</h1>
        <p>Please click on the link below to verify your email</p>
        <a href="${process.env.HOST}/email/verify/${document.token}">Verify Email</a>`;
    await sendMail(email, subject, html);

    return res.status(200).json({
      message: "Verification email sent!",
    });
  } else {
    res.status(400).send("User Not Found!");
  }
};

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email not present!" });
  }

  const user = await findByEmail(email);

  if (user) {
    const document = user.doc;

    const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // send reset password email
    const subject = "Reset Password";
    const html = `<h1>Reset Password</h1>
            <p>Please click on the link below to reset your password</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a>`;

    try {
      await sendMail(email, subject, html);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error sending email!" });
    }

    return res.status(200).json({
      message: "Reset password email sent!",
    });
  } else {
    res.status(400).send("User Not Found!");
  }
};

module.exports = {
  verifyEmail,
  resendVerificationEmail,
  sendResetPasswordEmail,
};
