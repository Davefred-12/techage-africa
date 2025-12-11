// ============================================
// FILE: backend/routes/publicRoutes.js
// ============================================

import express from "express";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  submitContactForm,
} from "../controllers/publicController.js";

import { getPlatformStats } from "../controllers/statsController.js";
import { submitServiceInquiry } from "../controllers/serviceController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================
// 📩 Newsletter Routes
// ======================
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

// ======================
// 📬 Contact Form Route
// ======================
router.post("/contact", submitContactForm);

// ======================
// 📊 Stats Route
// ======================
router.get("/stats", getPlatformStats);

// ======================
// 🛠 Service Inquiry Route (Authenticated)
// ======================

router.post("/service-inquiry", protect, submitServiceInquiry)

export default router;
