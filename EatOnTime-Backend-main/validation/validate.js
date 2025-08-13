import { z } from 'zod';
import AppError from '../utils/AppError.js';

/**
 * Validate request data against a Zod schema
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Extract data to validate based on schema shape
    const dataToValidate = {};
    
    if (schema.body) dataToValidate.body = req.body;
    if (schema.query) dataToValidate.query = req.query;
    if (schema.params) dataToValidate.params = req.params;
    
    // Create a combined schema from the provided parts
    const combinedSchema = z.object({
      body: schema.body || z.any(),
      query: schema.query || z.any(),
      params: schema.params || z.any()
    });
    
    // Validate the data
    const result = combinedSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      // Format zod errors into a more readable format
      const formattedErrors = formatZodErrors(result.error);
      
      return next(
        new AppError('Validation failed', 422, 'VALIDATION_ERROR', formattedErrors)
      );
    }

    // Replace req properties with validated data
    if (schema.body) req.body = result.data.body;
    if (schema.query) req.query = result.data.query;
    if (schema.params) req.params = result.data.params;
    
    return next();
  } catch (error) {
    return next(new AppError('Validation error', 400, 'BAD_REQUEST'));
  }
};

/**
 * Format Zod validation errors into a more readable structure
 * @param {Object} error - Zod error object
 * @returns {Array} Formatted error messages
 */
function formatZodErrors(error) {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
}
