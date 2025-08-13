// Export all types
export * from './types/restaurant';
export * from './types/product';
export * from './types/client';
export * from './types/auth';
export * from './types/order';

// API Response types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string | null;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: any;
  };
}
