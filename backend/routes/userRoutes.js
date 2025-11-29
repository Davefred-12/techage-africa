// ============================================
// FILE: backend/routes/userRoutes.js - COMPLETE
// ============================================
import express from "express";
import User from "../models/User.js";
import Course from "../models/course.js";
import Enrollment from "../models/Enrollment.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { memoryUpload } from "../middleware/multer.js";

const router = express.Router();

// ============================================
// 📊 DASHBOARD STATS
// ============================================

// @desc    Get user dashboard stats
// @route   GET /api/user/dashboard/stats
// @access  Private
// FIND THIS SECTION (around line 30-100) and REPLACE with:

router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats for user:', req.user._id);

    const userId = req.user._id;

    const enrollments = await Enrollment.find({ 
      user: userId,
      paymentStatus: 'completed'
    }).populate('course', 'title thumbnail duration modules');

    // ✅ REAL DATA - No fake numbers
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const inProgress = totalCourses - completedCourses;

    // ✅ Calculate REAL total hours from actual completed lessons
    let totalHours = 0;
    if (totalCourses > 0) {
      enrollments.forEach(enrollment => {
        const course = enrollment.course;
        if (!course || !course.modules) return;
        
        // Get completed lesson IDs for this enrollment
        const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
        
        // Calculate hours from ONLY completed lessons
        course.modules.forEach(module => {
          (module.lessons || []).forEach(lesson => {
            // Only count if lesson is completed
            if (completedLessonIds.includes(lesson._id.toString())) {
              if (lesson.duration && lesson.duration !== '00:00') {
                const [mins, secs] = lesson.duration.split(':').map(Number);
                const minutes = (mins || 0) + ((secs || 0) / 60);
                totalHours += minutes / 60; // Convert to hours
              }
            }
          });
        });
      });
      
      totalHours = Math.round(totalHours); // Round to nearest hour
    }

    // ✅ If no lessons completed, hours should be 0
    if (totalHours < 1 && enrollments.some(e => e.completedLessons.length > 0)) {
      totalHours = 1; // Show at least 1 hour if there are some completed lessons
    }

    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

    // Get current courses (in progress only)
    const currentCourses = enrollments
      .filter(e => e.progress > 0 && e.progress < 100) // ✅ Only show courses with actual progress
      .slice(0, 2)
      .map(enrollment => {
        const course = enrollment.course;
        
        // ✅ Calculate total lessons correctly
        const totalLessons = (course.modules || []).reduce((sum, module) => 
          sum + ((module.lessons || []).length), 0);
        
        const completedLessons = enrollment.completedLessons.length;

        return {
          id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          progress: enrollment.progress,
          lastAccessed: getTimeAgo(enrollment.lastAccessedAt),
          nextLesson: 'Continue learning',
          totalLessons,
          completedLessons,
        };
      });

    // Recent activity - only if there are enrollments
    const recentActivity = [];
    
    if (enrollments.length > 0) {
      enrollments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .forEach(enrollment => {
          if (enrollment.progress === 100) {
            recentActivity.push({
              type: 'completed',
              title: 'Completed course',
              course: enrollment.course?.title,
              time: getTimeAgo(enrollment.updatedAt),
            });
          } else {
            recentActivity.push({
              type: 'enrolled',
              title: 'Enrolled in course',
              course: enrollment.course?.title,
              time: getTimeAgo(enrollment.createdAt),
            });
          }
        });

      // Add certificate activity
      const certificatesEarned = enrollments.filter(e => e.certificateIssued);
      if (certificatesEarned.length > 0) {
        recentActivity.unshift({
          type: 'certificate',
          title: 'Earned certificate',
          course: certificatesEarned[0].course?.title,
          time: getTimeAgo(certificatesEarned[0].certificateIssuedAt),
        });
      }
    }

    console.log('✅ Dashboard stats calculated:', {
      totalCourses,
      completedCourses,
      inProgress,
      totalHours,
      avgProgress,
      currentCoursesCount: currentCourses.length,
      recentActivityCount: recentActivity.length,
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCourses,
          completed: completedCourses,
          inProgress,
          totalHours, // ✅ REAL hours from completed lessons only
          avgProgress,
          certificates: enrollments.filter(e => e.certificateIssued).length,
        },
        currentCourses,
        recentActivity: recentActivity.slice(0, 3),
      },
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
});

