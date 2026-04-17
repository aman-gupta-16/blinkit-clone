const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 3 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'packing', 'out_for_delivery', 'delivered'],
      default: 'confirmed',
    },
    deliveryAddress: { type: String, default: '' },
    estimatedDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
