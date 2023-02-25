const Cart = require('../models/cart');
const Product = require('../models/product');
const constants = require('../utils/constants');

exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ error: constants.errors.CART_NOT_FOUND });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: constants.errors.PRODUCT_NOT_FOUND });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.equals(product._id));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: product._id, quantity });
    }

    await cart.save();
    res.status(200).json({ message: constants.messages.ITEM_ADDED_TO_CART });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: constants.errors.CART_NOT_FOUND });
    }

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json({ message: constants.messages.ITEM_REMOVED_FROM_CART });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};