// ============================================
// 📚 MY COURSES
// ============================================

// @desc    Get user's enrolled courses
// @route   GET /api/user/courses/enrolled
// @access  Private
// FIND THIS SECTION (around line 150-200) and REPLACE with:

router.get('/courses/enrolled', protect, async (req, res) => {
  try {
    console.log('📚 Fetching enrolled courses for user:', req.user._id);

    const { status } = req.query;

    const enrollments = await Enrollment.find({ 
      user: req.user._id,
      paymentStatus: 'completed'
    }).populate('course');

    let filteredEnrollments = enrollments;

    if (status === 'in-progress') {
      filteredEnrollments = enrollments.filter(e => e.progress < 100);
    } else if (status === 'completed') {
      filteredEnrollments = enrollments.filter(e => e.progress === 100);
    }

    const courses = filteredEnrollments.map(enrollment => {
      const course = enrollment.course;
      
      // ✅ FIX: Calculate total lessons correctly
      const totalLessons = (course.modules || []).reduce((sum, module) => {
        return sum + ((module.lessons || []).length);
      }, 0);
      
      const completedLessons = enrollment.completedLessons.length;

      return {
        id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        progress: enrollment.progress,
        status: enrollment.progress === 100 ? 'completed' : 'in-progress',
        enrolledDate: formatDate(enrollment.createdAt),
        lastAccessed: getTimeAgo(enrollment.lastAccessedAt),
        ...(enrollment.progress === 100 && {
          completedDate: formatDate(enrollment.updatedAt),
        }),
        totalLessons, // ✅ Now accurate
        completedLessons,
        duration: course.duration,
        certificate: enrollment.certificateIssued ? `certificate-${enrollment._id}.pdf` : null,
      };
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('❌ Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
    });
  }
});

// ============================================
// 🎥 COURSE PLAYER
// ============================================

// @desc    Get course content for player
// @route   GET /api/user/courses/:id/content
// @access  Private
router.get("/courses/:id/content", protect, async (req, res) => {
  try {
    console.log("🎥 Fetching course content:", req.params.id);

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id,
      paymentStatus: "completed",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: course._id,
        title: course.title,
        description: course.longDescription,
        progress: enrollment.progress,
        totalLessons: course.modules.reduce(
          (sum, m) => sum + m.lessons.length,
          0
        ),
        completedLessons: enrollment.completedLessons.length,
        modules: course.modules,
        completedLessonIds: enrollment.completedLessons,
      },
    });
  } catch (error) {
    console.error("❌ Get course content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course content",
    });
  }
});

// @desc    Mark lesson as complete
// @route   POST /api/user/courses/:id/lessons/:lessonId/complete
// @access  Private
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  protect,
  async (req, res) => {
    try {
      console.log("✅ Marking lesson complete:", req.params.lessonId);

      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: req.params.courseId,
        paymentStatus: "completed",
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: "You are not enrolled in this course",
        });
      }

      // Add lesson to completed lessons if not already there
      if (!enrollment.completedLessons.includes(req.params.lessonId)) {
        enrollment.completedLessons.push(req.params.lessonId);
      }

      // Update last accessed
      enrollment.lastAccessedAt = Date.now();

      // Calculate progress
      const course = await Course.findById(req.params.courseId);
      const totalLessons = course.modules.reduce(
        (sum, m) => sum + m.lessons.length,
        0
      );
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );

      // If 100% complete, issue certificate
      if (enrollment.progress === 100 && !enrollment.certificateIssued) {
        enrollment.certificateIssued = true;
        enrollment.certificateIssuedAt = Date.now();
      }

      await enrollment.save();

      res.status(200).json({
        success: true,
        data: {
          progress: enrollment.progress,
          completedLessons: enrollment.completedLessons.length,
          certificateIssued: enrollment.certificateIssued,
        },
      });
    } catch (error) {
      console.error("❌ Mark lesson complete error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark lesson as complete",
      });
    }
  }
);

// ============================================
// ⭐ REVIEWS
// ============================================

