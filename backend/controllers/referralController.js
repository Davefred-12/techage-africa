// ============================================
// FILE: backend/controllers/referralController.js - FIXED
// ============================================
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Notification from "../models/Notification.js";

// @desc    Get user's referral data
// @route   GET /api/user/referrals
// @access  Private
export const getReferralData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('points referralCode referrals')
      .populate('referrals.user', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ FIX: Calculate completed courses from Enrollment model
    const completedCourses = await Enrollment.countDocuments({
      user: req.user._id,
      paymentStatus: "completed",
      progress: 100, // Only courses with 100% progress
    });

    console.log(`📊 User ${user.name} has completed ${completedCourses} courses`);

    // Define achievements
    const achievements = [
      {
        id: 'first_course',
        title: 'First Steps',
        description: 'Complete your first course',
        unlocked: completedCourses >= 1,
      },
      {
        id: 'five_courses',
        title: 'Knowledge Seeker',
        description: 'Complete 5 courses',
        unlocked: completedCourses >= 5,
      },
      {
        id: 'first_referral',
        title: 'Network Builder',
        description: 'Refer your first friend',
        unlocked: user.referrals.length >= 1,
      },
      {
        id: 'five_referrals',
        title: 'Community Leader',
        description: 'Refer 5 friends',
        unlocked: user.referrals.length >= 5,
      },
      {
        id: 'points_master',
        title: 'Points Master',
        description: 'Earn 5000 points',
        unlocked: user.points >= 5000,
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        points: user.points,
        referralCode: user.referralCode,
        referralsCount: user.referrals.length,
        completedCourses,
        achievements,
      },
    });
  } catch (error) {
    console.error("Get referral data error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Generate referral code for user
// @route   POST /api/user/generate-referral-code
// @access  Private
export const generateReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.referralCode) {
      return res.status(400).json({
        success: false,
        message: "Referral code already exists",
      });
    }

    // Generate unique referral code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let referralCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      referralCode = generateCode();
      const existingUser = await User.findOne({ referralCode });
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique referral code",
      });
    }

    user.referralCode = referralCode;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        referralCode,
      },
    });
  } catch (error) {
    console.error("Generate referral code error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Award points to user
// @route   POST /api/admin/award-points
// @access  Private (Admin only)
export const awardPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    if (!userId || !points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: "User ID and positive points amount are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.points += points;
    await user.save();

    // Create notification
    await Notification.create({
      title: "Points Awarded",
      message: `You have been awarded ${points} points${reason ? ` for: ${reason}` : ''}`,
      type: "system",
      recipient: userId,
    });

    res.status(200).json({
      success: true,
      message: `Awarded ${points} points to ${user.name}`,
    });
  } catch (error) {
    console.error("Award points error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};