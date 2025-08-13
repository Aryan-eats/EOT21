/**
 * Wrapper for async controller functions to eliminate try-catch blocks
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function that catches errors
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