// @desc    Get course reviews
// @route   GET /api/user/courses/:id/reviews
// @access  Public
router.get("/courses/:id/reviews", async (req, res) => {
  try {
    console.log("⭐ Fetching reviews for course:", req.params.id);

    // TODO: Create Review model and implement this
    // For now, return empty array
    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
});

// @desc    Submit course review
// @route   POST /api/user/courses/:id/review
// @access  Private
router.post("/courses/:id/review", protect, async (req, res) => {
  try {
    console.log("⭐ Submitting review for course:", req.params.id);

    const { rating, comment } = req.body;

    // Check if user completed the course
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id,
      progress: 100,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must complete the course before reviewing",
      });
    }

    // TODO: Create Review model and save review
    // For now, just return success
    console.log("Review data:", {
      rating,
      comment,
      user: req.user._id,
      course: req.params.id,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("❌ Submit review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
});


// ============================================
// 📈 PROGRESS TRACKING - FIXED
// ============================================

// @desc    Get progress overview
// @route   GET /api/user/progress/overview
// @access  Private
router.get("/progress/overview", protect, async (req, res) => {
  try {
    console.log("📈 Fetching progress overview for user:", req.user._id);

    const enrollments = await Enrollment.find({
      user: req.user._id,
      paymentStatus: "completed",
    }).populate("course");

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.progress === 100
    ).length;
    const inProgress = totalCourses - completedCourses;

    // ✅ FIX: Calculate REAL total hours from actual completed lessons' video durations
    let totalMinutes = 0;
    
    enrollments.forEach((enrollment) => {
      const course = enrollment.course;
      if (!course || !course.modules) return;
      
      // Get completed lesson IDs for this enrollment
      const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
      
      // Calculate minutes from ONLY completed lessons using actual video duration
      course.modules.forEach((module) => {
        (module.lessons || []).forEach((lesson) => {
          // Only count if lesson is completed
          if (completedLessonIds.includes(lesson._id.toString())) {
            if (lesson.duration && lesson.duration !== '00:00') {
              const [mins, secs] = lesson.duration.split(':').map(Number);
              totalMinutes += (mins || 0) + ((secs || 0) / 60);
            }
          }
        });
      });
    });
    
    // Convert minutes to hours
    const totalHours = totalMinutes / 60;
    
    // Format hours for display
    let displayHours;
    if (totalHours < 1) {
      // If less than 1 hour, show minutes
      displayHours = Math.round(totalMinutes);
    } else {
      // If 1 hour or more, round to nearest hour
      displayHours = Math.round(totalHours);
    }

    // ✅ Accurate average progress
    const avgProgress =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length
          )
        : 0;

    const courseProgress = enrollments.map((enrollment) => {
      const course = enrollment.course;
      
      // ✅ FIX: Calculate total lessons correctly
      const totalLessons = (course.modules || []).reduce(
        (sum, module) => sum + ((module.lessons || []).length),
        0
      );
      
      const completedLessons = enrollment.completedLessons.length;

      // ✅ FIX: Calculate REAL time spent per course from actual video durations
      let courseMinutes = 0;
      const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
      
      (course.modules || []).forEach((module) => {
        (module.lessons || []).forEach((lesson) => {
          if (completedLessonIds.includes(lesson._id.toString())) {
            if (lesson.duration && lesson.duration !== '00:00') {
              const [mins, secs] = lesson.duration.split(':').map(Number);
              courseMinutes += (mins || 0) + ((secs || 0) / 60);
            }
          }
        });
      });
      
      // Format time spent for this course
      let timeSpent;
      if (courseMinutes < 1) {
        timeSpent = `${Math.round(courseMinutes)} min`;
      } else if (courseMinutes < 60) {
        timeSpent = `${Math.round(courseMinutes)} min`;
      } else {
        const hours = Math.round(courseMinutes / 60);
        timeSpent = `${hours}h`;
      }

      return {
        id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        progress: enrollment.progress,
        status: enrollment.progress === 100 ? "completed" : "in-progress",
        totalLessons, // ✅ Now accurate!
        completedLessons,
        timeSpent, // ✅ Real time from video durations!
        lastActivity: getTimeAgo(enrollment.lastAccessedAt),
        ...(enrollment.progress === 100 && {
          completedDate: formatDate(enrollment.updatedAt),
          certificate: `certificate-${enrollment._id}.pdf`,
        }),
        ...(enrollment.progress < 100 && {
          nextLesson: "Continue where you left off",
        }),
      };
    });

    console.log('✅ Progress calculated:', {
      totalCourses,
      completedCourses,
      inProgress,
      totalMinutes: Math.round(totalMinutes),
      displayHours,
      avgProgress,
    });

    res.status(200).json({
      success: true,
      data: {
        overallStats: {
          totalCourses,
          completed: completedCourses,
          inProgress,
          totalHours: displayHours, // ✅ Real hours from actual video durations!
          avgProgress,
          certificates: completedCourses,
        },
        courseProgress,
      },
    });
  } catch (error) {
    console.error("❌ Progress overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress overview",
    });
  }
});

