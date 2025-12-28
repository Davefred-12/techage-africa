// ============================================
// FILE: backend/controllers/enrollmentController.js - FIXED
// ============================================
import mongoose from "mongoose";
import axios from "axios"; // ✅ ADD THIS IMPORT
import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const initiateEnrollment = async (req, res) => {
  try {
    const { courseId, usePoints } = req.body;
    const userId = req.user._id;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      paymentStatus: "completed",
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Get user's points
    const user = await User.findById(userId);

    // ✅ Calculate final price with points discount
    let finalPrice = course.price;
    let pointsUsed = 0;

    if (usePoints && user.points > 0) {
      pointsUsed = Math.min(user.points, course.price);
      finalPrice = course.price - pointsUsed;
    }

    console.log(
      `💰 Enrollment: Original=${course.price}, Points=${pointsUsed}, Final=${finalPrice}`
    );

    // ✅ If fully covered by points, enroll directly (no payment needed)
    if (finalPrice === 0) {
      // Deduct points
      user.points -= pointsUsed;
      await user.save();

      // Create completed enrollment
      const enrollment = await Enrollment.create({
        user: userId,
        course: courseId,
        paymentStatus: "completed",
        paymentMethod: "points",
        paystackReference: `POINTS-${Date.now()}`,
        amount: course.price,
        discountedAmount: 0,
        pointsUsed,
        paidAt: Date.now(),
      });

      // Award purchase bonus (500 points)
      user.points += 500;
      await user.save();

      // Create notification
      await Notification.create({
        title: "Course Enrollment Successful",
        message: `You've successfully enrolled in ${course.title} using ${pointsUsed} points!`,
        type: "enrollment",
        recipient: userId,
      });

      console.log(
        `✅ Enrolled using points only: ${user.name} -> ${course.title}`
      );

      return res.status(200).json({
        success: true,
        message: "Enrolled successfully using points!",
        data: {
          enrollment,
          pointsUsed,
          pointsEarned: 500,
          remainingPoints: user.points,
        },
      });
    }

    // ✅ Initialize Paystack payment with discounted price
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: finalPrice * 100, // Convert to kobo
        currency: "NGN",
        callback_url: `${process.env.CLIENT_URL}/payment/verify`,
        metadata: {
          userId: userId.toString(),
          courseId: courseId.toString(),
          courseName: course.title,
          originalAmount: course.price,
          pointsUsed,
          finalPrice,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paystackResponse.data.status) {
      return res.status(500).json({
        success: false,
        message: "Payment initialization failed",
      });
    }

    const { authorization_url, reference } = paystackResponse.data.data;

    // Create pending enrollment with discount info
    await Enrollment.create({
      user: userId,
      course: courseId,
      paymentStatus: "pending",
      paymentMethod: "paystack",
      paystackReference: reference,
      amount: course.price,
      discountedAmount: finalPrice,
      pointsUsed,
    });

    console.log(
      `💳 Paystack initiated: Reference=${reference}, Amount=₦${finalPrice}`
    );

    res.status(200).json({
      success: true,
      data: {
        authorization_url,
        reference,
        amount: finalPrice,
        originalAmount: course.price,
        pointsUsed,
      },
    });
  } catch (error) {
    console.error("❌ Initiate enrollment error:", error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to initiate enrollment",
    });
  }
};

