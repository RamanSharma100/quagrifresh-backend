require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

// add morgan
app.use(morgan("dev"));

// add cors
app.use(cors());

// add body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add routes
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to the Grasslanders Network Eccomerce website's official server",
  });
});

app.use("/api", require("./apis/index"));

// add port
const PORT = process.env.PORT || 5000;

// add listener
app.listen(PORT, () => {
  console.log(`Development server is running on http://localhost:${PORT}`);
});
