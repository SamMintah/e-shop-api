const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const constants = require('../utils/constants');

exports.createPaymentIntent = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  try {
    const amount = calculateOrderAmount(items);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

const calculateOrderAmount = (items) => {
  // Calculate the order total amount based on the item prices and quantities
  // You might also want to add shipping costs, taxes, or other fees here
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
