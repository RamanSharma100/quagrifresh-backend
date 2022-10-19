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
        db: "quagrifresh_orders",
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

function findDocumentById(id) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .getDocument({
        db: "quagrifresh_orders",
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
        db: "quagrifresh_orders",
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
        db: "quagrifresh_orders",
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

function deleteDocument(id) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .deleteDocument({
        db: "quagrifresh_orders",
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

function findDocumentByUserId(userId) {
  return new Promise((resolve, reject) => {
    const client = new CloudantV1({
      authenticator: new IamAuthenticator({
        apikey: credentials.services.cloudantNoSQLDB.credentials.apikey,
      }),
      serviceUrl: credentials.services.cloudantNoSQLDB.credentials.url,
    });

    client
      .postFind({
        db: "quagrifresh_orders",
        selector: {
          userId: userId,
        },
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
  findDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  findDocumentByUserId,
};
