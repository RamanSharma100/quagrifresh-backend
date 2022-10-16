const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImage(file, docId, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        folder: folder + "/" + docId,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function deleteFolder(folder, docId) {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_folder(folder + "/" + docId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteImage(folder, docId, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      folder + "/" + docId + "/" + publicId,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function getImages(folder, docId) {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources(
      {
        type: "upload",
        prefix: folder + "/" + docId,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function getImage(folder, docId, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(
      folder + "/" + docId + "/" + publicId,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function updateImage(file, folder, docId, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        public_id: folder + "/" + docId + "/" + publicId,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function getCloudinaryUrl(folder, docId, publicId) {
  return cloudinary.url(folder + "/" + docId + "/" + publicId);
}

module.exports = {
  uploadImage,
  deleteFolder,
  deleteImage,
  getImages,
  getImage,
  updateImage,
  getCloudinaryUrl,
};
