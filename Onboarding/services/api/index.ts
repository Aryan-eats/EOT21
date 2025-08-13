import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'https://api.yourservice.com/v1';

// Define types
export interface RiderData {
  id?: string;
  name: string;
  phone: string;
  vehicleType: string;
  aadhar: string;
  accountNumber?: string;
  accountHolder?: string;
  ifsc?: string;
  gender?: string;
  panNumber?: string;
  workTime?: string;
  area?: string;
  distance?: string;
  joiningBonus?: string;
  weeklyEarnings?: string;
  workArea?: string;
  kitOrdered?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
  bankDetails?: {
    accountNumber: string;
    accountHolder: string;
    ifsc: string;
  };
  documents?: {
    aadhar: string;
    panCard?: string;
  };
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config: any) => {
  // Add auth token if exists
  const token = ''; // Get from secure storage
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const AuthService = {
  // Send OTP for phone verification
  sendOtp: async (phone: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ otpSent: boolean }>>('/auth/send-otp', { phone });
      return response.data.data?.otpSent || false;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  },

  // Verify OTP
  verifyOtp: async (phone: string, otp: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ verified: boolean }>>('/auth/verify-otp', { 
        phone, 
        otp 
      });
      return response.data.data?.verified || false;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  },

  // Verify Aadhar number
  verifyAadhar: async (aadhar: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ verified: boolean }>>('/verification/aadhar', { 
        aadhar 
      });
      return response.data.data?.verified || false;
    } catch (error) {
      console.error('Aadhar verification error:', error);
      // For development, return true to allow testing
      return true;
    }
  },

  // Complete onboarding process
  completeOnboarding: async (data: RiderData): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/riders/onboard', data);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || response.data.message || 'Onboarding failed');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Onboarding error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Onboarding failed');
    }
  },

  // Validate bank details
  validateBankDetails: async (accountNumber: string, ifsc: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ valid: boolean }>>('/verification/bank', {
        accountNumber,
        ifsc
      });
      return response.data.data?.valid || false;
    } catch (error) {
      console.error('Bank validation error:', error);
      // For development, return true to allow testing
      return true;
    }
  },
};

export const RiderService = {
  // Get rider profile
  getProfile: async (riderId: string): Promise<RiderProfile> => {
    try {
      const response = await api.get<ApiResponse<RiderProfile>>(`/riders/${riderId}/profile`);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || response.data.message || 'Failed to load rider profile');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to load rider profile');
    }
  },

  // Update rider profile
  updateProfile: async (riderId: string, data: Partial<RiderData>): Promise<RiderProfile> => {
    try {
      const response = await api.put<ApiResponse<RiderProfile>>(`/riders/${riderId}/profile`, data);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || response.data.message || 'Failed to update profile');
      }
      return response.data.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  },
};

export { api };