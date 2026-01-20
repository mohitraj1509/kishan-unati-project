const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrderStatus
} = require('../controllers/marketplace.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Product routes
// @route   GET /api/marketplace/products
// @desc    Get all products
// @access  Public
router.get('/products', getProducts);

// @route   GET /api/marketplace/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/products/:id', getProductById);

// @route   POST /api/marketplace/products
// @desc    Create new product
// @access  Private
router.post('/products', protect, createProduct);

// @route   PUT /api/marketplace/products/:id
// @desc    Update product
// @access  Private
router.put('/products/:id', protect, updateProduct);

// @route   DELETE /api/marketplace/products/:id
// @desc    Delete product
// @access  Private
router.delete('/products/:id', protect, deleteProduct);

// Order routes
// @route   GET /api/marketplace/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', protect, getOrders);

// @route   POST /api/marketplace/orders
// @desc    Create new order
// @access  Private
router.post('/orders', protect, createOrder);

// @route   PUT /api/marketplace/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/orders/:id/status', protect, updateOrderStatus);

module.exports = router;