const checkSeller = require("./checkSeller.middleware");
const checkAuth = require("./checkAuth.middleware");

module.exports = {
  checkSeller,
  checkAuth,
};
