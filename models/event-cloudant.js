const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");

function getAllDocuments() {
  const client = new CloudantV1({
    authenticator: new IamAuthenticator({
      apikey: process.env.CLOUDANT_API_KEY,
    }),
    serviceUrl: process.env.CLOUDANT_URL,
  });

  return new Promise((resolve, reject) => {
    client
      .postAllDocs({
        db: "quagrifresh_events",
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    client
      .getDocument({
        db: "quagrifresh_events",
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    client
      .postDocument({
        db: "quagrifresh_events",
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    client
      .putDocument({
        db: "quagrifresh_events",
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    client
      .deleteDocument({
        db: "quagrifresh_events",
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

module.exports = {
  getAllDocuments,
  findDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
