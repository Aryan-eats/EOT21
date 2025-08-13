/**
 * Environment variable schema definitions using Zod
 */
import { z } from 'zod';

/**
 * Common environment variables schema for all applications
 */
export const commonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

/**
 * Backend environment variables schema
 */
export const backendEnvSchema = commonEnvSchema.extend({
  PORT: z.coerce.number().positive().default(3000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32).describe('JWT secret key (min 32 chars)'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100), // 100 requests per window
});

/**
 * Frontend environment variables schema
 */
export const frontendEnvSchema = commonEnvSchema.extend({
  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

/**
 * Admin Dashboard environment variables schema
 */
export const adminDashEnvSchema = commonEnvSchema.extend({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('EatOnTime Admin'),
});

/**
 * Restaurant Dashboard environment variables schema
 */
export const restaurantDashEnvSchema = commonEnvSchema.extend({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('EatOnTime Restaurant'),
});

export type BackendEnv = z.infer<typeof backendEnvSchema>;
export type FrontendEnv = z.infer<typeof frontendEnvSchema>;
export type AdminDashEnv = z.infer<typeof adminDashEnvSchema>;
export type RestaurantDashEnv = z.infer<typeof restaurantDashEnvSchema>;
