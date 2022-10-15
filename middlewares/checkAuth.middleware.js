const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userData = decoded;
    console.log(req.userData);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Please login first!",
    });
  }
};

module.exports = checkAuth;
