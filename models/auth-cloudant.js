const dbCloudantConnect = require("../utils/dbCloudant");

let db;

// Initialize the DB when this module is loaded
function getDbConnection() {
  console.info(
    "Initializing Cloudant connection...",
    "items-cloudant.getDbConnection()"
  );
  dbCloudantConnect("quagrifresh_auth")
    .then((database) => {
      console.info(
        "Cloudant connection initialized.",
        "items-cloudant.getDbConnection()"
      );
      db = database;
    })
    .catch((err) => {
      console.error(
        "Error while initializing DB: " + err.message,
        "items-cloudant.getDbConnection()"
      );
      throw err;
    });
}

const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(id, (err, document) => {
      if (err) {
        if (err.message == "missing") {
          console.warn(`Document id ${id} does not exist.`, "findById()");
          resolve({ data: {}, statusCode: 404 });
        } else {
          console.error("Error occurred: " + err.message, "findById()");
          reject(err);
        }
      } else {
        resolve({ data: document, statusCode: 200 });
      }
    });
  });
};

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.find(
      {
        selector: {
          email: email,
        },
      },
      (err, result) => {
        if (err) {
          console.error("Error occurred: " + err.message, "findByEmail()");
          reject(err);
        } else {
          if (result.docs.length > 0) {
            resolve({ data: result.docs[0], statusCode: 200 });
          } else {
            resolve({ data: {}, statusCode: 404 });
          }
        }
      }
    );
  });
};

module.exports = {
  getDbConnection,
  findById,
  findByEmail,
};
