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

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    sendResponse(res, 200, true, 'User status updated successfully', { user });
  } catch (error) {
    logger.error('Update user status error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get all products for marketplace control
// @route   GET /api/admin/marketplace/products
// @access  Private/Admin
const getMarketplaceProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Products retrieved successfully', { products });
  } catch (error) {
    logger.error('Get marketplace products error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update product status
// @route   PATCH /api/admin/marketplace/products/:id
// @access  Private/Admin
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    sendResponse(res, 200, true, 'Product status updated successfully', { product });
  } catch (error) {
    logger.error('Update product status error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get all schemes
// @route   GET /api/admin/schemes
// @access  Private/Admin
const getSchemes = async (req, res) => {
  try {
    // Mock schemes data - in production, this would come from a database
    const schemes = [
      {
        _id: '1',
        title: 'PM-KISAN',
        description: 'Direct income support of Rs. 6000 per year to all farmer families',
        category: 'Financial Support',
        eligibility: 'All farmer families',
        benefits: 'Rs. 6000 per year in three installments',
        status: 'active',
        applicants: 150
      },
      {
        _id: '2',
        title: 'Soil Health Card',
        description: 'Provides information on soil health and recommendations',
        category: 'Soil Management',
        eligibility: 'All farmers',
        benefits: 'Free soil testing and recommendations',
        status: 'active',
        applicants: 80
      }
    ];

    sendResponse(res, 200, true, 'Schemes retrieved successfully', { schemes });
  } catch (error) {
    logger.error('Get schemes error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Add new scheme
// @route   POST /api/admin/schemes
// @access  Private/Admin
const addScheme = async (req, res) => {
  try {
    const schemeData = req.body;
    // In production, save to database
    logger.info('New scheme added:', schemeData);

    sendResponse(res, 201, true, 'Scheme added successfully', { scheme: schemeData });
  } catch (error) {
    logger.error('Add scheme error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update scheme status
// @route   PATCH /api/admin/schemes/:id
// @access  Private/Admin
const updateSchemeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const schemeId = req.params.id;

    logger.info('Scheme status updated:', schemeId, status);

    sendResponse(res, 200, true, 'Scheme status updated successfully', { 
      schemeId, 
      status 
    });
  } catch (error) {
    logger.error('Update scheme status error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
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
};