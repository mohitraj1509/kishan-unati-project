const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateSystemSettings
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(checkRole(['admin']));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with details
// @access  Private/Admin
router.get('/users', getAllUsers);

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', getAllOrders);

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private/Admin
router.put('/settings', updateSystemSettings);

module.exports = router;