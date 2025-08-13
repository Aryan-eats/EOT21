import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Handles JWT token errors
 */
const handleJWTError = () => 
  new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');

/**
 * Handles JWT token expiration
 */
const handleJWTExpiredError = () => 
  new AppError('Your token has expired. Please log in again.', 401, 'EXPIRED_TOKEN');

/**
 * Handles MongoDB cast errors (invalid ID format)
 */
const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400, 'INVALID_DATA');
};

/**
 * Handles MongoDB duplicate key errors
 */
const handleDuplicateFieldsError = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/) 
    ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] 
    : '';
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 409, 'DUPLICATE_FIELD');
};

/**
 * Handles MongoDB validation errors
 */
const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 422, 'VALIDATION_ERROR', errors);
};

/**
 * Handles Multer file upload errors
 */
const handleMulterError = err => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size is 5MB.', 400, 'FILE_TOO_LARGE');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Invalid file field. Check your form field names.', 400, 'INVALID_FILE_FIELD');
  }
  return new AppError('File upload error.', 400, 'FILE_UPLOAD_ERROR');
};

/**
 * Sends development error response with full details
 */
const sendDevError = (err, res) => {
  Logger.error(`${err.statusCode} - ${err.message}`, err);
  
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errorCode: err.errorCode,
    details: err.details,
    error: {
      name: err.name,
      ...err
    },
    stack: err.stack
  });
};

/**
 * Sends production error response with limited details
 */
const sendProdError = (err, res) => {
  // Log all errors in production
  Logger.error(`${err.statusCode} - ${err.message}`, err);
  
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode, err.errorCode, err.details)
    );
  }
  
  // Programming or other unknown error: don't leak error details
  res.status(500).json(
    ApiResponse.error('Something went wrong', 500, 'INTERNAL_SERVER_ERROR')
  );
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default status code
  err.statusCode = err.statusCode || 500;
  err.errorCode = err.errorCode || 'UNKNOWN_ERROR';
  
  // Handle specific known errors
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.stack = err.stack;
  
  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFieldsError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (error.name === 'MulterError') error = handleMulterError(error);
  if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
    error = new AppError('Invalid JSON in request body', 400, 'INVALID_JSON');
  }
  
  // Send appropriate error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  Logger.request(req);
  next();
};

export default errorHandler;
