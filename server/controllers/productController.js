const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/productService');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');


const getProducts = asyncHandler(async (req, res) => {
  const { search, category, page, limit } = req.query;
  const result = await productService.getAllProducts({ search, category, page, limit });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});


const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: product });
});


const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.status(HTTP_STATUS.OK).json({ success: true, data: categories });
});


const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.PRODUCT_CREATED,
    data: product,
  });
});


const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PRODUCT_UPDATED,
    data: product,
  });
});


const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PRODUCT_DELETED,
  });
});

module.exports = {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
