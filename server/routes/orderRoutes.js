const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrder, getAllOrders } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// All order routes are protected
router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/:orderId', getOrder);

module.exports = router;
