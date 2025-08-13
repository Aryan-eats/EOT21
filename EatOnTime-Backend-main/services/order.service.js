import BaseService from './base.service.js';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import { Order } from '../models/order.model.js';
import { Restaurant } from '../models/restaurant.model.js';
import { Client } from '../models/client.model.js';
import { Product } from '../models/product.model.js';

/**
 * Service class for order operations
 */
class OrderService extends BaseService {
  constructor() {
    super(Order, 'Order');
  }

  /**
   * Create a new order
   * @param {Object} data - Order data
   * @returns {Promise<Document>} Created order
   */
  async createOrder(data) {
    try {
      // Verify that the client exists
      const client = await Client.findById(data.clientId);
      if (!client) {
        throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');
      }
      
      // Verify that the restaurant exists
      const restaurant = await Restaurant.findById(data.restaurantId);
      if (!restaurant) {
        throw new AppError('Restaurant not found', 404, 'RESTAURANT_NOT_FOUND');
      }
      
      // Verify that the restaurant is open
      if (restaurant.isOpen === false) {
        throw new AppError('Restaurant is currently closed', 400, 'RESTAURANT_CLOSED');
      }
      
      // Verify all products exist and calculate actual prices
      await this._verifyOrderItems(data.items, data.restaurantId);
      
      // Create order with initial status
      const orderData = {
        ...data,
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed'
          }
        ]
      };
      
      // Create the order
      const order = await this.create(orderData);
      
      // TODO: Emit event for real-time updates
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error creating order', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {string} note - Optional note about the status change
   * @returns {Promise<Document>} Updated order
   */
  async updateOrderStatus(orderId, status, note = '') {
    try {
      const order = await this.findById(orderId);
      
      // Validate status transition
      this._validateStatusTransition(order.status, status);
      
      // Update order status
      order.status = status;
      
      // Add to status history
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note
      });
      
      // Save the updated order
      await order.save();
      
