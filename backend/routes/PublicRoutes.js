// ============================================
// FILE: backend/routes/publicRoutes.js - NEW
// ============================================
import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  submitContactForm,
} from '../controllers/publicController.js';

const router = express.Router();

// Newsletter routes
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Contact form route
router.post('/contact', submitContactForm);

export default router;