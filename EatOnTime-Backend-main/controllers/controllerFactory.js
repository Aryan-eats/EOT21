import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Factory for creating standard controller methods
 * @param {Object} service - Service instance
 * @returns {Object} Object containing controller methods
 */
export const controllerFactory = (service) => {
  return {
    /**
     * Create a new resource
     */
    create: catchAsync(async (req, res) => {
      const result = await service.create(req.body);
      
      res.status(201).json({
        status: 'success',
        message: 'Resource created successfully',
        data: result
      });
    }),

    /**
     * Get all resources with pagination, filtering, and sorting
     */
    getAll: catchAsync(async (req, res) => {
      const { page = 1, limit = 10, ...filters } = req.query;
      const result = await service.findAll(filters, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      res.status(200).json({
        status: 'success',
        message: 'Resources retrieved successfully',
        results: result.docs.length,
        pagination: {
          total: result.totalDocs,
          page: result.page,
          limit: result.limit,
          pages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        },
        data: result.docs
      });
    }),

    /**
     * Get a single resource by ID
     */
    getOne: catchAsync(async (req, res) => {
      const result = await service.findById(req.params.id);
      
      if (!result) {
        throw new AppError('Resource not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({
        status: 'success',
        message: 'Resource retrieved successfully',
        data: result
      });
    }),

    /**
     * Update a resource by ID
     */
    update: catchAsync(async (req, res) => {
      const result = await service.update(req.params.id, req.body);
      
      if (!result) {
        throw new AppError('Resource not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({
        status: 'success',
        message: 'Resource updated successfully',
        data: result
      });
    }),

    /**
     * Delete a resource by ID
     */
    delete: catchAsync(async (req, res) => {
      const result = await service.delete(req.params.id);
      
      if (!result) {
        throw new AppError('Resource not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({
        status: 'success',
        message: 'Resource deleted successfully',
        data: null
      });
    })
  };
};
