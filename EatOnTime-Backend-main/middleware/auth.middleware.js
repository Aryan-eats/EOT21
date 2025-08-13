import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Restaurant } from '../models/restaurant.model.js';
import { Client } from '../models/client.model.js';
import { JWT_SECRET } from "../config/env.js";
import AppError from '../utils/AppError.js';
import Logger from '../utils/logger.js';

/**
 * Extracts JWT token from request headers, cookies, or query params
 */
const getTokenFromRequest = req => {
  // 1) Check Authorization header (Bearer token)
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  
  // 2) Check cookies
  if (req.cookies && req.cookies.jwt) {
    return req.cookies.jwt;
  }

  // No token found
  return null;
};

/**
 * Middleware to authenticate users based on JWT tokens
 * @param {Array} roles - Optional list of allowed roles
 */
const authorize = (roles = ['client', 'restaurant', 'rider', 'admin']) => {
  return async (req, res, next) => {
    try {
      // 1) Get token
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return next(
          new AppError('Authentication required. Please log in to get access.', 401, 'AUTHENTICATION_REQUIRED')
        );
      }

      // 2) Verify token
      let decoded;
      try {
        decoded = await promisify(jwt.verify)(token, JWT_SECRET);
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(
            new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN')
          );
        }
        if (err.name === 'TokenExpiredError') {
          return next(
            new AppError('Your session has expired. Please log in again.', 401, 'TOKEN_EXPIRED')
          );
        }
        throw err; // Let unknown errors be handled by catch block
      }

      // 3) Check if user still exists
      let user = null;
      
      // Look for user in appropriate collection based on role claim
      if (decoded.role === 'restaurant') {
        user = await Restaurant.findById(decoded.id || decoded.restaurantId).select('+password');
      } else if (decoded.role === 'client') {
        user = await Client.findById(decoded.id || decoded.clientId).select('+password');
      }
      // TODO: Add other user types (rider, admin) here when models are available
      
      if (!user) {
        return next(
          new AppError('User account no longer exists.', 401, 'USER_NOT_FOUND')
        );
      }

      // 4) Check if user changed password after token was issued
      if (user.passwordChangedAt && decoded.iat) {
        const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        
        if (decoded.iat < changedTimestamp) {
          return next(
            new AppError('Password was recently changed. Please log in again.', 401, 'PASSWORD_CHANGED')
          );
        }
      }

      // 5) Check if user has required role
      if (roles.length && !roles.includes(decoded.role)) {
        return next(
          new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN_ACCESS')
        );
      }

      // 6) Check if user is active
      if (user.active === false) {
        return next(
          new AppError('This account has been deactivated.', 403, 'ACCOUNT_DEACTIVATED')
        );
      }

      // Grant access to protected route
      req.user = user;
      req.user.role = decoded.role; // Ensure role is accessible
      
      // Remove password from output
      user.password = undefined;
      
      // For backward compatibility (temporarily)
      if (decoded.role === 'restaurant') {
        req.restaurant = user;
      } else if (decoded.role === 'client') {
        req.client = user;
      }
      
      Logger.debug(`User authenticated: ${user._id} (${decoded.role})`);
      next();
    } catch (error) {
      Logger.error('Authentication error:', error);
      // JWT errors will be handled by the global error handler
      next(new AppError('Authentication failed.', 401, 'AUTHENTICATION_FAILED'));
    }
  };
};

export default authorize;