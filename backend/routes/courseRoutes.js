// ============================================
// FILE: backend/routes/courseRoutes.js
// ============================================
import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes (Admin only)
router.post('/', protect, createCourse);

export default router;