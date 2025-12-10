// ============================================
// FILE: backend/server.js - UPDATED
// ============================================
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicRoutes from './routes/PublicRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adminBlogRoutes from './routes/adminBlogRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

import passport from './config/passport.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================
// Increase payload size limit for file uploads
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/blog', adminBlogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user/referrals', referralRoutes);
app.use('/api/user/notifications', notificationRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/public', serviceRoutes);
app.use('/api/blog', blogRoutes);


// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TechAge Africa API is running! 🚀',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        googleOAuth: 'GET /api/auth/google',
        appleOAuth: 'GET /api/auth/apple',
        me: 'GET /api/auth/me',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'PUT /api/auth/reset-password/:token',
        updateProfile: 'PUT /api/auth/update-profile',
        changePassword: 'PUT /api/auth/change-password',
      },
      courses: {
        getAll: 'GET /api/courses',
        getOne: 'GET /api/courses/:id',
        create: 'POST /api/courses (Admin)',
      },
      enrollments: {
        initiate: 'POST /api/enrollments/initiate',
        verify: 'POST /api/enrollments/verify',
        check: 'GET /api/enrollments/check/:courseId',
        myCourses: 'GET /api/enrollments/my-courses',
      },
      admin: {
        dashboard: 'GET /api/admin/stats',
        courses: 'GET /api/admin/courses',
        users: 'GET /api/admin/users',
        analytics: 'GET /api/admin/analytics',
      },
      // ✅ NEW - User endpoints
      user: {
        dashboard: 'GET /api/user/dashboard/stats',
        enrolledCourses: 'GET /api/user/courses/enrolled',
        courseContent: 'GET /api/user/courses/:id/content',
        markComplete: 'POST /api/user/courses/:id/lessons/:lessonId/complete',
        progress: 'GET /api/user/progress/overview',
        achievements: 'GET /api/user/progress/achievements',
        orders: 'GET /api/user/orders',
        certificate: 'GET /api/user/certificates/:courseId',
        downloadCert: 'GET /api/user/certificates/:courseId/download',
        profile: 'GET /api/user/profile',
        updateProfile: 'PUT /api/user/profile',
        changePassword: 'PUT /api/user/password',
      },
    },
  });
});

// ============================================
// ERROR HANDLERS
// ============================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🎨 Frontend URL: ${process.env.CLIENT_URL}`);
  console.log(`✅ Passport OAuth initialized`);
  console.log(`✅ Course routes initialized`);
  console.log(`✅ Enrollment routes initialized`);
  console.log(`✅ Admin routes initialized`);
  console.log(`✅ User routes initialized\n`);
  console.log('✅ Public routes initialized');

});