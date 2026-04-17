const Product = require('../models/Product');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const getAllProducts = async ({ search, category, page = 1, limit = 20 }) => {
  const query = { isAvailable: true };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (category && category !== 'All') {
    query.category = category;
  }

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { products, total, page: Number(page), limit: Number(limit) };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error(MESSAGES.PRODUCT_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return product;
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!product) {
    const error = new Error(MESSAGES.PRODUCT_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const error = new Error(MESSAGES.PRODUCT_NOT_FOUND);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return product;
};

const getCategories = async () => {
  const categories = await Product.distinct('category');
  return categories;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
