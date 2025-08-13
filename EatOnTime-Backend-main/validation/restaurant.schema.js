import { z } from 'zod';

// Common validation constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^\+?[1-9]\d{9,14}$/;

// Base address schema that can be reused across models
export const addressSchema = z.object({
  street: z.string().min(3).max(100),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  zipCode: z.string().min(5).max(10),
  country: z.string().min(2).max(50),
  coordinates: z.object({
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

// Restaurant registration schema
export const registerRestaurantSchema = {
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    password: z.string()
      .min(PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters')
      .refine(val => PASSWORD_REGEX.test(val), {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format'),
    cuisineType: z.string().min(2).max(50).optional(),
    description: z.string().max(500).optional(),
    address: addressSchema,
    openingHours: z.record(z.string(), z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time format should be HH:MM"),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time format should be HH:MM")
    })).optional()
  })
};

// Restaurant login schema
export const loginRestaurantSchema = {
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1, 'Password is required')
  })
};

// Restaurant update schema
export const updateRestaurantSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z.string().regex(PHONE_REGEX, 'Invalid phone number format').optional(),
    cuisineType: z.string().min(2).max(50).optional(),
    description: z.string().max(500).optional(),
    address: addressSchema.optional(),
    openingHours: z.record(z.string(), z.object({
      open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time format should be HH:MM"),
      close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time format should be HH:MM")
    })).optional(),
    isOpen: z.boolean().optional()
  })
};

// Get restaurant by ID schema
export const getRestaurantByIdSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  })
};

// Password change schema
export const changeRestaurantPasswordSchema = {
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
