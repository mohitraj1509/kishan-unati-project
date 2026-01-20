const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');
const paymentService = require('../services/payment.service');

// @desc    Get all products
// @route   GET /api/marketplace/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    sendResponse(res, 200, true, 'Products retrieved successfully', {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get product by ID
// @route   GET /api/marketplace/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone')
      .populate('reviews.user', 'name');

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    sendResponse(res, 200, true, 'Product retrieved successfully', product);
  } catch (error) {
    logger.error('Get product by ID error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Create new product
// @route   POST /api/marketplace/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.id
    };

    const product = await Product.create(productData);
    await product.populate('seller', 'name email');

    sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    logger.error('Create product error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update product
// @route   PUT /api/marketplace/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found or unauthorized');
    }

    sendResponse(res, 200, true, 'Product updated successfully', product);
  } catch (error) {
    logger.error('Update product error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Delete product
// @route   DELETE /api/marketplace/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id
    });

    if (!product) {
      return sendResponse(res, 404, false, 'Product not found or unauthorized');
    }

    sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    logger.error('Delete product error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get user's orders
// @route   GET /api/marketplace/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    })
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'name price images')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, 'Orders retrieved successfully', orders);
  } catch (error) {
    logger.error('Get orders error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Create new order
// @route   POST /api/marketplace/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    if (product.seller.toString() === req.user.id) {
      return sendResponse(res, 400, false, 'Cannot buy your own product');
    }

    const totalAmount = product.price * quantity;

    // Process payment
    const paymentResult = await paymentService.processPayment({
      amount: totalAmount,
      paymentMethod,
      userId: req.user.id
    });

    if (!paymentResult.success) {
      return sendResponse(res, 400, false, 'Payment failed');
    }

    const order = await Order.create({
      buyer: req.user.id,
      seller: product.seller,
      product: productId,
      quantity,
      totalAmount,
      paymentId: paymentResult.paymentId,
      status: 'confirmed'
    });

    await order.populate(['buyer', 'seller', 'product']);

    sendResponse(res, 201, true, 'Order created successfully', order);
  } catch (error) {
    logger.error('Create order error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update order status
// @route   PUT /api/marketplace/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    });

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    order.status = status;
    await order.save();
    await order.populate(['buyer', 'seller', 'product']);

    sendResponse(res, 200, true, 'Order status updated successfully', order);
  } catch (error) {
    logger.error('Update order status error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrderStatus
};