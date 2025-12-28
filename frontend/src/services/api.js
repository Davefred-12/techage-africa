// ============================================
// FILE: src/services/api.js - FIXED
// ============================================
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API Base URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // ✅ Remove any quotes or extra characters from token
      const cleanToken = token.trim().replace(/^["']|["']$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('📤 Request with auth:', {
        url: config.url,
        method: config.method,
        hasToken: !!cleanToken,
        tokenPreview: cleanToken.substring(0, 20) + '...'
      });
    } else {
      console.log('📤 Request without auth:', {
        url: config.url,
        method: config.method
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      console.log('🔒 Token invalid, logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;