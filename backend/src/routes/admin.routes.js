const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateSystemSettings,
  updateUserStatus,
  getMarketplaceProducts,
  updateProductStatus,
  getSchemes,
  addScheme,
  updateSchemeStatus
} = require('../controllers/admin.controller');
const { login } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login (public)
// @access  Public
router.post('/login', login);

// All other admin routes require authentication and admin role
router.use(protect);
router.use(checkRole('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with details
// @access  Private/Admin
router.get('/users', getAllUsers);

// @route   PATCH /api/admin/users/:id/status
// @desc    Update user status
// @access  Private/Admin
router.patch('/users/:id/status', updateUserStatus);

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', getAllOrders);

// @route   GET /api/admin/marketplace/products
// @desc    Get all marketplace products
// @access  Private/Admin
router.get('/marketplace/products', getMarketplaceProducts);

// @route   PATCH /api/admin/marketplace/products/:id
// @desc    Update product status
// @access  Private/Admin
router.patch('/marketplace/products/:id', updateProductStatus);

// @route   GET /api/admin/schemes
// @desc    Get all schemes
// @access  Private/Admin
router.get('/schemes', getSchemes);

// @route   POST /api/admin/schemes
// @desc    Add new scheme
// @access  Private/Admin
router.post('/schemes', addScheme);

// @route   PATCH /api/admin/schemes/:id
// @desc    Update scheme status
// @access  Private/Admin
router.patch('/schemes/:id', updateSchemeStatus);

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private/Admin
router.put('/settings', updateSystemSettings);

module.exports = router;