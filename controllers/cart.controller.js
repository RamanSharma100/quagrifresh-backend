const {
  createDocument,
  findDocumentByUserId,
  findDocumentById,
  updateDocument,
  deleteDocument,
} = require("../models/cart-cloudant");

const createCart = async (req, res) => {
  const { cartItems, checkedOut, cartTotal, cartTotalQuantity, userId } =
    req.body;

  if (!cartItems || !cartTotal || !cartTotalQuantity) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields!" });
  }

  // check if items are empty
  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Please provide items!" });
  }

  // create cart
  const cart = {
    cartItems,
    checkedOut,
    cartTotal,
    cartTotalQuantity,
    createdBy: userId,
  };

  try {
    const newCart = await createDocument(cart);
    res.status(201).json({ msg: "Cart created Successfully!", cart: newCart });
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

  return res.status(200).json({ cart: cart.docs[0], msg: "Cart found!" });
};

const updateCart = async (req, res) => {
  const { cartItems, checkedOut, cartTotal, cartTotalQuantity, userId } =
    req.body;
  const { cartId } = req.params;

  if (!cartId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  if (!cartItems || !cartTotal || !cartTotalQuantity) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields!" });
  }

  // find cart
  let cart;
  try {
    cart = await findDocumentById(cartId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Cart not found!" });
  }

  if (cart.createdBy !== userId) {
    return res.status(401).json({ msg: "Unauthorized!" });
  }

  // update cart
  const updatedCart = {
    cartItems,
    checkedOut,
    cartTotal,
    cartTotalQuantity,
    createdBy: userId,
    _id: cart._id,
    _rev: cart._rev,
  };

  try {
    const updateCart = await updateDocument(updatedCart);
    res
      .status(201)
      .json({ msg: "Cart updated Successfully!", cart: updatedCart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong!" });
  }
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
