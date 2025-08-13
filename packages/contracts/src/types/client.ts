/**
 * Client type definitions
 */
import { Address } from './restaurant';

export type UserRole = 'client' | 'restaurant' | 'rider' | 'admin';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Not returned in responses
  profileImage?: string;
  addresses: Address[];
  defaultAddressId?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientCreate = Omit<
  Client,
  'id' | 'role' | 'isVerified' | 'isActive' | 'createdAt' | 'updatedAt'
> & {
  role?: UserRole;
  password: string;
};

export type ClientUpdate = Partial<Omit<Client, 'id' | 'role' | 'createdAt' | 'updatedAt'>>;

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  addresses: Address[];
  defaultAddressId?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
