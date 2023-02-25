const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const constants = require('../utils/constants');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: constants.errors.EMAIL_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ message: constants.messages.USER_CREATED, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: constants.errors.INVALID_CREDENTIALS });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: constants.errors.INVALID_CREDENTIALS });
    }

    const token = generateToken(user._id);
    res.status(200).json({ message: constants.messages.LOGGED_IN, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: constants.errors.SERVER_ERROR });
  }
};
