// ============================================
// FILE: src/services/authService.js
// ============================================
import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    // ✅ FIX: Map fullName to name for backend
    const payload = {
      name: userData.fullName || userData.name,  // Support both fullName and name
      email: userData.email,
      password: userData.password
    };
    
    const response = await api.post('/api/auth/register', payload);
    // if (response.data.token) {
    //   localStorage.setItem('token', response.data.token);
    //   localStorage.setItem('user', JSON.stringify(response.data.user));
    // }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/api/auth/reset-password/${token}`, { password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/update-profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await api.put('/api/auth/change-password', passwords);
    return response.data;
  },

  // Get user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;