// ============================================
// FILE: backend/routes/blogRoutes.js
// ============================================
import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getBlogCategories,
  getBlogTags,
  likeBlog,
  addComment,
  getBlogStats,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/:slug', getBlogBySlug);

// Protected routes (require authentication)
router.post('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, addComment);

// Admin routes (require admin authentication)
router.get('/admin/stats', protect, getBlogStats);

export default router;