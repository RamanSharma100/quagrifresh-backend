const jwt = require("jsonwebtoken");

const checkSeller = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = decoded;

    if (decoded.type !== "seller") {
      return res.status(401).json({
        message: "Please create seller account to perform this action!",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Please login first!",
    });
  }
};

module.exports = checkSeller;
