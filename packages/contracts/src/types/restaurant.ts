/**
 * Restaurant type definitions
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string; // Format: "HH:MM" (24-hour)
  close: string; // Format: "HH:MM" (24-hour)
  isClosed: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Not returned in responses
  address: Address;
  description: string;
  coverImage: string;
  logoImage: string;
  cuisineType: string[];
  operatingHours: OperatingHours[];
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
  averageDeliveryTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export type RestaurantCreate = Omit<
  Restaurant,
  'id' | 'rating' | 'totalReviews' | 'createdAt' | 'updatedAt'
>;

export type RestaurantUpdate = Partial<Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>>;

export interface RestaurantResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  description: string;
  coverImage: string;
  logoImage: string;
  cuisineType: string[];
  operatingHours: OperatingHours[];
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
  averageDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}
