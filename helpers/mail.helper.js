const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_PASSWORD,
  },
  secure: false, // use SSL
  port: 25,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = (to, subject, html) => {
  const mailOptions = {
    from: process.env.OWNER_EMAIL,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
  transporter,
};
