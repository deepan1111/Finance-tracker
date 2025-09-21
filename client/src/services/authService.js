import api, { apiHelpers } from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        apiHelpers.storeUserData(token, user);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        apiHelpers.storeUserData(token, user);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      apiHelpers.clearUserData();
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.success && response.data) {
        // Update stored user data
        const storedUser = apiHelpers.getStoredUser();
        const updatedUser = { ...storedUser, ...response.data.user };
        localStorage.setItem('finance_user', JSON.stringify(updatedUser));
        
        return response;
      }
      
      throw new Error(response.message || 'Failed to get user data');
    } catch (error) {
      // If token is invalid, clear storage
      if (error.message?.includes('token') || error.message?.includes('unauthorized')) {
        apiHelpers.clearUserData();
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return apiHelpers.isAuthenticated();
  },

  // Get stored user data
  getStoredUser: () => {
    return apiHelpers.getStoredUser();
  },

  // Validate token by making API call
  validateToken: async () => {
    try {
      await authService.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      if (response.success && response.data) {
        // Update stored user data
        const updatedUser = response.data.user;
        localStorage.setItem('finance_user', JSON.stringify(updatedUser));
        return response;
      }
      
      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Password change failed');
    } catch (error) {
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Password reset request failed');
    } catch (error) {
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      
      if (response.success) {
        return response;
      }
      
      throw new Error(response.message || 'Password reset failed');
    } catch (error) {
      throw error;
    }
  },
};