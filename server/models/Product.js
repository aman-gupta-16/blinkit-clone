const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    unit: {
      type: String,
      default: '1 pc',
    },
    stock: {
      type: Number,
      required: true,
      default: 100,
      min: [0, 'Stock cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deliveryTime: {
      type: String,
      default: '10 mins',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
