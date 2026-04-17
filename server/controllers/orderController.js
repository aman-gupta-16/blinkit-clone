const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/orderService');
const cartService = require('../services/cartService');
const HTTP_STATUS = require('../constants/httpStatus');


const placeOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress } = req.body;

  // Fetch the user's current cart (populated)
  const cartItems = await cartService.getUserCart(req.user._id);

  // Filter out any items where the product was deleted
  const validItems = cartItems.filter((i) => i.productId !== null && i.productId !== undefined);

  if (!validItems.length) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Your cart is empty or contains only unavailable products');
  }

  const totalAmount = validItems.reduce(
    (s, i) => s + (i.productId?.price || 0) * i.quantity, 0
  );
  const deliveryFee = totalAmount < 199 ? 25 : 0;

  const order = await orderService.createOrder(req.user._id, {
    items: validItems,
    deliveryFee,
    deliveryAddress,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});


const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: orders });
});


const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: order });
});


const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(HTTP_STATUS.OK).json({ success: true, data: orders });
});

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders };
