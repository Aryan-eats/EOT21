/**
 * Product type definitions
 */
import { Restaurant } from './restaurant';

export type ProductCategory =
  | 'appetizers'
  | 'soups'
  | 'salads'
  | 'main-courses'
  | 'desserts'
  | 'beverages'
  | 'sides'
  | 'specials'
  | 'veg'
  | 'non-veg'
  | 'vegan'
  | string;

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface ProductCustomization {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiSelect: boolean;
}

export interface Product {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: ProductCategory[];
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  variants?: ProductVariant[];
  customizations?: ProductCustomization[];
  restaurant?: Restaurant; // Only returned in detailed responses with restaurant info
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCreate = Omit<Product, 'id' | 'restaurant' | 'createdAt' | 'updatedAt'>;

export type ProductUpdate = Partial<Omit<Product, 'id' | 'restaurant' | 'createdAt' | 'updatedAt'>>;

export interface ProductResponse {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: ProductCategory[];
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number;
  variants?: ProductVariant[];
  customizations?: ProductCustomization[];
  createdAt: string;
  updatedAt: string;
}