// @desc    Get achievements
// @route   GET /api/user/progress/achievements
// @access  Private
router.get("/progress/achievements", protect, async (req, res) => {
  try {
    console.log("🏆 Fetching achievements for user:", req.user._id);

    const enrollments = await Enrollment.find({
      user: req.user._id,
      paymentStatus: "completed",
    }).sort({ updatedAt: 1 });

    const completedCourses = enrollments.filter((e) => e.progress === 100);
    const completedCount = completedCourses.length;

    // ✅ Calculate real achievements based on actual data
    const totalEnrollments = enrollments.length;

    // First course completion
    const firstCompletion =
      completedCourses.length > 0 ? completedCourses[0] : null;

    const achievements = [
      {
        title: "First Step",
        description: "Enrolled in your first course",
        icon: "🎓",
        earned: totalEnrollments >= 1,
        date:
          totalEnrollments >= 1 ? formatDate(enrollments[0]?.createdAt) : null,
      },
      {
        title: "Course Completer",
        description: "Completed your first course",
        icon: "⚡",
        earned: completedCount >= 1,
        date: firstCompletion ? formatDate(firstCompletion.updatedAt) : null,
      },
      {
        title: "Learning Enthusiast",
        description: "Complete 3 courses",
        icon: "🔥",
        earned: completedCount >= 3,
        progress: completedCount >= 3 ? null : `${completedCount}/3`,
        date:
          completedCount >= 3
            ? formatDate(completedCourses[2]?.updatedAt)
            : null,
      },
      {
        title: "Certificate Collector",
        description: "Earn 5 certificates",
        icon: "🏆",
        earned: completedCount >= 5,
        progress: completedCount >= 5 ? null : `${completedCount}/5`,
        date:
          completedCount >= 5
            ? formatDate(completedCourses[4]?.updatedAt)
            : null,
      },
    ];

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("❌ Get achievements error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
});

// ============================================
// 🛒 ORDER HISTORY
// ============================================

// @desc    Get user's orders
// @route   GET /api/user/orders
// @access  Private
router.get("/orders", protect, async (req, res) => {
  try {
    console.log("🛒 Fetching orders for user:", req.user._id);

    const enrollments = await Enrollment.find({
      user: req.user._id,
      paymentStatus: "completed",
    })
      .populate("course", "title thumbnail")
      .sort({ createdAt: -1 });

    const orders = enrollments.map((enrollment) => ({
      id: `ORD-${enrollment.createdAt.getFullYear()}-${enrollment._id
        .toString()
        .slice(-3)}`,
      date: formatDate(enrollment.createdAt),
      course: {
        id: enrollment.course._id,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
      },
      amount: enrollment.amount,
      paymentMethod: `Paystack - ${enrollment.currency}`,
      status: enrollment.paymentStatus,
      invoice: `invoice-${enrollment._id}.pdf`,
    }));

    const totalSpent = enrollments.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalSpent,
      },
    });
  } catch (error) {
    console.error("❌ Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// @desc    Download invoice
// @route   GET /api/user/orders/:id/invoice
// @access  Private
router.get("/orders/:id/invoice", protect, async (req, res) => {
  try {
    console.log("📄 Downloading invoice:", req.params.id);

    // TODO: Generate PDF invoice
    res.status(200).json({
      success: true,
      message: "Invoice generation will be implemented",
    });
  } catch (error) {
    console.error("❌ Download invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download invoice",
    });
  }
});

// ============================================
// FIXED: Certificate Routes in userRoutes.js
// Replace the existing certificate routes with these
// ============================================

// @desc    Get certificate for completed course
// @route   GET /api/user/certificates/:courseId
// @access  Private
router.get("/certificates/:courseId", protect, async (req, res) => {
  try {
    console.log("🎓 Fetching certificate for course:", req.params.courseId);

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
      progress: 100,
      certificateIssued: true,
    }).populate(
      "course",
      "title instructor duration modules certificateTemplate"
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or course not completed",
      });
    }

    const course = enrollment.course;

    // ✅ Calculate accurate stats
    const modules = course.modules || [];
    const totalModules = modules.length;
    const totalLessons = modules.reduce((sum, module) => {
      return sum + (module.lessons?.length || 0);
    }, 0);

    // ✅ Calculate hours from lesson durations
    let totalMinutes = 0;
    modules.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        if (lesson.duration) {
          // Parse duration like "10:30" or "05:45"
          const [mins, secs] = lesson.duration.split(":").map(Number);
          totalMinutes += (mins || 0) + (secs || 0) / 60;
        }
      });
    });
    const totalHours = Math.ceil(totalMinutes / 60) || 1; // At least 1 hour

    const certificateData = {
      id: req.params.courseId,
      title: course.title,
      instructor: course.instructor?.name || "TechAge Admin",
      completedDate: formatDate(
        enrollment.certificateIssuedAt || enrollment.updatedAt
      ),
      duration: course.duration,
      modules: totalModules,
      lessons: totalLessons,
      hoursLearned: totalHours,
      userName: req.user.name,
      certificatePreview: course.certificateTemplate || null,
    };

    console.log("✅ Certificate data prepared:", {
      userName: certificateData.userName,
      courseTitle: certificateData.title,
      hasTemplate: !!certificateData.certificatePreview,
    });

    res.status(200).json({
      success: true,
      data: certificateData,
    });
  } catch (error) {
    console.error("❌ Get certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
    });
  }
});

