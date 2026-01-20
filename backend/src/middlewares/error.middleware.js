const { logger } = require('../utils/logger');

// Handle MongoDB Cast Errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { message, statusCode: 400 };
};

// Handle MongoDB Duplicate Field Errors
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} - '${value}'. Please use another value!`;
  return { message, statusCode: 400 };
};

// Handle MongoDB Validation Errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return { message, statusCode: 400 };
};

// Handle JWT Errors
const handleJWTError = () => {
  return { message: 'Invalid token. Please log in again!', statusCode: 401 };
};

const handleJWTExpiredError = () => {
  return { message: 'Your token has expired! Please log in again.', statusCode: 401 };
};

// Send error in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err);

  // Log error
  logger.error('Error:', err.message);
  if (err.stack) {
    logger.error('Stack:', err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  AppError
};