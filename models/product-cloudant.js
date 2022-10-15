const credentials = require("../config/vcap-local.json");
const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");
function getAllDocuments() {
  const client = new CloudantV1({
    authenticator: new IamAuthenticator({
      apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
    }),
    serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
  });

  return new Promise((resolve, reject) => {
    client
      .postAllDocs({
        db: "quagrifresh_products",
        includeDocs: true,
      })
      .then((response) => {
        resolve(response.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getDocument(id) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .getDocument({
        db: "quagrifresh_products",
        docId: id,
      })
      .then((response) => {
        resolve(response.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function createDocument(document) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .postDocument({
        db: "quagrifresh_products",
        document: document,
      })
      .then((response) => {
        resolve(response.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function updateDocument(document) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .putDocument({
        db: "quagrifresh_products",
        docId: document._id,
        document: document,
      })
      .then((response) => {
        resolve(response.result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
};
