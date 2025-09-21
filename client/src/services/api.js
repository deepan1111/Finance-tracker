import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finance_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('finance_token');
          localStorage.removeItem('finance_user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 422:
          // Validation error
          console.error('Validation error:', data.errors);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message);
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Network error
      const networkError = {
        success: false,
        message: 'Network error. Please check your connection.',
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError = {
        success: false,
        message: 'An unexpected error occurred.',
      };
      return Promise.reject(unknownError);
    }
  }
);

// Helper functions for common API patterns
export const apiHelpers = {
  // Handle API responses with loading state
  handleApiCall: async (apiCall, setLoading = null, setError = null) => {
    try {
      if (setLoading) setLoading(true);
      if (setError) setError(null);
      
      const response = await apiCall();
      return response;
    } catch (error) {
      if (setError) {
        setError(error.message || 'An error occurred');
      }
      throw error;
    } finally {
      if (setLoading) setLoading(false);
    }
  },

  // Format error message for display
  formatError: (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.errors && Array.isArray(error.errors)) {
      return error.errors.map(err => err.message).join(', ');
    }
    return 'An unexpected error occurred';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('finance_token');
    const user = localStorage.getItem('finance_user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('finance_user');
    return user ? JSON.parse(user) : null;
  },

  // Store user data
  storeUserData: (token, user) => {
    localStorage.setItem('finance_token', token);
    localStorage.setItem('finance_user', JSON.stringify(user));
  },

  // Clear user data
  clearUserData: () => {
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
  },
};

export default api;