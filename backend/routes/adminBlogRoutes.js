// ============================================
// FILE: backend/routes/adminBlogRoutes.js
// ============================================
import express from 'express';
import {
  getAdminBlogs,
  getAdminBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin blog routes require authentication and admin role
router.use(protect);
router.use(admin);

// Blog management routes
router.get('/', getAdminBlogs);
router.get('/:id', getAdminBlog);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;