const Cart = require('../models/Cart');
const Product = require('../models/Product');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const getUserCart = async (userId) => {
  const cartItems = await Cart.find({ userId }).populate('productId');
  return cartItems;
};

const addToCart = async (userId, productId, quantity = 1) => {
  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error(MESSAGES.PRODUCT_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Upsert: if item already in cart, update quantity
  const cartItem = await Cart.findOneAndUpdate(
    { userId, productId },
    { $set: { quantity } },
    { returnDocument: 'after', upsert: true }
  ).populate('productId');

  return cartItem;
};

const updateCartItem = async (cartItemId, userId, quantity) => {
  const cartItem = await Cart.findOneAndUpdate(
    { _id: cartItemId, userId },
    { quantity },
    { returnDocument: 'after', runValidators: true }
  ).populate('productId');

  if (!cartItem) {
    const error = new Error(MESSAGES.CART_ITEM_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return cartItem;
};

const removeCartItem = async (cartItemId, userId) => {
  const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, userId });
  if (!cartItem) {
    const error = new Error(MESSAGES.CART_ITEM_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return cartItem;
};

const clearUserCart = async (userId) => {
  await Cart.deleteMany({ userId });
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
};
