import BaseService from './base.service.js';
import { Client } from '../models/client.model.js';
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

/**
 * Service class for client operations
 */
class ClientService extends BaseService {
  constructor() {
    super(Client, 'Client');
  }

  /**
   * Register a new client
   * @param {Object} data - Client registration data
   * @returns {Promise<{client: Document, token: string}>} Client and JWT token
   */
  async register(data) {
    try {
      // Check if client with email already exists
      const existingClient = await Client.findOne({ email: data.email });
      if (existingClient) {
        throw new AppError('Client with this email already exists', 409, 'DUPLICATE_EMAIL');
      }
      
      // Check if client with phone already exists
      if (data.phone) {
        const existingPhone = await Client.findOne({ phone: data.phone });
        if (existingPhone) {
          throw new AppError('Client with this phone already exists', 409, 'DUPLICATE_PHONE');
        }
      }
      
      // Create the client (password will be hashed in the pre-save hook)
      const client = await this.create(data);
      
      // Generate JWT token
      const token = this._generateToken(client);
      
      // Remove sensitive data
      client.password = undefined;
      
      return { client, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error registering client', error);
      throw error;
    }
  }

  /**
   * Login a client
   * @param {string} email - Client email
   * @param {string} password - Client password
   * @returns {Promise<{client: Document, token: string}>} Client and JWT token
   */
  async login(email, password) {
    try {
      // Find client by email
      const client = await Client.findOne({ email }).select('+password');
      
      // Check if client exists
      if (!client) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }
      
      // Generate JWT token
      const token = this._generateToken(client);
      
      // Remove sensitive data
      client.password = undefined;
      
      return { client, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error logging in client', error);
      throw error;
    }
  }

  /**
   * Update client profile
   * @param {string} id - Client ID
   * @param {Object} data - Update data
   * @returns {Promise<Document>} Updated client
   */
  async updateProfile(id, data) {
    try {
      // Check if trying to update email and it already exists
      if (data.email) {
        const existingClient = await Client.findOne({ 
          email: data.email, 
          _id: { $ne: id } 
        });
        
        if (existingClient) {
          throw new AppError('Client with this email already exists', 409, 'DUPLICATE_EMAIL');
        }
      }
      
      // Check if trying to update phone and it already exists
      if (data.phone) {
        const existingPhone = await Client.findOne({ 
          phone: data.phone, 
          _id: { $ne: id } 
        });
        
        if (existingPhone) {
          throw new AppError('Client with this phone already exists', 409, 'DUPLICATE_PHONE');
        }
      }
      
      // Update client
      const client = await this.update(id, data);
      return client;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error updating client profile', error);
      throw error;
    }
  }

  /**
   * Change client password
   * @param {string} id - Client ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(id, currentPassword, newPassword) {
    try {
      // Find client by ID with password
      const client = await Client.findById(id).select('+password');
      
      if (!client) {
        throw new AppError('Client not found', 404, 'RESOURCE_NOT_FOUND');
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, client.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
      }
      
      // Update password
      client.password = newPassword;
      client.passwordChangedAt = new Date();
      await client.save();
      
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error changing client password', error);
      throw error;
    }
  }

  /**
   * Add a new address for client
   * @param {string} clientId - Client ID
   * @param {Object} addressData - Address data
   * @returns {Promise<Document>} Updated client
   */
  async addAddress(clientId, addressData) {
    try {
      const client = await this.findById(clientId);
      
      if (!client.addresses) {
        client.addresses = [];
      }
      
      client.addresses.push(addressData);
      await client.save();
      
      return client;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error adding client address', error);
      throw error;
    }
  }

  /**
   * Update client address
   * @param {string} clientId - Client ID
   * @param {string} addressId - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Document>} Updated client
   */
  async updateAddress(clientId, addressId, addressData) {
    try {
      const client = await this.findById(clientId);
      
      if (!client.addresses || client.addresses.length === 0) {
        throw new AppError('No addresses found for this client', 404, 'ADDRESS_NOT_FOUND');
      }
      
      const addressIndex = client.addresses.findIndex(
        addr => addr._id.toString() === addressId
      );
      
      if (addressIndex === -1) {
        throw new AppError('Address not found', 404, 'ADDRESS_NOT_FOUND');
      }
      
      // Update the address
      client.addresses[addressIndex] = {
        ...client.addresses[addressIndex].toObject(),
        ...addressData
      };
      
      await client.save();
      
      return client;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error updating client address', error);
      throw error;
    }
  }

  /**
   * Delete client address
   * @param {string} clientId - Client ID
   * @param {string} addressId - Address ID
   * @returns {Promise<Document>} Updated client
   */
  async deleteAddress(clientId, addressId) {
    try {
      const client = await this.findById(clientId);
      
      if (!client.addresses || client.addresses.length === 0) {
        throw new AppError('No addresses found for this client', 404, 'ADDRESS_NOT_FOUND');
      }
      
      const addressIndex = client.addresses.findIndex(
        addr => addr._id.toString() === addressId
      );
      
      if (addressIndex === -1) {
        throw new AppError('Address not found', 404, 'ADDRESS_NOT_FOUND');
      }
      
      // Remove the address
      client.addresses.splice(addressIndex, 1);
      
      await client.save();
      
      return client;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error deleting client address', error);
      throw error;
    }
  }

  /**
   * Generate JWT token for a client
   * @param {Document} client - Client document
   * @returns {string} JWT token
   * @private
   */
  _generateToken(client) {
    return jwt.sign(
      { 
        id: client._id,
        role: 'client',
        clientId: client._id
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }
}

export { ClientService };
