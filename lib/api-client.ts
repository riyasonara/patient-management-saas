import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // E.g. Add auth token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // We could automatically show success toasts for mutations:
    // if (['post', 'put', 'patch', 'delete'].includes(response.config.method || '')) {
    //   toast.success('Successfully completed operation');
    // }
    return response.data;
  },
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      errorMessage = data?.message || data?.error || errorMessage;

      switch (status) {
        case 401:
          errorMessage = data?.message || 'Please log in to continue.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          errorMessage = data?.message || 'Please check your input and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Helper methods with generic types
export const api = {
  get: <T>(url: string, config = {}) => apiClient.get<never, T>(url, config),
  post: <T>(url: string, data?: any, config = {}) => apiClient.post<never, T>(url, data, config),
  put: <T>(url: string, data?: any, config = {}) => apiClient.put<never, T>(url, data, config),
  patch: <T>(url: string, data?: any, config = {}) => apiClient.patch<never, T>(url, data, config),
  delete: <T>(url: string, config = {}) => apiClient.delete<never, T>(url, config),
};
