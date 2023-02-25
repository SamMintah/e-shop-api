const Product = require('../models/product');
const constants = require('../utils/constants');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: constants.errors.PRODUCT_NOT_FOUND });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  try {
    const product = new Product({ name, price, description, imageUrl });
    await product.save();
    res.status(200).json({ message: constants.messages.PRODUCT_CREATED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const { name, price, description, imageUrl } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: constants.errors.PRODUCT_NOT_FOUND });
    } else {
      product.name = name;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      await product.save();
      res.status(200).json({ message: constants.messages.PRODUCT_UPDATED });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: constants.errors.PRODUCT_NOT_FOUND });
    } else {
      await product.remove();
      res.status(200).json({ message: constants.messages.PRODUCT_DELETED });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};
