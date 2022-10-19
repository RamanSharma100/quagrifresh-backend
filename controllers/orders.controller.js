const createOrder = async (req, res) => {
  const { cartId } = req.params;
  const { shippingAddress } = req.body;

  if (!cartId) {
    return res.status(400).json({ msg: "Invalid Request!" });
  }

  if (!userId) {
    return res.status(400).json({ msg: "Please provide userId!" });
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
};
