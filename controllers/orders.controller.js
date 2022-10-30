const { getAllDocuments, createDocument } = require("../models/order-cloudant");
const {
  findDocumentById: findCartById,
  updateDocument: updateCartDocument,
} = require("../models/cart-cloudant");
const { findById: findUserById } = require("../models/auth-cloudant");
const {
  getAllDocuments: getAllProducts,
} = require("../models/product-cloudant");

const { v4: uuidv4 } = require("uuid");

const createOrder = async (req, res) => {
  const {
    cartItems,
    checkedOut,
    cartId,
    cartTotal,
    cartTotalQuantity,
    userId,
    userName,
    userEmail,
    billingAddress,
    shippingAddress,
    status,
    procesed,
    createdDate,
    updatedDate,
    long,
    lat,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "Please provide userId!" });
  }

  if (!cartItems) {
    return res.status(400).json({ msg: "Please provide cartItems!" });
  }

  if (!cartId) {
    return res.status(400).json({ msg: "Please provide cartId!" });
  }

  // find cart
  let cart;
  try {
    cart = await findCartById(cartId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Cart not found!" });
  }

  const allOrders = await getAllDocuments();

  const findDistance = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  // find all the orders within 1km  of current order

  const newOrder = {
    cartItems,
    cartTotal,
    cartTotalQuantity,
    userId,
    userName,
    userEmail,
    billingAddress,
    shippingAddress,
    status,
    procesed,
    createdDate,
    updatedDate,
    long,
    lat,
  };

  let area = {
    name: uuidv4(),
  };

  const ordersWithin1km =
    allOrders.rows.length > 0
      ? allOrders.rows.filter((order) => {
          const distance = findDistance(
            lat,
            long,
            order.doc.lat,
            order.doc.long
          );

          if (distance <= 1) {
            if (order.doc.shippingAddress.area) {
              area = order.doc.shippingAddress.area;
            }
            return order.doc._id;
          }
        })
      : [];

  newOrder.area = area;

  if (ordersWithin1km.length > 0) {
    newOrder.deliveryCost = 100 + (ordersWithin1km.length - 1) * 10;
  } else {
    newOrder.deliveryCost = 100;
  }

  newOrder.orderTotal =
    parseFloat(newOrder.cartTotal) + parseFloat(newOrder.deliveryCost);

  // create order
  try {
    const order = await createDocument(newOrder);

    // empty cart
    cart.cartItems = [];
    cart.cartTotal = 0;
    cart.cartTotalQuantity = 0;
    cart.checkedOut = true;
    cart.updatedDate = new Date().toISOString();

    // update cart
    try {
      await updateCartDocument(cart);
      return res
        .status(201)
        .json({ order, msg: "Order created successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Cart not updated!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Order creation failed!" });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }
  res.status(200).json({ msg: "Order delete api!", orderId });
};

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }
  res.status(200).json({ msg: "Order get api!", orderId });
};

const getMyOrder = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  const user = await findUserById(userId);
  const allOrders = await getAllDocuments();
  const products = await getAllProducts();

  if (user.doc.type === "seller") {
    const myOrders = allOrders.rows.filter((order) => {
      const orderItems = order.doc.cartItems.filter((item) => {
        const product = products.rows.find((product) => {
          return product.doc._id === item.product;
        });
        if (product.doc.productBy === userId) {
          return item;
        }
      });
      if (orderItems.length > 0) {
        return order.doc;
      }
    });
    return res.status(200).json({ myOrders, msg: "My Orders!" });
  } else {
    const myOrders = allOrders.rows.filter((order) => {
      if (order.doc.userId === userId) {
        return order.doc;
      }
    });
    return res.status(200).json({ myOrders, msg: "My Orders!" });
  }
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }
  res.status(200).json({ msg: "Order update api!", orderId });
};

module.exports = {
  createOrder,
  deleteOrder,
  getOrder,
  updateOrder,
  getMyOrder,
};
