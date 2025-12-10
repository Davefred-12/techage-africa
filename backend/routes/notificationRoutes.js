// ============================================
// FILE: backend/routes/notificationRoutes.js
// ============================================
import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendBroadcastNotification,
  sendUserNotification,
  getNotificationStats,
  getRecentBroadcasts,
} from "../controllers/notificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get("/", getUserNotifications);
router.put("/:id/read", markNotificationAsRead);
router.put("/mark-all-read", markAllNotificationsAsRead);
router.delete("/:id", deleteNotification);

// Admin routes
router.post("/broadcast", admin, sendBroadcastNotification);
router.post("/send", admin, sendUserNotification);
router.get("/admin/stats", admin, getNotificationStats);
router.get("/admin/recent", admin, getRecentBroadcasts);

export default router;