// ============================================
// FILE: backend/middleware/authMiddleware.js - PRODUCTION READY
// ============================================
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const isDev = process.env.NODE_ENV === 'development';

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    if (isDev) {
      console.log('🔐 Auth check for:', req.method, req.originalUrl);
    }

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      
      if (isDev) {
        console.log('✅ Token extracted:', token.substring(0, 20) + '...');
      }
    }

    if (!token) {
      if (isDev) console.log('❌ No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (isDev) {
      console.log('✅ Token decoded:', { userId: decoded.id });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      if (isDev) console.log('❌ User not found:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    if (isDev) {
      console.log('✅ User authenticated:', { name: req.user.name, id: req.user._id });
    }
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', {
      name: error.name,
      message: error.message,
      url: req.originalUrl
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    if (isDev) console.log('✅ Admin access granted:', req.user.name);
    next();
  } else {
    if (isDev) console.log('❌ Admin access denied:', req.user?.name || 'No user');
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
};