import { z } from 'zod';
import { addressSchema } from './restaurant.schema.js';

// Order status enum
export const OrderStatus = z.enum([
  'pending', 
  'confirmed', 
  'preparing', 
  'ready', 
  'picked_up', 
  'delivered', 
  'cancelled'
]);

// Payment status enum
export const PaymentStatus = z.enum([
  'pending',
  'completed',
  'failed',
  'refunded'
]);

// Payment method enum
export const PaymentMethod = z.enum([
  'cash',
  'card',
  'upi',
  'wallet'
]);

// Order item schema
const orderItemSchema = z.object({
  productId: z.string().min(24).max(24),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  customizations: z.array(
    z.object({
      name: z.string(),
      option: z.string(),
      price: z.number().nonnegative()
    })
  ).optional(),
  subtotal: z.number().positive()
});

// Create order schema
export const createOrderSchema = {
  body: z.object({
    clientId: z.string().min(24).max(24),
    restaurantId: z.string().min(24).max(24),
    items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
    deliveryAddress: addressSchema,
    specialInstructions: z.string().max(500).optional(),
    pricing: z.object({
      subtotal: z.number().positive(),
      deliveryFee: z.number().nonnegative(),
      tax: z.number().nonnegative(),
      discount: z.number().nonnegative().optional(),
      total: z.number().positive()
    }),
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus.optional(),
    deliveryTime: z.object({
      estimated: z.date().optional(),
      actual: z.date().optional()
    }).optional()
  })
};

// Update order status schema
export const updateOrderStatusSchema = {
  params: z.object({
    orderId: z.string().min(24).max(24)
  }),
  body: z.object({
    status: OrderStatus,
    note: z.string().max(200).optional()
  })
};

// Assign rider schema
export const assignRiderSchema = {
  params: z.object({
    orderId: z.string().min(24).max(24)
  }),
  body: z.object({
    riderId: z.string().min(24).max(24)
  })
};

// Get order by ID schema
export const getOrderByIdSchema = {
  params: z.object({
    orderId: z.string().min(24).max(24)
  })
};

// Get orders schema (for filtering)
export const getOrdersSchema = {
  query: z.object({
    clientId: z.string().min(24).max(24).optional(),
    restaurantId: z.string().min(24).max(24).optional(),
    riderId: z.string().min(24).max(24).optional(),
    status: z.union([OrderStatus, z.array(OrderStatus)]).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    paymentStatus: PaymentStatus.optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sort: z.string().optional()
  }).optional()
};
