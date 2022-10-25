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
        db: "quagrifresh_auth",
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
const findById = async (id) => {
  const allDocuments = await getAllDocuments();

  const document = allDocuments.rows.find((row) => row.doc._id === id);

  return document;
};

const findByEmail = async (email) => {
  const allDocuments = await getAllDocuments();

  const document = allDocuments.rows.find((row) => row.doc.email === email);

  return document;
};

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
        db: "quagrifresh_auth",
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
        db: "quagrifresh_auth",
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
  findById,
  findByEmail,
  createDocument,
  updateDocument,
};
