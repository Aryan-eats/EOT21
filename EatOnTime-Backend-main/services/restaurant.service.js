import BaseService from './base.service.js';
import { Restaurant } from '../models/restaurant.model.js';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

/**
 * Service class for restaurant operations
 */
class RestaurantService extends BaseService {
  constructor() {
    super(Restaurant, 'Restaurant');
  }

  /**
   * Register a new restaurant
   * @param {Object} data - Restaurant registration data
   * @returns {Promise<{restaurant: Document, token: string}>} Restaurant and JWT token
   */
  async register(data) {
    try {
      // Check if restaurant with email already exists
      const existingRestaurant = await Restaurant.findOne({ email: data.email });
      if (existingRestaurant) {
        throw new AppError('Restaurant with this email already exists', 409, 'DUPLICATE_EMAIL');
      }
      
      // Create the restaurant (password will be hashed in the pre-save hook)
      const restaurant = await this.create(data);
      
      // Generate JWT token
      const token = this._generateToken(restaurant);
      
      // Remove sensitive data
      restaurant.password = undefined;
      
      return { restaurant, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error registering restaurant', error);
      throw error;
    }
  }

  /**
   * Login a restaurant
   * @param {string} email - Restaurant email
   * @param {string} password - Restaurant password
   * @returns {Promise<{restaurant: Document, token: string}>} Restaurant and JWT token
   */
  async login(email, password) {
    try {
      // Find restaurant by email
      const restaurant = await Restaurant.findOne({ email }).select('+password');
      
      // Check if restaurant exists
      if (!restaurant) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, restaurant.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }
      
      // Generate JWT token
      const token = this._generateToken(restaurant);
      
      // Remove sensitive data
      restaurant.password = undefined;
      
      return { restaurant, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error logging in restaurant', error);
      throw error;
    }
  }

  /**
   * Update restaurant profile
   * @param {string} id - Restaurant ID
   * @param {Object} data - Update data
   * @returns {Promise<Document>} Updated restaurant
   */
  async updateProfile(id, data) {
    try {
      // Check if trying to update email and it already exists
      if (data.email) {
        const existingRestaurant = await Restaurant.findOne({ 
          email: data.email, 
          _id: { $ne: id } 
        });
        
        if (existingRestaurant) {
          throw new AppError('Restaurant with this email already exists', 409, 'DUPLICATE_EMAIL');
        }
      }
      
      // Update restaurant
      const restaurant = await this.update(id, data);
      return restaurant;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error updating restaurant profile', error);
      throw error;
    }
  }

  /**
   * Change restaurant password
   * @param {string} id - Restaurant ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(id, currentPassword, newPassword) {
    try {
      // Find restaurant by ID with password
      const restaurant = await Restaurant.findById(id).select('+password');
      
      if (!restaurant) {
        throw new AppError('Restaurant not found', 404, 'RESOURCE_NOT_FOUND');
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, restaurant.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
      }
      
      // Update password
      restaurant.password = newPassword;
      restaurant.passwordChangedAt = new Date();
      await restaurant.save();
      
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error changing restaurant password', error);
      throw error;
    }
  }

  /**
   * Find nearby restaurants
   * @param {Object} coordinates - Latitude and longitude
   * @param {number} maxDistance - Maximum distance in meters
   * @param {Object} options - Pagination and filtering options
   * @returns {Promise<{results: Document[], pagination: Object}>} Nearby restaurants
   */
  async findNearby(coordinates, maxDistance = 5000, options = {}) {
    try {
      const { lat, lng } = coordinates;
      
      if (!lat || !lng) {
        throw new AppError('Coordinates are required', 400, 'MISSING_COORDINATES');
      }
      
      // Add geospatial query to filter
      const geoFilter = {
        'address.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: maxDistance
          }
        }
      };
      
      const filter = { ...options.filter, ...geoFilter };
      
      return this.findAll(filter, options);
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error finding nearby restaurants', error);
      throw error;
    }
  }

  /**
   * Find restaurants by cuisine type
   * @param {string} cuisineType - Cuisine type
   * @param {Object} options - Pagination and filtering options
   * @returns {Promise<{results: Document[], pagination: Object}>} Restaurants with matching cuisine
   */
  async findByCuisine(cuisineType, options = {}) {
    try {
      const filter = { cuisineType };
      return this.findAll(filter, options);
    } catch (error) {
      Logger.error('Error finding restaurants by cuisine', error);
      throw error;
    }
  }

  /**
   * Search restaurants by name or cuisine
   * @param {string} query - Search query
   * @param {Object} options - Pagination and filtering options
   * @returns {Promise<{results: Document[], pagination: Object}>} Matching restaurants
   */
  async search(query, options = {}) {
    try {
      const filter = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { cuisineType: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
      
      return this.findAll(filter, options);
    } catch (error) {
      Logger.error('Error searching restaurants', error);
      throw error;
    }
  }

  /**
   * Generate JWT token for a restaurant
   * @param {Document} restaurant - Restaurant document
   * @returns {string} JWT token
   * @private
   */
  _generateToken(restaurant) {
    return jwt.sign(
      { 
        id: restaurant._id,
        role: 'restaurant',
        restaurantId: restaurant._id
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }
}

export { RestaurantService };
