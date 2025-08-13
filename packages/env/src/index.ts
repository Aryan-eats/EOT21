/// <reference types="node" />

import * as dotenv from 'dotenv';
import dotenvSafe from 'dotenv-safe';
import path from 'path';
import { z } from 'zod';

// Define schemas directly in this file to avoid circular dependencies
// Common environment variables schema
const commonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Backend environment variables schema
const backendEnvSchema = commonEnvSchema.extend({
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

// Frontend environment variables schema
const frontendEnvSchema = commonEnvSchema.extend({
  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

// Admin Dashboard environment variables schema
const adminDashEnvSchema = commonEnvSchema.extend({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('EatOnTime Admin'),
});

// Restaurant Dashboard environment variables schema
const restaurantDashEnvSchema = commonEnvSchema.extend({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('EatOnTime Restaurant'),
});

/**
 * Load environment variables from .env files and validate them against the provided schema
 * @param schema Zod schema to validate against
 * @param options Configuration options
 * @returns Validated environment object
 */
export function loadEnv<T extends z.ZodType>(
  schema: T,
  options: {
    basePath?: string;
    envFilePath?: string;
    examplePath?: string;
    allowEmptyValues?: boolean;
  } = {}
): z.infer<T> {
  const {
    basePath = process.cwd(),
    envFilePath = '.env',
    examplePath = '.env.example',
    allowEmptyValues = false,
  } = options;

  // Load environment variables
  const envPath = path.resolve(basePath, envFilePath);
  const exampleEnvPath = path.resolve(basePath, examplePath);

  try {
    // Attempt to load with dotenv-safe to ensure all required variables are present
    dotenvSafe.config({
      path: envPath,
      example: exampleEnvPath,
      allowEmptyValues,
    });
  } catch (error) {
    // Fall back to regular dotenv if the example file doesn't exist
    dotenv.config({
      path: envPath,
    });
    console.warn('Warning: .env.example file not found. Environment validation skipped.');
  }

  // Validate environment variables against schema
  try {
    const validated = schema.parse(process.env);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw error;
  }
}

/**
 * Load backend environment variables
 */
export function loadBackendEnv(options = {}) {
  return loadEnv(backendEnvSchema, options);
}

/**
 * Load frontend environment variables
 */
export function loadFrontendEnv(options = {}) {
  return loadEnv(frontendEnvSchema, options);
}

/**
 * Load admin dashboard environment variables
 */
export function loadAdminDashEnv(options = {}) {
  return loadEnv(adminDashEnvSchema, options);
}

/**
 * Load restaurant dashboard environment variables
 */
export function loadRestaurantDashEnv(options = {}) {
  return loadEnv(restaurantDashEnvSchema, options);
}

export {
  backendEnvSchema,
  frontendEnvSchema,
  adminDashEnvSchema,
  restaurantDashEnvSchema,
};
