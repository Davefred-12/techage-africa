// ============================================
// FILE: backend/routes/publicRoutes.js - UPDATED
// ============================================
import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  submitContactForm,
} from '../controllers/publicController.js';
import { getPlatformStats } from '../controllers/statsController.js'; // ✅ Add this

const router = express.Router();

// Newsletter routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Contact form route
router.post('/contact', submitContactForm);

// Stats route - ✅ NEW
router.get('/stats', getPlatformStats);

export default router;