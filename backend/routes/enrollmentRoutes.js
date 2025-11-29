// ============================================
// FILE: backend/routes/enrollmentRoutes.js
// ============================================
import express from 'express';
import {
  initiateEnrollment,
  verifyEnrollment,
  checkEnrollment,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All enrollment routes require authentication
router.use(protect);

// @route   POST /api/enrollments/initiate
// @desc    Initiate course enrollment payment
// @access  Private
router.post('/initiate', initiateEnrollment);

// @route   POST /api/enrollments/verify
// @desc    Verify payment and complete enrollment
// @access  Private
router.post('/verify', verifyEnrollment);

// @route   GET /api/enrollments/check/:courseId
// @desc    Check if user is enrolled in a course
// @access  Private
router.get('/check/:courseId', checkEnrollment);

// @route   GET /api/enrollments/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my-courses', getMyEnrollments);

// @route   GET /api/enrollments/:id
// @desc    Get single enrollment details
// @access  Private
router.get('/:id', getEnrollment);

// @route   PUT /api/enrollments/:id/progress
// @desc    Update lesson progress
// @access  Private
router.put('/:id/progress', updateProgress);

export default router;