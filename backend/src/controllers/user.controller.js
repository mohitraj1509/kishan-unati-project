const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    sendResponse(res, 200, true, 'Profile retrieved successfully', user);
  } catch (error) {
    logger.error('Get profile error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'location', 'farmDetails', 'preferences'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Handle nested objects like farmDetails and location
        if (typeof req.body[field] === 'object' && req.body[field] !== null) {
          updates[field] = {};
          Object.keys(req.body[field]).forEach(subField => {
            const value = req.body[field][subField];
            // Skip empty strings for enum fields
            if (value !== '' && value !== undefined) {
              updates[field][subField] = value;
            }
          });
          // If the object is empty after filtering, don't include it
          if (Object.keys(updates[field]).length === 0) {
            delete updates[field];
          }
        } else {
          // For non-object fields, skip empty strings
          if (req.body[field] !== '') {
            updates[field] = req.body[field];
          }
        }
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'Profile updated successfully', user);
  } catch (error) {
    logger.error('Update profile error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    sendResponse(res, 200, true, 'Users retrieved successfully', {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['farmer', 'buyer', 'admin'].includes(role)) {
      return sendResponse(res, 400, false, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User role updated successfully', user);
  } catch (error) {
    logger.error('Update user role error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User deleted successfully');
  } catch (error) {
    logger.error('Delete user error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUsers,
  updateUserRole,
  deleteUser
};