const {
  getAllDocuments,
  getDocument,
  createDocument,
} = require("../models/product-cloudant");

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
  const {
    name,
    price,
    description,
    images,
    colors,
    category,
    stock,
    productBy,
  } = req.body;

  if (
    !name ||
    !price ||
    !description ||
    !images ||
    !category ||
    !stock ||
    !colors
  ) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }

  const product = {
    name,
    price,
    description,
    images,
    colors,
    category,
    stock,
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
    res
      .status(201)
      .json({ product: newProduct, msg: "Product created successfully!" });
  } catch (err) {
    res.status(500).json({ err, msg: "Error creating product!" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
