// Centralized API client for Multilingual Mandi Frontend
// All API calls go through this service

import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, apiEndpoints } from '../config';
import { 
  TranslationRequest, 
  TranslationResponse, 
  PriceSuggestionRequest, 
  PriceSuggestionResponse,
  NegotiationRequest,
  NegotiationResponse 
} from '../types';

// API Response wrapper
interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance with default config
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error) => {
      // Handle common errors
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const status = error.response?.status;
      const code = error.response?.data?.code;

      console.error(`❌ API Error: ${status} ${error.config?.url} - ${message}`);

      // Transform to our custom error
      throw new ApiError(message, status, code);
    }
  );

  return instance;
};

// API Client class
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = createAxiosInstance();
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        data,
        ...config,
      });

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          data: null as any,
          success: false,
          error: error.message,
        };
      }

      return {
        data: null as any,
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string }>> {
    return this.get(apiEndpoints.health);
  }

  // Translation API
  async translate(request: TranslationRequest): Promise<ApiResponse<TranslationResponse>> {
    return this.post<TranslationResponse>(apiEndpoints.translate, request);
  }

  // Price Discovery API
  async getPriceSuggestion(request: PriceSuggestionRequest): Promise<ApiResponse<PriceSuggestionResponse>> {
    return this.post<PriceSuggestionResponse>(apiEndpoints.priceDiscovery, request);
  }

  // Negotiation API
  async getNegotiationSuggestions(request: NegotiationRequest): Promise<ApiResponse<NegotiationResponse>> {
    return this.post<NegotiationResponse>(apiEndpoints.negotiate, request);
  }

  // Update base URL (useful for testing or environment changes)
  updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }

  // Clear auth token
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const api = {
  // Health check
  healthCheck: () => apiClient.healthCheck(),

  // Translation services
  translate: (request: TranslationRequest) => apiClient.translate(request),

  // Price discovery services
  getPriceSuggestion: (request: PriceSuggestionRequest) => 
    apiClient.getPriceSuggestion(request),

  // Negotiation services
  getNegotiationSuggestions: (request: NegotiationRequest) => 
    apiClient.getNegotiationSuggestions(request),

  // Utility functions
  setAuthToken: (token: string) => apiClient.setAuthToken(token),
  clearAuthToken: () => apiClient.clearAuthToken(),
  updateBaseURL: (url: string) => apiClient.updateBaseURL(url),
};

// React hook for API calls with loading states
export const useApi = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callApi = async <T>(apiCall: () => Promise<ApiResponse<T>>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'API call failed');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};

// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// API health check hook
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = React.useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = React.useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      const response = await api.healthCheck();
      setIsHealthy(response.success);
      setLastCheck(new Date());
    } catch {
      setIsHealthy(false);
      setLastCheck(new Date());
    }
  };

  React.useEffect(() => {
    // Initial health check
    checkHealth();

    // Periodic health check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isHealthy, lastCheck, checkHealth };
};

export default apiClient;