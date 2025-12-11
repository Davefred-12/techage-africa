// ============================================
// FILE: backend/controllers/notificationController.js
// ============================================
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// @desc    Get user's notifications
// @route   GET /api/user/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/user/notifications/mark-all-read
// @access  Private
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/user/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Send broadcast notification to all users
// @route   POST /api/user/notifications/broadcast
// @access  Private (Admin only)
export const sendBroadcastNotification = async (req, res) => {
  try {
    const { title, message, type = "admin_broadcast" } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Get all users (including admin)
    const users = await User.find({}).select('_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      title,
      message,
      type,
      recipient: user._id,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: `Broadcast notification sent to ${users.length} users`,
      data: {
        recipientsCount: users.length,
      }
    });
  } catch (error) {
    console.error("Send broadcast notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Send notification to specific user
// @route   POST /api/user/notifications/send
// @access  Private (Admin only)
export const sendUserNotification = async (req, res) => {
  try {
    const { userId, title, message, type = "system" } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "User ID, title, and message are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      recipient: userId,
    });

    res.status(200).json({
      success: true,
      message: `Notification sent to ${user.name}`,
      data: notification,
    });
  } catch (error) {
    console.error("Send user notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all users for selection (Admin)
// @route   GET /api/user/notifications/admin/users
// @access  Private (Admin only)
export const getAllUsersForNotification = async (req, res) => {
  try {
    // Get all users with basic info
    const users = await User.find({})
      .select('_id name email avatar')
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get notification statistics (Admin)
// @route   GET /api/user/notifications/admin/stats
// @access  Private (Admin only)
export const getNotificationStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNotifications = await Notification.countDocuments();
    const unreadNotifications = await Notification.countDocuments({ read: false });

    // Delivered today (count of notifications created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveredToday = await Notification.countDocuments({
      createdAt: { $gte: today }
    });

    // Broadcasts sent (unique broadcast sends, not per recipient)
    const broadcastsSent = await Notification.aggregate([
      { $match: { type: "admin_broadcast" } },
      {
        $group: {
          _id: { 
            title: "$title", 
            message: "$message", 
            createdAt: { 
              $dateToString: { 
                format: "%Y-%m-%d %H:%M", 
                date: "$createdAt" 
              } 
            } 
          }
        }
      },
      { $count: "totalUniqueBroadcasts" }
    ]).then(result => result[0]?.totalUniqueBroadcasts || 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalNotifications,
        unreadNotifications,
        deliveredToday,
        broadcastsSent,
      },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get recent broadcast notifications (Admin)
// @route   GET /api/user/notifications/admin/recent
// @access  Private (Admin only)
export const getRecentBroadcasts = async (req, res) => {
  try {
    // Get unique broadcasts by grouping on title, message, and rounded timestamp
    const broadcasts = await Notification.aggregate([
      { $match: { type: { $in: ["admin_broadcast", "announcement", "system", "warning"] } } },
      {
        $group: {
          _id: {
            title: "$title",
            message: "$message",
            type: "$type",
            // Group by 1-minute intervals to catch duplicates
            timeWindow: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$createdAt"
              }
            }
          },
          createdAt: { $first: "$createdAt" },
          notificationId: { $first: "$_id" }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$notificationId",
          title: "$_id.title",
          message: "$_id.message",
          type: "$_id.type",
          createdAt: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: broadcasts,
    });
  } catch (error) {
    console.error("Get recent broadcasts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create notification (utility function for system use)
// @route   Not exposed as API route
// @access  Internal use only
export const createNotification = async ({ userId, title, message, type = "system", metadata = {} }) => {
  try {
    const notification = await Notification.create({
      title,
      message,
      type,
      recipient: userId,
      metadata,
    });

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    throw error;
  }
};