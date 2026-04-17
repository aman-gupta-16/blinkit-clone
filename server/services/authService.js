const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error(MESSAGES.USER_EXISTS);
    error.statusCode = HTTP_STATUS.CONFLICT;
    throw error;
  }

  const user = await User.create({ name, email, password });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken({ id: user._id }),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error(MESSAGES.INVALID_CREDENTIALS);
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken({ id: user._id }),
  };
};

module.exports = { registerUser, loginUser };
