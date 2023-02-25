const Order = require('../models/order');
const constants = require('../utils/constants');

exports.getOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.createOrder = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  try {
    const order = new Order({ userId, items });
    await order.save();
    res.status(200).json({ message: constants.messages.ORDER_CREATED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};
