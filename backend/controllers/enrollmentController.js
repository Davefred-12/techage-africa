// ============================================
// FILE: backend/controllers/enrollmentController.js - FIXED
// ============================================
import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import {
  initializePayment,
  verifyPayment,
  generateReference,
  nairaToKobo,
} from "../utils/paystack.js";

// @desc    Initiate course enrollment payment
// @route   POST /api/enrollments/initiate
// @access  Private (logged-in users only)
export const initiateEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if course exists
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

    // Check if user already has ANY enrollment (pending or completed)
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: course._id,
    });

    if (existingEnrollment) {
      // If already completed enrollment, don't allow re-enrollment
      if (existingEnrollment.paymentStatus === "completed") {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      // If payment is pending, return existing payment link
      if (existingEnrollment.paymentStatus === "pending") {
        const paymentData = await initializePayment({
          email: req.user.email,
          amount: nairaToKobo(course.price),
          reference: existingEnrollment.paystackReference,
          callback_url: `${process.env.CLIENT_URL}/payment/verify?reference=${existingEnrollment.paystackReference}`,
          metadata: {
            userId: userId,
            courseId: course._id.toString(),
            enrollmentId: existingEnrollment._id.toString(),
          },
        });

        return res.status(200).json({
          success: true,
          message: "Payment re-initiated successfully",
          data: {
            authorization_url: paymentData.data.authorization_url,
            reference: existingEnrollment.paystackReference,
            amount: course.price,
          },
        });
      }
    }

    // Generate payment reference
    const reference = generateReference();

    // Create pending enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      paystackReference: reference,
      amount: course.price,
      paymentStatus: "pending",
    });

    // Initialize Paystack payment
    const paymentData = await initializePayment({
      email: req.user.email,
      amount: nairaToKobo(course.price),
      reference: reference,
      callback_url: `${process.env.CLIENT_URL}/payment/verify?reference=${reference}`,
      metadata: {
        userId: userId,
        courseId: courseId,
        enrollmentId: enrollment._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        authorization_url: paymentData.data.authorization_url,
        reference: reference,
        amount: course.price,
      },
    });
  } catch (error) {
    console.error("Initiate enrollment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate enrollment",
    });
  }
};

// @desc    Verify payment and complete enrollment
// @route   POST /api/enrollments/verify
// @access  Private
export const verifyEnrollment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // Find enrollment by reference FIRST
    const enrollment = await Enrollment.findOne({
      paystackReference: reference,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // ✅ FIX: Check if already completed BEFORE doing anything else
    if (enrollment.paymentStatus === "completed") {
      console.log('⚠️ Payment already verified for this enrollment');
      return res.status(200).json({
        success: true,
        message: "Enrollment already completed",
        data: {
          enrollment,
          course: enrollment.course,
        },
      });
    }

    // Verify payment with Paystack
    const verification = await verifyPayment(reference);

    if (!verification.status || verification.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ Update enrollment status
    enrollment.paymentStatus = "completed";
    enrollment.paidAt = new Date();
    await enrollment.save();

    // ✅ FIX: Increment enrolled students count ONLY ONCE
    await Course.findByIdAndUpdate(enrollment.course._id, {
      $inc: { enrolledStudents: 1 },
    });

    console.log('✅ Enrollment completed, student count incremented by 1');

    // ✅ Add course to user's enrolledCourses (check if not already added)
    const user = await User.findById(enrollment.user);
    const alreadyInUserCourses = user.enrolledCourses.some(
      (ec) => ec.course.toString() === enrollment.course._id.toString()
    );

    if (!alreadyInUserCourses) {
      await User.findByIdAndUpdate(enrollment.user, {
        $push: {
          enrolledCourses: {
            course: enrollment.course._id,
            enrolledAt: new Date(),
          },
        },
      });
      console.log('✅ Course added to user enrolledCourses');
    }

    // ✅ Award 500 points for course purchase
    user.points += 500;
    await user.save();

    // ✅ Create notification for points earned
    await Notification.create({
      title: "Points Earned!",
      message: `Congratulations! You earned 500 points for purchasing "${enrollment.course.title}".`,
      type: "system",
      recipient: enrollment.user,
    });

    // ✅ Check if user was referred and award points to referrer
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        referrer.points += 500;
        // Update existing referral or add if not exists
        const existingReferral = referrer.referrals.find(r => r.user.toString() === user._id.toString());
        if (existingReferral) {
          existingReferral.pointsEarned += 500;
        } else {
          referrer.referrals.push({
            user: user._id,
            pointsEarned: 500,
          });
        }
        await referrer.save();

        // ✅ Notify referrer
        await Notification.create({
          title: "Referral Reward!",
          message: `Great news! ${user.name} purchased a course using your referral link. You earned 500 points!`,
          type: "referral_reward",
          recipient: referrer._id,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Enrollment completed successfully! 🎉",
      data: {
        enrollment,
        course: enrollment.course,
        pointsEarned: 500,
      },
    });
  } catch (error) {
    console.error("Verify enrollment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify enrollment",
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
    console.error("Check enrollment error:", error);
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
    console.error("Get my enrollments error:", error);
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
    console.error("Get enrollment error:", error);
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
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Add or remove lesson from completedLessons
    if (completed) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId.toString()
      );
    }

    // Calculate progress percentage
    const course = await Course.findById(enrollment.course);
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
    console.error("Update progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};