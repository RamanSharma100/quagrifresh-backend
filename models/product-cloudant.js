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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
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
        apikey: process.env.CLOUDANT_API_KEY,
      }),
      serviceUrl: process.env.CLOUDANT_URL,
    });

    client
      .putDocument({
        db: "quagrifresh_products",
        docId: document._id,
        document: document,
      })
      .then((response) => {
        resolve(response.result);
        console.log(response.result);
      })
      .catch((err) => {
        console.log(err);
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
