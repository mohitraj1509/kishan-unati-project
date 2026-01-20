const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, location, role } = req.body;

    // Check if user exists (convert email to lowercase)
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return sendResponse(res, 400, false, 'User already exists');
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password, // Plain password, will be hashed by model
      phone,
      location: {
        address: location?.address || '',
        district: location?.district || '',
        state: location?.state || '',
        pincode: location?.pincode || '',
        coordinates: [0, 0] // Default coordinates, can be updated later
      },
      role: role || 'farmer'
    });

    const token = generateToken(user._id);

    sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('Register error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('Login attempt for email:', email);

    // Check for user (convert email to lowercase for consistency)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      logger.warn('User not found for email:', email);
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    logger.info('User found:', user.email);
    logger.info('Stored password hash:', user.password);

    // Check password
    let isMatch = await bcrypt.compare(password, user.password);
    logger.info('Password comparison result:', isMatch);

    // If not match, check if it's double-hashed (legacy issue)
    if (!isMatch) {
      const firstHash = await bcrypt.hash(password, 10);
      const secondHash = await bcrypt.hash(firstHash, 10);
      if (secondHash === user.password) {
        // Password is double-hashed, update to single hash
        user.password = firstHash;
        await user.save();
        isMatch = true;
        logger.info('Updated double-hashed password for user:', email);
      }
    }

    logger.info('Final password match:', isMatch);

    if (!isMatch) {
      logger.warn('Password mismatch for user:', email);
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    const token = generateToken(user._id);

    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    sendResponse(res, 200, true, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendResponse(res, 401, false, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.id);

    sendResponse(res, 200, true, 'Token refreshed', { token: newToken });
  } catch (error) {
    logger.error('Refresh token error:', error);
    sendResponse(res, 401, false, 'Invalid token');
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken
};