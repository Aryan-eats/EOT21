import BaseService from './base.service.js';
import { Product } from '../models/product.model.js';
import { Restaurant } from '../models/restaurant.model.js';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';

/**
 * Service class for product operations
 */
class ProductService extends BaseService {
  constructor() {
    super(Product, 'Product');
  }

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Document>} Created product
   */
  async createProduct(data) {
    try {
      // Verify that the restaurant exists
      const restaurant = await Restaurant.findById(data.restaurantId);
      
      if (!restaurant) {
        throw new AppError('Restaurant not found', 404, 'RESTAURANT_NOT_FOUND');
      }
      
      // Create the product
      const product = await this.create(data);
      
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error creating product', error);
      throw error;
    }
  }

  /**
   * Get products by restaurant with filtering and pagination
   * @param {string} restaurantId - Restaurant ID
   * @param {Object} options - Filter, pagination, and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Products by restaurant
   */
  async getProductsByRestaurant(restaurantId, options = {}) {
    try {
      // Build filter object
      const filter = { restaurantId };
      
      // Add category filter if provided
      if (options.category) {
        filter.category = options.category;
      }
      
      // Add vegetarian filter if provided
      if (options.isVeg !== undefined) {
        filter.isVeg = options.isVeg;
      }
      
      // Add availability filter if provided
      if (options.isAvailable !== undefined) {
        filter.isAvailable = options.isAvailable;
      }
      
      // Add search filter if provided
      if (options.search) {
        filter.$or = [
          { name: { $regex: options.search, $options: 'i' } },
          { description: { $regex: options.search, $options: 'i' } },
          { category: { $regex: options.search, $options: 'i' } }
        ];
      }
      
      return this.findAll(filter, options);
    } catch (error) {
      Logger.error('Error getting products by restaurant', error);
      throw error;
    }
  }

  /**
   * Get featured products
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Featured products
   */
  async getFeaturedProducts(options = {}) {
    try {
      // Sort by rating and limit results
      const featuredOptions = {
        ...options,
        sort: '-rating',
        limit: options.limit || 10
      };
      
      return this.findAll({ isAvailable: true }, featuredOptions);
    } catch (error) {
      Logger.error('Error getting featured products', error);
      throw error;
    }
  }

  /**
   * Toggle product availability
   * @param {string} productId - Product ID
   * @returns {Promise<Document>} Updated product
   */
  async toggleAvailability(productId) {
    try {
      const product = await this.findById(productId);
      
      product.isAvailable = !product.isAvailable;
      await product.save();
      
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error toggling product availability', error);
      throw error;
    }
  }

  /**
   * Update product images
   * @param {string} productId - Product ID
   * @param {Array<string>} images - Array of image URLs
   * @returns {Promise<Document>} Updated product
   */
  async updateImages(productId, images) {
    try {
      const product = await this.findById(productId);
      
      product.images = images;
      await product.save();
      
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error updating product images', error);
      throw error;
    }
  }

  /**
   * Get products by category
   * @param {string} category - Category name
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Products in category
   */
  async getProductsByCategory(category, options = {}) {
    try {
      const filter = { 
        category: { $regex: category, $options: 'i' },
        isAvailable: true
      };
      
      return this.findAll(filter, options);
    } catch (error) {
      Logger.error('Error getting products by category', error);
      throw error;
    }
  }

  /**
   * Search products by name, description, or category
   * @param {string} query - Search query
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Search results
   */
  async searchProducts(query, options = {}) {
    try {
      const filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ],
        isAvailable: true
      };
      
      return this.findAll(filter, options);
    } catch (error) {
      Logger.error('Error searching products', error);
      throw error;
    }
  }
}

export { ProductService };
