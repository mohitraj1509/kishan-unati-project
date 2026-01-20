const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies (if using cookies)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return sendResponse(res, 401, false, 'No user found with this token');
      }

      req.user = user;
      next();
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized to access this route');
    }
  } catch (error) {
    return sendResponse(res, 500, false, 'Server error');
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

// Check if user owns resource or is admin
const resourceOwnerOrAdmin = (resourceField = 'user') => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req[resourceField].toString() === req.user._id.toString()) {
      next();
    } else {
      return sendResponse(res, 403, false, 'Not authorized to access this resource');
    }
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid but don't fail - just continue without user
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  authorize,
  resourceOwnerOrAdmin,
  optionalAuth
};