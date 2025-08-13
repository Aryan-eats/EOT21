/**
 * Order type definitions
 */
import { Address } from './restaurant';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'wallet' | 'upi';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  options?: {
    name: string;
    value: string;
    price: number;
  }[];
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface Order {
  id: string;
  orderId: string; // A user-friendly order ID (e.g., EOT-12345)
  customerId: string;
  restaurantId: string;
  riderId?: string;
  items: OrderItem[];
  pricing: OrderPricing;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  statusHistory: StatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrderCreate = Omit<
  Order,
  | 'id'
  | 'orderId'
  | 'status'
  | 'riderId'
  | 'statusHistory'
  | 'estimatedDeliveryTime'
  | 'actualDeliveryTime'
  | 'createdAt'
  | 'updatedAt'
>;

export type OrderUpdate = Partial<
  Omit<Order, 'id' | 'orderId' | 'customerId' | 'restaurantId' | 'createdAt' | 'updatedAt'>
>;

export interface OrderResponse {
  id: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  riderId?: string;
  items: OrderItem[];
  pricing: OrderPricing;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
