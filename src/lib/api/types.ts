// Types for external APIs
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Generic API response wrapper
export interface BaseApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