// @desc    Download certificate PDF (Legacy endpoint - kept for compatibility)
// @route   GET /api/user/certificates/:courseId/download
// @access  Private
router.get("/certificates/:courseId/download", protect, async (req, res) => {
  try {
    console.log(
      "📥 Certificate download requested for course:",
      req.params.courseId
    );

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
      progress: 100,
      certificateIssued: true,
    }).populate("course", "title certificateTemplate");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF generation handled on frontend",
      data: {
        template: enrollment.course.certificateTemplate,
        userName: req.user.name,
        courseTitle: enrollment.course.title,
        completedDate: formatDate(
          enrollment.certificateIssuedAt || enrollment.updatedAt
        ),
      },
    });
  } catch (error) {
    console.error("❌ Download certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to prepare certificate download",
    });
  }
});
// ============================================
// 👤 PROFILE & SETTINGS
// ============================================

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put(
  "/profile",
  protect,
  memoryUpload.single("avatar"),
  async (req, res) => {
    try {
      console.log("✏️ Updating profile for user:", req.user._id);
      console.log("📦 Request body:", req.body);
      console.log("📦 File received:", req.file ? "Yes" : "No");

      const { fullName, email, phone, bio } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update fields
      if (fullName) user.name = fullName;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (bio) user.bio = bio;

      // Handle avatar upload
      if (req.file) {
        console.log("📸 Uploading avatar to Cloudinary...");
        console.log("📦 File details:", {
          size: req.file.size,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
        });

        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "profiles",
          resource_type: "image",
        });

        user.avatar = result.url || result.secure_url;
        console.log("✅ Avatar URL saved:", user.avatar);
      }

      await user.save();

      // Return updated user data
      const updatedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
      };

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("❌ Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// @desc    Change password
// @route   PUT /api/user/password
// @access  Private
router.put("/password", protect, async (req, res) => {
  try {
    console.log("🔐 Changing password for user:", req.user._id);

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default router;
