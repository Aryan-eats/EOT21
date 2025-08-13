import { z } from 'zod';
import { addressSchema } from './restaurant.schema.js';

// Common validation constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;

// Client registration schema
export const registerClientSchema = {
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z.string()
      .min(PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters')
      .refine(val => PASSWORD_REGEX.test(val), {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format'),
    address: addressSchema.optional(),
    profileImage: z.string().url().optional()
  })
};

// Client login schema
export const loginClientSchema = {
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1, 'Password is required')
  })
};

// Client update schema
export const updateClientSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format').optional(),
    address: addressSchema.optional(),
    profileImage: z.string().url().optional()
  })
};

// Get client by ID schema
export const getClientByIdSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  })
};

// Password change schema
export const changeClientPasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters')
      .refine(val => PASSWORD_REGEX.test(val), {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    confirmPassword: z.string().min(1, 'Confirm password is required')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
};

// Add address schema
export const addClientAddressSchema = {
  body: addressSchema
};
