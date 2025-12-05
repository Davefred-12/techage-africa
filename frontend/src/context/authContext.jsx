// ============================================
// FILE: src/context/AuthContext.jsx - FIXED
// ============================================
import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Fetch user data from server
  const fetchUserData = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch fresh user data from server
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      // Token invalid, clear auth
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Login function
 // Login function
const login = async (credentials) => {
  const response = await authService.login(credentials);
  setUser(response.user);
  setIsAuthenticated(true);
  
  // ✅ Store modal data in sessionStorage (clears on browser close)
  if (response.isFirstLogin !== undefined) {
    sessionStorage.setItem('showWelcomeModal', response.isFirstLogin.toString());
  }
  if (response.lastAccessedCourse) {
    sessionStorage.setItem('lastAccessedCourse', JSON.stringify(response.lastAccessedCourse));
  }
  
  return response;
};

  // Register function
  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Update user profile (called after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // ✅ Refresh user data (fetch from server)
  const refreshUser = async () => {
    await fetchUserData();
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser, // ✅ Added
    getUserInitials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};