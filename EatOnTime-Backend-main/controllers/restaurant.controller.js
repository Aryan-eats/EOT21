import { controllerFactory } from './controllerFactory.js';
import { RestaurantService } from '../services/restaurant.service.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// Create service instance
const restaurantService = new RestaurantService();

// Get standard CRUD controllers
const {
  getAll: getRestaurants,
  getOne: getRestaurantById,
  update: updateRestaurant,
  delete: deleteRestaurant
} = controllerFactory(restaurantService);

// Custom authentication controllers
export const registerRestaurant = catchAsync(async (req, res) => {
  const result = await restaurantService.register(req.body);
  
  res.status(201).json({
    status: 'success',
    message: 'Restaurant registered successfully',
    data: {
      restaurant: result
    }
  });
});

export const loginRestaurant = catchAsync(async (req, res) => {
  const { restaurantLoginEmailOrPhone: emailOrPhone, password } = req.body;
  
  if (!emailOrPhone || !password) {
    throw new AppError('Please provide email/phone and password', 400, 'MISSING_CREDENTIALS');
  }
  
  // Check credentials and get restaurant if valid
  const restaurant = await restaurantService.verifyCredentials(emailOrPhone, password);
  
  // Create and send token
  const token = jwt.sign(
    { restaurantId: restaurant._id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      token,
      restaurant
    }
  });
});

export const getRestaurantProfile = catchAsync(async (req, res) => {
  // Get restaurant profile (for the currently authenticated restaurant)
  const restaurant = await restaurantService.findById(req.restaurant.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Profile retrieved successfully',
    data: restaurant
  });
});

export const updateRestaurantProfile = catchAsync(async (req, res) => {
  // Update the currently authenticated restaurant's profile
  const updatedRestaurant = await restaurantService.update(req.restaurant.id, req.body);
  
  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: updatedRestaurant
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  
  if (!currentPassword || !newPassword || !passwordConfirm) {
    throw new AppError('Please provide all password fields', 400, 'MISSING_FIELDS');
  }
  
  if (newPassword !== passwordConfirm) {
    throw new AppError('Passwords do not match', 400, 'PASSWORD_MISMATCH');
  }
  
  // Update password
  await restaurantService.updatePassword(
    req.restaurant.id,
    currentPassword,
    newPassword
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

export {
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};