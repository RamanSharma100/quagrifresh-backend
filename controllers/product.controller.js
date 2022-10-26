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
    // extract secure_url from results
    const images = results.map((result) => ({
      secure_url: result.secure_url,
      original_filename: result.original_filename,
    }));
    product.images = images;
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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    stock,
    description,
    inStock,
    category,
    colors,
    left,
    sold,
    views,
    rating,
    buyers,
    productBy,
  } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Invalid request!" });
  }

  if (!name || !price || !description || !category || !stock || !colors) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }

  let product;
  try {
    product = await getDocument(id);
  } catch (err) {
    return res.status(500).json({ err, msg: "Error retrieving product!" });
  }

  // check if product by user
  if (product.productBy !== productBy) {
    return res
      .status(400)
      .json({ msg: "You are not authorized to update this product!" });
  }

  // update product
  product.name = name;
  product.price = price;
  product.description = description;
  product.colors = colors;
  product.category = category;
  product.stock = stock;
  product.left = left;
  product.sold = sold;
  product.views = views;
  product.rating = rating;
  product.inStock = inStock;
  product.buyers = buyers;

  try {
    const updatedProduct = await updateDocument(product);
    return res
      .status(200)
      .json({ product: updatedProduct, msg: "Product updated successfully!" });
  } catch (err) {
    res.status(500).json({ err, msg: "Error updating product!" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { productBy } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "Invalid request!" });
  }

  let product;
  try {
    product = await getDocument(id);
  } catch (err) {
    return res.status(500).json({ err, msg: "Error retrieving product!" });
  }

  // check if product by user
  if (product.productBy !== productBy) {
    return res
      .status(400)
      .json({ msg: "You are not authorized to delete this product!" });
  }

  try {
    const deletedProduct = await deleteDocument(product);
    return res
      .status(200)
      .json({ product: deletedProduct, msg: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json({ err, msg: "Error deleting product!" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
