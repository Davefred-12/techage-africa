// ============================================
// FILE: routes/serviceRoutes.js
// ============================================
import express from 'express';
import { submitServiceInquiry } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/public/service-inquiry
// @desc    Submit service inquiry form
// @access  Private (Authenticated users only)
router.post('/service-inquiry', protect, submitServiceInquiry);

export default router;