// @desc    Verify payment and complete enrollment
// @route   POST /api/enrollments/verify
// @access  Private
export const verifyEnrollment = async (req, res) => {
  try {
    const { reference } = req.body;

    console.log('🔍 Starting payment verification for reference:', reference);

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // ✅ 1. Find enrollment FIRST (before Paystack verification)
    const enrollment = await Enrollment.findOne({
      paystackReference: reference,
    });

    console.log('📦 Enrollment found:', {
      id: enrollment?._id,
      userId: enrollment?.user,
      courseId: enrollment?.course,
      pointsUsed: enrollment?.pointsUsed,
      status: enrollment?.paymentStatus
    });

    if (!enrollment) {
      console.error('❌ Enrollment not found for reference:', reference);
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.paymentStatus === "completed") {
      console.log('⚠️ Enrollment already completed');
      return res.status(400).json({
        success: false,
        message: "Enrollment already completed",
      });
    }

    // ✅ 2. Verify payment with Paystack
    console.log('💳 Verifying with Paystack...');
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, data } = paystackResponse.data;

    console.log('✅ Paystack response:', {
      status,
      transactionStatus: data.status,
      amount: data.amount / 100
    });

    if (!status || data.status !== "success") {
      console.error('❌ Paystack verification failed');
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ 3. Get fresh user data
    const user = await User.findById(enrollment.user);
    
    if (!user) {
      console.error('❌ User not found:', enrollment.user);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ 4. Get course data
    const course = await Course.findById(enrollment.course);
    
    if (!course) {
      console.error('❌ Course not found:', enrollment.course);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log('👤 User before updates:', {
      name: user.name,
      currentPoints: user.points || 0,
      pointsToDeduct: enrollment.pointsUsed || 0
    });

    // ✅ 5. Deduct points if used
    if (enrollment.pointsUsed && enrollment.pointsUsed > 0) {
      // Initialize points if undefined
      if (user.points === undefined || user.points === null) {
        user.points = 0;
      }

      if (user.points < enrollment.pointsUsed) {
        console.error('❌ Insufficient points:', {
          available: user.points,
          required: enrollment.pointsUsed
        });
        return res.status(400).json({
          success: false,
          message: "Insufficient points",
        });
      }

      user.points -= enrollment.pointsUsed;
      console.log(`🎯 Deducted ${enrollment.pointsUsed} points from ${user.name}`);
    }

    // ✅ 6. Award purchase bonus (500 points)
    // Initialize points if undefined
    if (user.points === undefined || user.points === null) {
      user.points = 0;
    }
    
    user.points += 500;
    console.log(`🎁 Awarded 500 purchase bonus points`);

    // ✅ 7. Handle referral rewards
    if (user.referredBy) {
      try {
        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          // Initialize points if undefined
          if (referrer.points === undefined || referrer.points === null) {
            referrer.points = 0;
          }
          
          referrer.points += 500;
          
          // Initialize referrals array if it doesn't exist
          if (!referrer.referrals || !Array.isArray(referrer.referrals)) {
            referrer.referrals = [];
          }
          
          referrer.referrals.push({
            user: user._id,
            pointsEarned: 500,
            earnedAt: new Date(),
          });
          
          await referrer.save();
          console.log(`🎁 Referral bonus: ${referrer.name} earned 500 points`);
        }
      } catch (refError) {
        console.error('⚠️ Referral bonus error (non-critical):', refError.message);
        // Don't fail the entire transaction if referral fails
      }
    }

    // ✅ 8. Save user (with updated points)
    await user.save({ validateBeforeSave: false });
    console.log('💾 User points saved:', user.points);

    // ✅ 9. Update enrollment status
    enrollment.paymentStatus = "completed";
    enrollment.paidAt = Date.now();
    await enrollment.save();
    console.log('✅ Enrollment status updated to completed');

    // ✅ 10. Create notification
    try {
      await Notification.create({
        title: "Course Enrollment Successful",
        message: `You've successfully enrolled in ${course.title}! You earned 500 points.`,
        type: "enrollment",
        recipient: user._id,
      });
      console.log('📧 Notification created');
    } catch (notifError) {
      console.error('⚠️ Notification creation error (non-critical):', notifError.message);
      // Don't fail the transaction if notification fails
    }

    console.log(`✅ Enrollment verified successfully: ${user.name} -> ${course.title}`);

    // ✅ 11. Send success response
    res.status(200).json({
      success: true,
      message: "Enrollment completed successfully",
      data: {
        enrollment: {
          _id: enrollment._id,
          paymentStatus: enrollment.paymentStatus,
          paidAt: enrollment.paidAt,
        },
        course: {
          _id: course._id,
          title: course.title,
          slug: course.slug,
        },
        pointsDeducted: enrollment.pointsUsed,
        pointsEarned: 500,
        totalPoints: user.points,
      },
    });
  } catch (error) {
    console.error("❌ Verify enrollment error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify enrollment",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// @desc    Check if user is enrolled in a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Find course by ID or slug
    let course;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: course._id,
      paymentStatus: "completed",
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.error("❌ Check enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check enrollment status",
    });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({
      user: userId,
      paymentStatus: "completed",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error("❌ Get my enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};

// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      _id: id,
      user: userId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error("❌ Get enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment",
    });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { lessonId, completed } = req.body;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      _id: id,
      user: userId,
      paymentStatus: "completed",
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Store old progress to check if course was just completed
    const oldProgress = enrollment.progress;

    // Add or remove lesson from completedLessons
    if (completed) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (lessonIdItem) => lessonIdItem.toString() !== lessonId.toString()
      );
    }

    // Calculate progress percentage
    const course = await Course.findById(enrollment.course._id);
    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    // Update last accessed
    enrollment.lastAccessedAt = new Date();

    await enrollment.save();

    // ✅ Award 1000 points when course is completed (100% progress)
    if (oldProgress < 100 && enrollment.progress === 100) {
      const user = await User.findById(userId);
      user.points += 1000;
      await user.save();

      // Create notification
      await Notification.create({
        title: "Course Completed! 🎉",
        message: `Congratulations! You completed "${enrollment.course.title}" and earned 1000 points!`,
        type: "achievement",
        recipient: userId,
      });

      console.log(
        `🎓 User ${user.name} completed course "${enrollment.course.title}" - awarded 1000 points`
      );
    }

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons.length,
        totalLessons,
      },
    });
  } catch (error) {
    console.error("❌ Update progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};