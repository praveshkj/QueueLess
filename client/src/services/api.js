import axios from 'axios';
import { storage } from '../utils/storage.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle centralized error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: automatically clear expired credentials
      if (storage.getToken()) {
        storage.clearAuth();
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    const customError = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.code = error.response?.data?.error?.code;

    return Promise.reject(customError);
  }
);
