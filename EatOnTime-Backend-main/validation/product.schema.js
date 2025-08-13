import { z } from 'zod';

// Product creation schema
export const createProductSchema = {
  body: z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().min(10).max(500).trim(),
    price: z.number().positive('Price must be a positive number'),
    category: z.string().min(2).max(50).trim(),
    isVeg: z.boolean().optional(),
    isAvailable: z.boolean().optional().default(true),
    images: z.array(z.string().url()).optional(),
    restaurantId: z.string().min(24).max(24),
    customizationOptions: z.array(
      z.object({
        name: z.string().min(2).max(50).trim(),
        options: z.array(
          z.object({
            name: z.string().min(1).max(50).trim(),
            price: z.number().nonnegative('Price must be a non-negative number'),
            isAvailable: z.boolean().optional().default(true)
          })
        )
      })
    ).optional(),
    nutritionalInfo: z.object({
      calories: z.number().nonnegative().optional(),
      proteins: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fats: z.number().nonnegative().optional(),
      allergens: z.array(z.string()).optional()
    }).optional(),
    preparationTime: z.number().int().positive().optional(), // in minutes
    discountPercentage: z.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional()
  })
};

// Product update schema
export const updateProductSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  }),
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().min(10).max(500).trim().optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    category: z.string().min(2).max(50).trim().optional(),
    isVeg: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    images: z.array(z.string().url()).optional(),
    customizationOptions: z.array(
      z.object({
        name: z.string().min(2).max(50).trim(),
        options: z.array(
          z.object({
            name: z.string().min(1).max(50).trim(),
            price: z.number().nonnegative('Price must be a non-negative number'),
            isAvailable: z.boolean().optional().default(true)
          })
        )
      })
    ).optional(),
    nutritionalInfo: z.object({
      calories: z.number().nonnegative().optional(),
      proteins: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fats: z.number().nonnegative().optional(),
      allergens: z.array(z.string()).optional()
    }).optional(),
    preparationTime: z.number().int().positive().optional(), // in minutes
    discountPercentage: z.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional()
  })
};

// Get product by ID schema
export const getProductByIdSchema = {
  params: z.object({
    id: z.string().min(24).max(24)
  })
};

// Get products by restaurant schema
export const getProductsByRestaurantSchema = {
  params: z.object({
    restaurantId: z.string().min(24).max(24)
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    category: z.string().optional(),
    isVeg: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    isAvailable: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    sort: z.string().optional(),
    search: z.string().optional()
  }).optional()
};
