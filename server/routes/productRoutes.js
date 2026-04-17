const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Public
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin only
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
