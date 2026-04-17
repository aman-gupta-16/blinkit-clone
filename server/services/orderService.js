const Order = require('../models/Order');
const Cart = require('../models/Cart');
const HTTP_STATUS = require('../constants/httpStatus');

// Status progression timings (in ms)
const STATUS_TIMINGS = {
  packing: 2 * 60 * 1000,        //  2 minutes
  out_for_delivery: 5 * 60 * 1000, //  5 minutes
  delivered: 10 * 60 * 1000,      // 10 minutes
};

/**
 * Schedule automatic status transitions for an order.
 * Fires 3 setTimeout calls — one per status step.
 */
const scheduleStatusUpdates = (orderId) => {
  const steps = [
    { status: 'packing', delay: STATUS_TIMINGS.packing },
    { status: 'out_for_delivery', delay: STATUS_TIMINGS.out_for_delivery },
    { status: 'delivered', delay: STATUS_TIMINGS.delivered },
  ];

  steps.forEach(({ status, delay }) => {
    setTimeout(async () => {
      try {
        const update = { status };
        if (status === 'delivered') update.deliveredAt = new Date();
        await Order.findOneAndUpdate({ orderId }, update);
        console.log(`Order ${orderId} -> ${status}`);
      } catch (err) {
        console.error(`Status update failed for ${orderId}:`, err.message);
      }
    }, delay);
  });
};

const createOrder = async (userId, { items, deliveryFee, deliveryAddress }) => {
  if (!items || items.length === 0) {
    const err = new Error('No items in order');
    err.statusCode = HTTP_STATUS.BAD_REQUEST;
    throw err;
  }

  // Build item snapshots (so product changes don't affect historical orders)
  const orderItems = items.map((item) => {
    const p = item.productId; // populated product object from cart
    return {
      productId: p._id || p,
      name: p.name || item.name,
      image: p.image || item.image || '',
      price: p.price || item.price,
      originalPrice: p.originalPrice || 0,
      unit: p.unit || item.unit || '',
      quantity: item.quantity,
    };
  });

  const totalAmount = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const platformFee = 3;
  const fee = deliveryFee ?? (totalAmount < 199 ? 25 : 0);
  const grandTotal = totalAmount + fee + platformFee;
  const orderId = `BLK${Date.now().toString().slice(-8)}`;
  const estimatedDeliveryAt = new Date(Date.now() + 10 * 60 * 1000);

  const order = await Order.create({
    orderId,
    userId,
    items: orderItems,
    totalAmount,
    deliveryFee: fee,
    platformFee,
    grandTotal,
    deliveryAddress: deliveryAddress || 'Baltana, Zirakpur, Punjab 140603',
    estimatedDeliveryAt,
  });

  // Clear the user's cart after placing the order
  await Cart.deleteMany({ userId });

  // Kick off background status transitions
  scheduleStatusUpdates(orderId);

  return order;
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  return orders;
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ orderId, userId });
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return order;
};

// Admin — get all orders
const getAllOrders = async () => {
  return await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
};
