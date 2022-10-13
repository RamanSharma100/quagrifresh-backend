const Cloudant = require("@cloudant/cloudant");

const vcap = require("../config/vcap-local.json");

const dbCloudantConnect = (database_name) => {
  return new Promise((resolve, reject) => {
    Cloudant(
      {
        // eslint-disable-line
        url: vcap.services.cloudantNoSQLDB.credentials.url,
      },
      (err, cloudant) => {
        if (err) {
          console.error(
            "Connect failure: " +
              err.message +
              " for Cloudant DB: " +
              database_name
          );
          reject(err);
        } else {
          let db = cloudant.use(database_name);
          console.info("Connect success! Connected to DB: " + database_name);
          resolve(db);
        }
      }
    );
  });
};

module.exports = dbCloudantConnect;
