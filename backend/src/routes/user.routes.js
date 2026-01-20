const express = require('express');
const {
  getProfile,
  updateProfile,
  getUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, checkRole(['admin']), getUsers);

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private/Admin
router.put('/:id/role', protect, checkRole(['admin']), updateUserRole);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, checkRole(['admin']), deleteUser);

module.exports = router;