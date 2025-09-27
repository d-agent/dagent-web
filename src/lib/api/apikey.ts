import axios, { AxiosResponse } from "axios";
import { env } from "../config/env";

// Types for API Key operations
export interface ApiKey {
  id: string;
  name: string;
  prefix?: string;
  expiresAt?: Date;
  metadata?: any;
  permissions?: Record<string, string[]>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApiKeyRequest {
  name?: string;
  expiresIn?: number; // in seconds
  prefix?: string;
  metadata?: any;
  permissions?: Record<string, string[]>;
}

export interface CreateApiKeyResponse
  extends Omit<ApiKey, "id" | "userId" | "createdAt" | "updatedAt"> {
  id: string;
  key: string; // Only returned on creation
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateApiKeyRequest {
  keyId: string;
  name?: string;
}

export interface VerifyApiKeyRequest {
  key: string;
  permissions?: Record<string, string[]>;
}

export interface VerifyApiKeyResponse {
  valid: boolean;
  error: { message: string; code: string } | null;
  key: Omit<ApiKey, "key"> | null;
}

export interface DeleteApiKeyResponse {
  success: boolean;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL:
    env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
// apiClient.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized - redirect to login or refresh token
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("auth-token");
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export class ApiKeyService {
  /**
   * Create a new API key
   */
  static async createApiKey(
    data: CreateApiKeyRequest
  ): Promise<CreateApiKeyResponse> {
    try {
      const response: AxiosResponse<CreateApiKeyResponse> =
        await apiClient.post("/api-key/create", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create API key"
      );
    }
  }

  /**
   * Get an API key by ID
   */
//   static async getApiKey(id: string): Promise<Omit<ApiKey, "key">> {
//     try {
//       const response: AxiosResponse<Omit<ApiKey, "key">> = await apiClient.get(
//         `/api-key/get?id=${id}`
//       );
//       return response.data;
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || "Failed to get API key");
//     }
//   }

//   /**
//    * List all API keys for the current user
//    */
//   static async listApiKeys(): Promise<ApiKey[]> {
//     try {
//       const response: AxiosResponse<ApiKey[]> = await apiClient.get(
//         "/api-key/list"
//       );
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Failed to list API keys"
//       );
//     }
//   }

//   /**
//    * Update an API key
//    */
//   static async updateApiKey(
//     data: UpdateApiKeyRequest
//   ): Promise<Omit<ApiKey, "key">> {
//     try {
//       const response: AxiosResponse<Omit<ApiKey, "key">> = await apiClient.put(
//         "/api-key/update",
//         data
//       );
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Failed to update API key"
//       );
//     }
//   }

//   /**
//    * Delete an API key
//    */
//   static async deleteApiKey(keyId: string): Promise<DeleteApiKeyResponse> {
//     try {
//       const response: AxiosResponse<DeleteApiKeyResponse> =
//         await apiClient.delete("/api-key/delete", {
//           data: { keyId },
//         });
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Failed to delete API key"
//       );
//     }
//   }

//   /**
//    * Verify an API key
//    */
//   static async verifyApiKey(
//     data: VerifyApiKeyRequest
//   ): Promise<VerifyApiKeyResponse> {
//     try {
//       const response: AxiosResponse<VerifyApiKeyResponse> =
//         await apiClient.post("/api-key/verify", data);
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Failed to verify API key"
//       );
//     }
//   }

//   /**
//    * Delete all expired API keys
//    */
//   static async deleteAllExpiredApiKeys(): Promise<{
//     success: boolean;
//     deletedCount: number;
//   }> {
//     try {
//       const response: AxiosResponse<{
//         success: boolean;
//         deletedCount: number;
//       }> = await apiClient.delete("/api-key/delete-all-expired-api-keys");
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Failed to delete expired API keys"
//       );
//     }
//   }
}

export default ApiKeyService;
