// ============================================
// FILE: backend/routes/authRoutes.js
// ============================================
import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { googleCallback, appleCallback } from '../controllers/oauthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================================
// REGULAR AUTH ROUTES (Email/Password)
// ============================================

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

// @route   GET /api/auth/google
// @desc    Redirect to Google OAuth consent screen
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback - receives user data from Google
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  googleCallback
);

// ============================================
// APPLE OAUTH ROUTES
// ============================================

// @route   GET /api/auth/apple
// @desc    Redirect to Apple OAuth consent screen
// @access  Public
router.get(
  '/apple',
  passport.authenticate('apple', {
    scope: ['name', 'email'],
    session: false,
  })
);

// @route   POST /api/auth/apple/callback (Apple uses POST)
// @desc    Apple OAuth callback - receives user data from Apple
// @access  Public
router.post(
  '/apple/callback',
  passport.authenticate('apple', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  appleCallback
);

export default router;