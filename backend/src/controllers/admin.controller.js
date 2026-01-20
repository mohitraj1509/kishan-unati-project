const User = require('../models/User.model');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const farmersCount = await User.countDocuments({ role: 'farmer' });
    const buyersCount = await User.countDocuments({ role: 'buyer' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Get product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Get revenue statistics (simplified)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get monthly statistics (last 12 months)
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const stats = {
      users: {
        total: totalUsers,
        farmers: farmersCount,
        buyers: buyersCount,
        admins: adminsCount
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders
      },
      products: {
        total: totalProducts,
        active: activeProducts
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyStats
      },
      generatedAt: new Date()
    };

    sendResponse(res, 200, true, 'Dashboard statistics retrieved successfully', stats);
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get all users with details
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;

    let query = {};

    if (role) query.role = role;
    if (status === 'verified') query.isVerified = true;
    if (status === 'unverified') query.isVerified = false;

    const users = await User.find(query)
      .select('-password')
      .populate('farmDetails.crops', 'name category')
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
    logger.error('Get all users error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    let query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .populate('product', 'name price images')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    // Calculate total revenue for filtered orders
    const revenueResult = await Order.aggregate([
      { $match: { ...query, status: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    sendResponse(res, 200, true, 'Orders retrieved successfully', {
      orders,
      summary: {
        totalOrders,
        totalRevenue
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get all orders error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    // In a real implementation, you'd have a Settings model
    // For now, just acknowledge the update
    logger.info('System settings updated by admin:', req.user._id, settings);

    sendResponse(res, 200, true, 'System settings updated successfully', {
      updatedBy: req.user._id,
      updatedAt: new Date(),
      settings
    });
  } catch (error) {
    logger.error('Update system settings error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateSystemSettings
};