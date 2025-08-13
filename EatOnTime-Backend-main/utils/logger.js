/**
 * Logger utility for consistent logging across the application
 * Can be enhanced to integrate with external logging services like Winston
 */
class Logger {
  /**
   * Log informational message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  static info(message, data = {}) {
    console.log(`[INFO] ${message}`, data && Object.keys(data).length ? data : '');
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  static warn(message, data = {}) {
    console.warn(`[WARNING] ${message}`, data && Object.keys(data).length ? data : '');
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Error|Object} error - Error object or data
   */
  static error(message, error = {}) {
    const errorObj = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack } 
      : error;
    
    console.error(`[ERROR] ${message}`, errorObj);
  }

  /**
   * Log debug message (only in development)
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  static debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data && Object.keys(data).length ? data : '');
    }
  }

  /**
   * Log request information
   * @param {Object} req - Express request object
   */
  static request(req) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[REQUEST] ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        params: req.params,
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined
      });
    }
  }
}

export default Logger;
