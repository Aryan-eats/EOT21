/**
 * Standard API response formatter
 */
class ApiResponse {
  /**
   * Creates a successful response
   * 
   * @param {Object|Array} data - Response data
   * @param {string} message - Success message
   * @param {Object} meta - Optional metadata (pagination, etc)
   * @returns {Object} Formatted API response
   */
  static success(data = null, message = 'Success', meta = null) {
    const response = {
      success: true,
      message,
      data,
      errorCode: null
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  /**
   * Creates a paginated response
   * 
   * @param {Object|Array} data - Response data
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total item count
   * @param {string} message - Success message
   * @returns {Object} Formatted paginated API response
   */
  static paginated(data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);
    
    return this.success(data, message, {
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  }

  /**
   * Creates an error response
   * 
   * @param {string} message - Error message
   * @param {string} errorCode - Application error code
   * @param {Array|Object} details - Error details (validation errors, etc)
   * @returns {Object} Formatted error response
   */
  static error(message = 'An error occurred', errorCode = 'UNKNOWN_ERROR', details = null) {
    const response = {
      success: false,
      message,
      data: null,
      errorCode
    };

    if (details) {
      response.details = details;
    }

    return response;
  }
}

export default ApiResponse;
