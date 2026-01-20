const { sendResponse } = require('../utils/response');

// Check if user has required role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendResponse(res, 401, false, 'Authentication required');
  }

  if (req.user.role !== 'admin') {
    return sendResponse(res, 403, false, 'Admin access required');
  }

  next();
};

// Check if user is farmer
const requireFarmer = (req, res, next) => {
  if (!req.user) {
    return sendResponse(res, 401, false, 'Authentication required');
  }

  if (req.user.role !== 'farmer') {
    return sendResponse(res, 403, false, 'Farmer access required');
  }

  next();
};

// Check if user is buyer
const requireBuyer = (req, res, next) => {
  if (!req.user) {
    return sendResponse(res, 401, false, 'Authentication required');
  }

  if (req.user.role !== 'buyer') {
    return sendResponse(res, 403, false, 'Buyer access required');
  }

  next();
};

// Allow multiple roles
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `Access denied. Allowed roles: ${roles.join(', ')}`);
    }

    next();
  };
};

// Check ownership or admin access
const ownerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, false, 'Authentication required');
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];

    if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
      next();
    } else {
      return sendResponse(res, 403, false, 'Access denied. Owner or admin access required');
    }
  };
};

module.exports = {
  checkRole,
  requireAdmin,
  requireFarmer,
  requireBuyer,
  allowRoles,
  ownerOrAdmin
};