      // TODO: Emit event for real-time updates
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error updating order status', error);
      throw error;
    }
  }

  /**
   * Assign rider to order
   * @param {string} orderId - Order ID
   * @param {string} riderId - Rider ID
   * @returns {Promise<Document>} Updated order
   */
  async assignRider(orderId, riderId) {
    try {
      const order = await this.findById(orderId);
      
      // Validate order can be assigned to a rider
      if (!['confirmed', 'preparing', 'ready'].includes(order.status)) {
        throw new AppError(
          `Cannot assign rider to order with status: ${order.status}`,
          400,
          'INVALID_ORDER_STATUS'
        );
      }
      
      // TODO: Verify rider exists when rider model is created
      
      // Update order with rider information
      order.riderId = riderId;
      
      // Add assignment to status history
      order.statusHistory.push({
        status: order.status,
        timestamp: new Date(),
        note: `Rider assigned (ID: ${riderId})`
      });
      
      // Save the updated order
      await order.save();
      
      // TODO: Emit event for real-time updates
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error assigning rider to order', error);
      throw error;
    }
  }

  /**
   * Get orders by client
   * @param {string} clientId - Client ID
   * @param {Object} options - Filter, pagination, and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Orders by client
   */
  async getOrdersByClient(clientId, options = {}) {
    try {
      const filter = { clientId };
      
      // Add status filter if provided
      if (options.status) {
        filter.status = options.status;
      }
      
      // Default sort by most recent
      const orderOptions = {
        ...options,
        sort: options.sort || '-createdAt',
        populate: [
          { path: 'restaurantId', select: 'name address cuisineType' }
        ]
      };
      
      return this.findAll(filter, orderOptions);
    } catch (error) {
      Logger.error('Error getting orders by client', error);
      throw error;
    }
  }

  /**
   * Get orders by restaurant
   * @param {string} restaurantId - Restaurant ID
   * @param {Object} options - Filter, pagination, and sorting options
   * @returns {Promise<{results: Document[], pagination: Object}>} Orders by restaurant
   */
  async getOrdersByRestaurant(restaurantId, options = {}) {
    try {
      const filter = { restaurantId };
      
      // Add status filter if provided
      if (options.status) {
        filter.status = options.status;
      }
      
      // Add date range filter if provided
      if (options.startDate && options.endDate) {
        filter.createdAt = {
          $gte: new Date(options.startDate),
          $lte: new Date(options.endDate)
        };
      }
      
      // Default sort by most recent
      const orderOptions = {
        ...options,
        sort: options.sort || '-createdAt',
        populate: [
          { path: 'clientId', select: 'name phone' }
        ]
      };
      
      return this.findAll(filter, orderOptions);
    } catch (error) {
      Logger.error('Error getting orders by restaurant', error);
      throw error;
    }
  }

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @param {string} cancellationReason - Reason for cancellation
   * @returns {Promise<Document>} Cancelled order
   */
  async cancelOrder(orderId, cancellationReason) {
    try {
      const order = await this.findById(orderId);
      
      // Check if order can be cancelled
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new AppError(
          `Cannot cancel order with status: ${order.status}`,
          400,
          'INVALID_ORDER_STATUS'
        );
      }
      
      // Update order status
      order.status = 'cancelled';
      
      // Add cancellation to status history
      order.statusHistory.push({
        status: 'cancelled',
        timestamp: new Date(),
        note: cancellationReason || 'Order cancelled'
      });
      
      // Save the updated order
      await order.save();
      
      // TODO: Handle payment refund if applicable
      
      // TODO: Emit event for real-time updates
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error cancelling order', error);
      throw error;
    }
  }

  /**
   * Verify order items exist and calculate accurate prices
   * @param {Array<Object>} items - Order items
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<void>}
   * @private
   */
  async _verifyOrderItems(items, restaurantId) {
    try {
      // Get all product IDs from items
      const productIds = items.map(item => item.productId);
      
      // Fetch all products at once
      const products = await Product.find({
        _id: { $in: productIds },
        restaurantId
      });
      
      // Create a map for quick lookup
      const productMap = new Map();
      products.forEach(product => {
        productMap.set(product._id.toString(), product);
      });
      
      // Verify each item
      for (const item of items) {
        const productId = item.productId.toString();
        const product = productMap.get(productId);
        
        // Check if product exists
        if (!product) {
          throw new AppError(`Product not found: ${productId}`, 404, 'PRODUCT_NOT_FOUND');
        }
        
        // Check if product is available
        if (!product.isAvailable) {
          throw new AppError(`Product is not available: ${product.name}`, 400, 'PRODUCT_NOT_AVAILABLE');
        }
        
        // Check if product belongs to the restaurant
        if (product.restaurantId.toString() !== restaurantId) {
          throw new AppError(`Product does not belong to this restaurant: ${product.name}`, 400, 'PRODUCT_RESTAURANT_MISMATCH');
        }
        
        // Update item with accurate information
        item.name = product.name;
        item.price = product.price;
        
        // Calculate subtotal
        let subtotal = product.price * item.quantity;
        
        // Add customization costs if present
        if (item.customizations && item.customizations.length > 0) {
          for (const customization of item.customizations) {
            subtotal += customization.price * item.quantity;
          }
        }
        
        // Apply discount if present
        if (product.discountPercentage && product.discountPercentage > 0) {
          subtotal = subtotal * (1 - product.discountPercentage / 100);
        }
        
        // Update subtotal
        item.subtotal = subtotal;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate if a status transition is allowed
   * @param {string} currentStatus - Current order status
   * @param {string} newStatus - New order status
   * @throws {AppError} If transition is not allowed
   * @private
   */
  _validateStatusTransition(currentStatus, newStatus) {
    // Define allowed transitions
    const allowedTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['picked_up', 'cancelled'],
      picked_up: ['delivered', 'cancelled'],
      delivered: [], // Terminal state
      cancelled: []  // Terminal state
    };
    
    // Check if transition is allowed
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
        400,
        'INVALID_STATUS_TRANSITION'
      );
    }
  }
}

export { OrderService };
