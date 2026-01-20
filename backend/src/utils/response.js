// Standardized API response format
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  // Add request ID if available (for tracking)
  if (res.req && res.req.id) {
    response.requestId = res.req.id;
  }

  res.status(statusCode).json(response);
};

// Success response helper
const sendSuccess = (res, message, data = null, statusCode = 200, meta = null) => {
  sendResponse(res, statusCode, true, message, data, meta);
};

// Error response helper
const sendError = (res, message, statusCode = 500, data = null) => {
  sendResponse(res, statusCode, false, message, data);
};

// Pagination helper
const sendPaginatedResponse = (res, message, data, pagination, statusCode = 200) => {
  const meta = { pagination };
  sendResponse(res, statusCode, true, message, data, meta);
};

// Validation error helper
const sendValidationError = (res, errors) => {
  sendResponse(res, 400, false, 'Validation failed', { errors });
};

// Not found helper
const sendNotFound = (res, resource = 'Resource') => {
  sendResponse(res, 404, false, `${resource} not found`);
};

// Unauthorized helper
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  sendResponse(res, 401, false, message);
};

// Forbidden helper
const sendForbidden = (res, message = 'Access forbidden') => {
  sendResponse(res, 403, false, message);
};

// Conflict helper
const sendConflict = (res, message = 'Resource conflict') => {
  sendResponse(res, 409, false, message);
};

// Too many requests helper
const sendTooManyRequests = (res, message = 'Too many requests') => {
  sendResponse(res, 429, false, message);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendPaginatedResponse,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendConflict,
  sendTooManyRequests
};