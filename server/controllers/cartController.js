const asyncHandler = require('../utils/asyncHandler');
const cartService = require('../services/cartService');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');


const getCart = asyncHandler(async (req, res) => {
  const cartItems = await cartService.getUserCart(req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: cartItems });
});


const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('productId is required');
  }

  const cartItem = await cartService.addToCart(req.user._id, productId, quantity);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CART_ITEM_ADDED,
    data: cartItem,
  });
});


const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Quantity must be at least 1');
  }

  const cartItem = await cartService.updateCartItem(req.params.id, req.user._id, quantity);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART_ITEM_UPDATED,
    data: cartItem,
  });
});


const removeCartItem = asyncHandler(async (req, res) => {
  await cartService.removeCartItem(req.params.id, req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART_ITEM_REMOVED,
  });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
