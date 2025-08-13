import { ApiResponse } from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';

/**
 * Factory for creating standard controller methods
 * @param {Object} service - Service instance
 * @param {string} modelName - Name of the model
 */
export const createControllerFactory = (service, modelName) => {
  return {
    /**
     * Create a new document
     */
    create: async (req, res, next) => {
      try {
        const result = await service.create(req.body);
        
        return res.status(201).json(
          ApiResponse.success(`${modelName} created successfully`, result)
        );
      } catch (error) {
        next(error);
      }
    },
    
    /**
     * Get all documents with filtering and pagination
     */
    getAll: async (req, res, next) => {
      try {
        // Extract query parameters
        const { page, limit, sort, fields, ...filter } = req.query;
        
        // Parse pagination parameters
        const options = {
          page: page ? parseInt(page, 10) : 1,
          limit: limit ? parseInt(limit, 10) : 20,
          sort: sort || '-createdAt',
          fields: fields
        };
        
        // Get results
        const { results, pagination } = await service.findAll(filter, options);
        
        return res.status(200).json(
          ApiResponse.success(`${modelName} list retrieved successfully`, results, null, { pagination })
        );
      } catch (error) {
        next(error);
      }
    },
    
    /**
     * Get document by ID
     */
    getById: async (req, res, next) => {
      try {
        const id = req.params.id;
        const result = await service.findById(id);
        
        return res.status(200).json(
          ApiResponse.success(`${modelName} retrieved successfully`, result)
        );
      } catch (error) {
        next(error);
      }
    },
    
    /**
     * Update document by ID
     */
    update: async (req, res, next) => {
      try {
        const id = req.params.id;
        const result = await service.update(id, req.body);
        
        return res.status(200).json(
          ApiResponse.success(`${modelName} updated successfully`, result)
        );
      } catch (error) {
        next(error);
      }
    },
    
    /**
     * Delete document by ID
     */
    delete: async (req, res, next) => {
      try {
        const id = req.params.id;
        await service.delete(id);
        
        return res.status(200).json(
          ApiResponse.success(`${modelName} deleted successfully`)
        );
      } catch (error) {
        next(error);
      }
    }
  };
};
