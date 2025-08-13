import { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface RiderData {
  id?: string;
  name: string;
  phone: string;
  vehicleType: string;
  aadhar: string;
  accountNumber?: string;
  accountHolder?: string;
  ifsc?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  rider: RiderProfile;
}

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: 'active' | 'pending' | 'suspended';
  rating?: number;
  completedDeliveries?: number;
}

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }

  interface AxiosResponse<T = any> {
    data: ApiResponse<T>;
  }
}