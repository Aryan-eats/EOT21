import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';

/**
 * Base service class with common CRUD operations
 */
class BaseService {
  /**
   * Create a new base service
   * @param {Model} model - Mongoose model
   * @param {string} modelName - Name of the model for logging and errors
   */
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Document>} Created document
   */
  async create(data) {
    try {
      const doc = await this.model.create(data);
      return doc;
    } catch (error) {
      Logger.error(`Error creating ${this.modelName}`, error);
      if (error.code === 11000) {
        // Handle duplicate key error
        const field = Object.keys(error.keyPattern)[0];
        throw new AppError(
          `${this.modelName} with this ${field} already exists`,
          409,
          'DUPLICATE_RESOURCE'
        );
      }
      throw error;
    }
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Document>} Found document
   */
  async findById(id) {
    try {
      const doc = await this.model.findById(id);
      if (!doc) {
        throw new AppError(
          `${this.modelName} not found`,
          404,
          'RESOURCE_NOT_FOUND'
        );
      }
      return doc;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      Logger.error(`Error finding ${this.modelName} by ID`, error);
      if (error.name === 'CastError') {
        throw new AppError(
          `Invalid ${this.modelName} ID format`,
          400,
          'INVALID_ID_FORMAT'
        );
      }
      throw error;
    }
  }

  /**
   * Find all documents with optional filtering, pagination, and sorting
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<{results: Document[], total: number, page: number, limit: number, pages: number}>} Paginated results
   */
  async findAll(filter = {}, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const skip = (page - 1) * limit;
      
      // Create the query
      let query = this.model.find(filter);
      
      // Apply sorting if provided
      if (options.sort) {
        query = query.sort(options.sort);
      } else {
        query = query.sort('-createdAt');
      }
      
      // Apply pagination
      query = query.skip(skip).limit(limit);
      
      // Apply field selection if provided
      if (options.fields) {
        query = query.select(options.fields);
      }
      
      // Apply population if provided
      if (options.populate) {
        query = query.populate(options.populate);
      }
      
      // Execute the query
      const [results, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(filter)
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        results,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages
        }
      };
    } catch (error) {
      Logger.error(`Error finding ${this.modelName} documents`, error);
      throw error;
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Document>} Updated document
   */
  async update(id, data, options = { new: true, runValidators: true }) {
    try {
      const doc = await this.model.findByIdAndUpdate(id, data, options);
      
      if (!doc) {
        throw new AppError(
          `${this.modelName} not found`,
          404,
          'RESOURCE_NOT_FOUND'
        );
      }
      
      return doc;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      Logger.error(`Error updating ${this.modelName}`, error);
      if (error.name === 'CastError') {
        throw new AppError(
          `Invalid ${this.modelName} ID format`,
          400,
          'INVALID_ID_FORMAT'
        );
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new AppError(
          `${this.modelName} with this ${field} already exists`,
          409,
          'DUPLICATE_RESOURCE'
        );
      }
      throw error;
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Document>} Deleted document
   */
  async delete(id) {
    try {
      const doc = await this.model.findByIdAndDelete(id);
      
      if (!doc) {
        throw new AppError(
          `${this.modelName} not found`,
          404,
          'RESOURCE_NOT_FOUND'
        );
      }
      
      return doc;
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      Logger.error(`Error deleting ${this.modelName}`, error);
      if (error.name === 'CastError') {
        throw new AppError(
          `Invalid ${this.modelName} ID format`,
          400,
          'INVALID_ID_FORMAT'
        );
      }
      throw error;
    }
  }

  /**
   * Check if document exists by filter criteria
   * @param {Object} filter - Filter criteria
   * @returns {Promise<boolean>} Whether document exists
   */
  async exists(filter) {
    try {
      const count = await this.model.countDocuments(filter);
      return count > 0;
    } catch (error) {
      Logger.error(`Error checking if ${this.modelName} exists`, error);
      throw error;
    }
  }
}

export default BaseService;
