// ============================================
// FILE: backend/services/notificationService.js
// ============================================
import Notification from "../models/Notification.js";

/**
 * Service for creating system notifications
 * Use these functions in your controllers when events occur
 */

class NotificationService {
  /**
   * Send a course completion notification
   * @param {String} userId - User ID who completed the course
   * @param {String} courseName - Name of the completed course
   */
  static async sendCourseCompletionNotification(userId, courseName) {
    try {
      await Notification.create({
        title: "🎉 Course Completed!",
        message: `Congratulations! You've successfully completed "${courseName}". Your certificate is now available.`,
        type: "course_completed",
        recipient: userId,
        metadata: {
          courseName,
          eventType: "course_completion"
        }
      });
      console.log(`Course completion notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending course completion notification:", error);
    }
  }

  /**
   * Send a referral signup notification
   * @param {String} userId - User ID who referred someone
   * @param {String} referredUserName - Name of the person who signed up
   */
  static async sendReferralSignupNotification(userId, referredUserName) {
    try {
      await Notification.create({
        title: "🎊 New Referral!",
        message: `${referredUserName} just signed up using your referral code! Keep sharing to earn more rewards.`,
        type: "referral_signup",
        recipient: userId,
        metadata: {
          referredUserName,
          eventType: "referral_signup"
        }
      });
      console.log(`Referral signup notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending referral signup notification:", error);
    }
  }

  /**
   * Send a referral reward notification
   * @param {String} userId - User ID who earned the reward
   * @param {Number} points - Number of points earned
   */
  static async sendReferralRewardNotification(userId, points) {
    try {
      await Notification.create({
        title: "💰 Referral Reward Earned!",
        message: `You've earned ${points} points from your referral! Your points have been added to your account.`,
        type: "referral_reward",
        recipient: userId,
        metadata: {
          points,
          eventType: "referral_reward"
        }
      });
      console.log(`Referral reward notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending referral reward notification:", error);
    }
  }

  /**
   * Send a points earned notification
   * @param {String} userId - User ID who earned points
   * @param {Number} points - Number of points earned
   * @param {String} reason - Reason for earning points
   */
  static async sendPointsEarnedNotification(userId, points, reason) {
    try {
      await Notification.create({
        title: "⭐ Points Earned!",
        message: `You've earned ${points} points for ${reason}! Keep up the great work.`,
        type: "system",
        recipient: userId,
        metadata: {
          points,
          reason,
          eventType: "points_earned"
        }
      });
      console.log(`Points earned notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending points earned notification:", error);
    }
  }

  /**
   * Send a lesson completion notification
   * @param {String} userId - User ID who completed the lesson
   * @param {String} lessonName - Name of the completed lesson
   * @param {String} courseName - Name of the course
   */
  static async sendLessonCompletionNotification(userId, lessonName, courseName) {
    try {
      await Notification.create({
        title: "✅ Lesson Completed!",
        message: `Great progress! You've completed "${lessonName}" in ${courseName}.`,
        type: "system",
        recipient: userId,
        metadata: {
          lessonName,
          courseName,
          eventType: "lesson_completion"
        }
      });
      console.log(`Lesson completion notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending lesson completion notification:", error);
    }
  }

  /**
   * Send a custom system notification
   * @param {String} userId - User ID
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type (default: 'system')
   * @param {Object} metadata - Additional metadata
   */
  static async sendCustomNotification(userId, title, message, type = "system", metadata = {}) {
    try {
      await Notification.create({
        title,
        message,
        type,
        recipient: userId,
        metadata
      });
      console.log(`Custom notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending custom notification:", error);
    }
  }

  /**
   * Send a warning notification
   * @param {String} userId - User ID
   * @param {String} title - Warning title
   * @param {String} message - Warning message
   */
  static async sendWarningNotification(userId, title, message) {
    try {
      await Notification.create({
        title,
        message,
        type: "warning",
        recipient: userId,
        metadata: {
          eventType: "warning"
        }
      });
      console.log(`Warning notification sent to user ${userId}`);
    } catch (error) {
      console.error("Error sending warning notification:", error);
    }
  }
}

export default NotificationService;