const {
  getAllDocuments,
  getDocument,
  createDocument,
  updateDocument,
} = require("../models/product-cloudant");
const { uploadImage } = require("../helpers/cloudinary.helper");
const fs = require("fs");

const getProducts = async (req, res) => {
  try {
    const products = await getAllDocuments();
    res.status(200).json({ products, msg: "Products retrieved successfully" });
  } catch (err) {
    res.status(500).json({ err, msg: "Error retrieving products!" });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "Invalid request!" });
  }

  try {
    const product = await getDocument(id);
    res.status(200).json({ product, msg: "Product retrieved successfully!" });
  } catch (err) {
    res.status(500).json({ err, msg: "Error retrieving product!" });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, colors, category, stock, productBy } =
    req.body;

  if (!name || !price || !description || !category || !stock || !colors) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }
  const product = {
    name,
    price: parseFloat(price),
    description,
    images: [],
    colors,
    category,
    stock: parseInt(stock),
    productBy,
    left: stock,
    sold: 0,
    rating: [],
    views: 0,
    inStock: true,
    buyers: [],
  };

  try {
    const newProduct = await createDocument(product);
    // upload images to cloudinary with promises
    const promises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          uploadImage(file.path, newProduct.id, "quagrifresh_products")
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              reject(err);
            });
        })
    );
    const results = await Promise.all(promises);
    product.images = results;
    product._id = newProduct.id;
    product._rev = newProduct.rev;

    const updatedProduct = await updateDocument(product);

    // delete files from server
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    res.status(201).json({
      product: newProduct,
      msg: "Product created successfully!",
      updatedProduct: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ err, msg: "Error creating product!" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
