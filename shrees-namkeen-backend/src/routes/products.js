const express = require('express');
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/',     optionalAuth, getAllProducts);
router.get('/:slug', optionalAuth, getProduct);

// Admin-only
router.post('/',       protect, requireAdmin, upload.array('images', 5), createProduct);
router.put('/:id',     protect, requireAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id',  protect, requireAdmin, deleteProduct);

module.exports = router;
