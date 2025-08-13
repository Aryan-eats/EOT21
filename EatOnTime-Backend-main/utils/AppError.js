/**
 * Custom application error class that extends the built-in Error class.
 * Provides additional properties for handling HTTP status codes and operational status.
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * 
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Application-specific error code for frontend handling
   * @param {Array|Object} details - Additional error details (validation errors, etc.)
   */
  constructor(message, statusCode, errorCode = null, details = null) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errorCode = errorCode || this._generateErrorCode(statusCode);
    this.isOperational = true;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Generates a default error code based on status code if none provided
   */
  _generateErrorCode(statusCode) {
    const codeMap = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE'
    };
    
    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }
}

export default AppError;
