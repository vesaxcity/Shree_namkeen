const express = require('express');
const { body } = require('express-validator');
const {
  createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validate } = require('../middleware/errorHandler');

const router = express.Router();

router.post('/',
  protect,
  [
    body('addressId').notEmpty().withMessage('Address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.variantId').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  validate,
  createOrder
);

router.get('/my-orders',    protect, getUserOrders);
router.get('/all',          protect, requireAdmin, getAllOrders);
router.get('/:orderNumber', protect, getOrder);
router.put('/:id/status',   protect, requireAdmin,
  [body('status').notEmpty()],
  validate,
  updateOrderStatus
);

module.exports = router;
