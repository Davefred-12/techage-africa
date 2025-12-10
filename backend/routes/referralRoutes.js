// ============================================
// FILE: backend/routes/referralRoutes.js
// ============================================
import express from "express";
import {
  getReferralData,
  generateReferralCode,
  awardPoints,
} from "../controllers/referralController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get("/", getReferralData);
router.post("/generate-code", generateReferralCode);

// Admin routes
router.post("/award-points", admin, awardPoints);

export default router;