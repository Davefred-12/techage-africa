// ============================================
// FILE: backend/models/Notification.js
// ============================================
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: [
        "admin_broadcast",
        "referral_reward",
        "course_completed",
        "referral_signup",
        "system",
        "warning",
        "announcement"
      ],
      default: "system",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    // NEW FIELD: Groups related notifications (e.g., one broadcast to many users)
    broadcastId: {
      type: String,
      default: null,
      index: true, // Index for fast queries
    },
    // For admin broadcasts, this will be null (sent to all users)
    // For specific notifications, this will contain relevant data
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ broadcastId: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;