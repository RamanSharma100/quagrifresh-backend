const {
  createDocument,
  findDocumentByUserId,
  findDocumentById,
  updateDocument,
  deleteDocument,
} = require("../models/cart-cloudant");

const createCart = async (req, res) => {
  const { items, eventCart, event } = req.body;

  if (!items || !eventCart || !event) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields!" });
  }

  const userId = req.user._id;

  // check if items are empty
  if (items.length === 0) {
    return res.status(400).json({ message: "Please provide items!" });
  }

  // calculate total
  let total = 0;
  items.map((item) => {
    total += item.price * item.quantity;
  });

  // create cart
  const cart = {
    total,
    items,
    eventCart,
    event,
    createdBy: userId,
  };

  try {
    const newCart = await createDocument(cart);
    res
      .status(201)
      .json({ msg: "Cart created Successfully!", cart: newCart.doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong!" });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ msg: "Please provide user id!" });
  }

  let cart;

  try {
    cart = await findDocumentByUserId(userId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Cart not found!!" });
  }

  return res.status(200).json({ cart, msg: "Cart found!" });
};

const updateCart = async (req, res) => {
  const { items } = req.body;
  const { cartId } = req.params;

  if (!cartId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  if (!items) {
    return res.status(400).json({ msg: "Please provide items!" });
  }

  // find cart
  let cart;
  try {
    cart = await findDocumentById(cartId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Cart not found!" });
  }

  return res.status(200).json({ cart, msg: "Cart found!" });
  // calculate total
  let total = 0;
  items.forEach((item) => {
    total += item.price * item.quantity;
  });

  // update cart
  cart.items = items;
  cart.total += total;
};

const deleteCart = async (req, res) => {
  const { cartId } = req.params;

  if (!cartId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  // check cart exists
  let cart;

  try {
    cart = await findDocumentById(cartId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Cart not found!" });
  }

  return res.status(200).json({ cart, msg: "Cart found!" });

  // try {
  //   await deleteDocument(cartId);
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ msg: "Something went wrong!" });
  // }

  // return res.status(200).json({ msg: "Cart deleted successfully!" });
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart,
};
