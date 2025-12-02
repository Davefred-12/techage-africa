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
import Review from '../models/Review.js';


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

    // ✅ First, get enrollments
    const enrollments = await Enrollment.find({ 
      user: userId,
      paymentStatus: 'completed'
    });

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const inProgress = totalCourses - completedCourses;

    // ✅ Calculate REAL time from completed lessons' video durations
    let totalSeconds = 0;
    
    if (totalCourses > 0) {
      // ✅ Manually fetch each course with full data
      for (const enrollment of enrollments) {
        const course = await Course.findById(enrollment.course).lean();
        
        if (!course || !course.modules) {
          console.log('⚠️ Course missing modules:', course?.title);
          continue;
        }
        
        // Get completed lesson IDs for this enrollment
        const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
        
        console.log(`📚 Processing course: ${course.title}`);
        console.log(`   Completed lessons: ${completedLessonIds.length}`);
        console.log(`   Total modules: ${course.modules.length}`);
        
        // Calculate seconds from ONLY completed lessons using actual video duration
        course.modules.forEach(module => {
          console.log(`   Module: ${module.title}, Lessons: ${module.lessons?.length || 0}`);
          
          (module.lessons || []).forEach(lesson => {
            // Only count if lesson is completed
            if (completedLessonIds.includes(lesson._id.toString())) {
              if (lesson.duration && lesson.duration !== '00:00') {
                const parts = lesson.duration.split(":");
                const mins = parseInt(parts[0]) || 0;
                const secs = parseInt(parts[1]) || 0;
                const lessonTotalSeconds = (mins * 60) + secs;
                
                console.log(`      ✅ Lesson "${lesson.title}": ${lesson.duration} = ${lessonTotalSeconds}s`);
                totalSeconds += lessonTotalSeconds;
              }
            }
          });
        });
      }
    }

    console.log(`⏱️ Total learning time: ${totalSeconds} seconds`);

    // ✅ Convert to appropriate format
    let displayHours;
    let timeSpent;
    
    if (totalSeconds === 0) {
      displayHours = 0;
      timeSpent = '0s';
    } else if (totalSeconds < 60) {
      displayHours = 0;
      timeSpent = `${totalSeconds}s`;
    } else if (totalSeconds < 3600) {
      const totalMinutes = Math.round(totalSeconds / 60);
      displayHours = totalMinutes;
      timeSpent = `${totalMinutes} min`;
    } else {
      const hours = (totalSeconds / 3600).toFixed(1);
      displayHours = Math.round(totalSeconds / 3600);
      timeSpent = `${hours}h`;
    }

    const avgProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

    // ✅ Get current courses (in progress only) - fetch course data
    const currentCoursesData = [];
    for (const enrollment of enrollments) {
      if (enrollment.progress > 0 && enrollment.progress < 100) {
        const course = await Course.findById(enrollment.course)
          .select('title thumbnail modules')
          .lean();
        
        if (course) {
          const totalLessons = (course.modules || []).reduce((sum, module) => 
            sum + ((module.lessons || []).length), 0);
          
          const completedLessons = enrollment.completedLessons.length;

          currentCoursesData.push({
            id: course._id,
            title: course.title,
            thumbnail: course.thumbnail,
            progress: enrollment.progress,
            lastAccessed: getTimeAgo(enrollment.lastAccessedAt),
            nextLesson: 'Continue learning',
            totalLessons,
            completedLessons,
          });
        }
      }
    }
    const currentCourses = currentCoursesData.slice(0, 2);

    // ✅ Recent activity - fetch course titles
    const recentActivity = [];
    
    if (enrollments.length > 0) {
      const sortedEnrollments = enrollments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      
      for (const enrollment of sortedEnrollments) {
        const course = await Course.findById(enrollment.course).select('title').lean();
        
        if (enrollment.progress === 100) {
          recentActivity.push({
            type: 'completed',
            title: 'Completed course',
            course: course?.title,
            time: getTimeAgo(enrollment.updatedAt),
          });
        } else {
          recentActivity.push({
            type: 'enrolled',
            title: 'Enrolled in course',
            course: course?.title,
            time: getTimeAgo(enrollment.createdAt),
          });
        }
      }

      const certificatesEarned = enrollments.filter(e => e.certificateIssued);
      if (certificatesEarned.length > 0) {
        const certCourse = await Course.findById(certificatesEarned[0].course).select('title').lean();
        recentActivity.unshift({
          type: 'certificate',
          title: 'Earned certificate',
          course: certCourse?.title,
          time: getTimeAgo(certificatesEarned[0].certificateIssuedAt),
        });
      }
    }

    console.log('✅ Dashboard stats calculated:', {
      totalCourses,
      completedCourses,
      inProgress,
      totalSeconds,
      displayHours,
      timeSpent,
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
          totalHours: displayHours,
          timeSpent: timeSpent,
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

    const reviews = await Review.find({ course: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
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

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

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

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      // Recalculate course rating
      await updateCourseRating(req.params.id);

      console.log("✅ Review updated successfully");

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: existingReview,
      });
    }

    // Create new review
    const review = await Review.create({
      user: req.user._id,
      course: req.params.id,
      rating,
      comment,
    });

    // Update course rating
    await updateCourseRating(req.params.id);

    console.log("✅ Review submitted successfully");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully! 🎉",
      data: review,
    });
  } catch (error) {
    console.error("❌ Submit review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
});

// Helper function to update course rating
async function updateCourseRating(courseId) {
  try {
    const reviews = await Review.find({ course: courseId });
    
    if (reviews.length === 0) {
      await Course.findByIdAndUpdate(courseId, {
        'rating.average': 0,
        'rating.count': 0,
        totalReviews: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Course.findByIdAndUpdate(courseId, {
      'rating.average': parseFloat(averageRating.toFixed(1)),
      'rating.count': reviews.length,
      totalReviews: reviews.length,
    });

    console.log(`✅ Course rating updated: ${averageRating.toFixed(1)} (${reviews.length} reviews)`);
  } catch (error) {
    console.error("❌ Update course rating error:", error);
  }
}


// ============================================
// 📈 PROGRESS TRACKING - FIXED
// ============================================

// @desc    Get progress overview
// @route   GET /api/user/progress/overview
// @access  Private
// @desc    Get progress overview
// @route   GET /api/user/progress/overview
// @access  Private
router.get("/progress/overview", protect, async (req, res) => {
  try {
    console.log("📈 Fetching progress overview for user:", req.user._id);

    // ✅ First, get enrollments without populate
    const enrollments = await Enrollment.find({
      user: req.user._id,
      paymentStatus: "completed",
    });

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.progress === 100
    ).length;
    const inProgress = totalCourses - completedCourses;

    // ✅ FIX: Calculate REAL time from completed lessons' video durations
    let totalSeconds = 0;
    
    if (totalCourses > 0) {
      // ✅ Manually fetch each course with full data
      for (const enrollment of enrollments) {
        const course = await Course.findById(enrollment.course).lean();
        
        if (!course || !course.modules) {
          console.log('⚠️ Course missing modules:', course?.title);
          continue;
        }
        
        // Get completed lesson IDs for this enrollment
        const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
        
        console.log(`📚 Processing course: ${course.title}`);
        console.log(`   Completed lessons: ${completedLessonIds.length}`);
        
        // Calculate seconds from ONLY completed lessons using actual video duration
        course.modules.forEach((module) => {
          (module.lessons || []).forEach((lesson) => {
            // Only count if lesson is completed
            if (completedLessonIds.includes(lesson._id.toString())) {
              if (lesson.duration && lesson.duration !== '00:00') {
                const parts = lesson.duration.split(":");
                const mins = parseInt(parts[0]) || 0;
                const secs = parseInt(parts[1]) || 0;
                const lessonTotalSeconds = (mins * 60) + secs;
                
                console.log(`      ✅ Lesson "${lesson.title}": ${lesson.duration} = ${lessonTotalSeconds}s`);
                totalSeconds += lessonTotalSeconds;
              }
            }
          });
        });
      }
    }
    
    console.log(`⏱️ Total learning time: ${totalSeconds} seconds`);
    
    // ✅ Convert to appropriate format
    let displayHours;
    let timeSpent;
    
    if (totalSeconds === 0) {
      displayHours = 0;
      timeSpent = '0s';
    } else if (totalSeconds < 60) {
      displayHours = 0;
      timeSpent = `${totalSeconds}s`;
    } else if (totalSeconds < 3600) {
      const totalMinutes = Math.round(totalSeconds / 60);
      displayHours = totalMinutes;
      timeSpent = `${totalMinutes} min`;
    } else {
      const hours = (totalSeconds / 3600).toFixed(1);
      displayHours = Math.round(totalSeconds / 3600);
      timeSpent = `${hours}h`;
    }

    // ✅ Accurate average progress
    const avgProgress =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length
          )
        : 0;

    // ✅ Build course progress with manual course fetching
    const courseProgress = [];
    
    for (const enrollment of enrollments) {
      const course = await Course.findById(enrollment.course).lean();
      
      if (!course) continue;
      
      // ✅ FIX: Calculate total lessons correctly
      const totalLessons = (course.modules || []).reduce(
        (sum, module) => sum + ((module.lessons || []).length),
        0
      );
      
      const completedLessons = enrollment.completedLessons.length;

      // ✅ FIX: Calculate REAL time spent per course from actual video durations
      let courseSeconds = 0;
      const completedLessonIds = enrollment.completedLessons.map(id => id.toString());
      
      (course.modules || []).forEach((module) => {
        (module.lessons || []).forEach((lesson) => {
          if (completedLessonIds.includes(lesson._id.toString())) {
            if (lesson.duration && lesson.duration !== '00:00') {
              const parts = lesson.duration.split(":");
              const mins = parseInt(parts[0]) || 0;
              const secs = parseInt(parts[1]) || 0;
              courseSeconds += (mins * 60) + secs;
            }
          }
        });
      });
      
      // Format time spent for this course
      let courseTimeSpent;
      if (courseSeconds === 0) {
        courseTimeSpent = '0s';
      } else if (courseSeconds < 60) {
        courseTimeSpent = `${courseSeconds}s`;
      } else if (courseSeconds < 3600) {
        const mins = Math.round(courseSeconds / 60);
        courseTimeSpent = `${mins} min`;
      } else {
        const hours = (courseSeconds / 3600).toFixed(1);
        courseTimeSpent = `${hours}h`;
      }

      courseProgress.push({
        id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        progress: enrollment.progress,
        status: enrollment.progress === 100 ? "completed" : "in-progress",
        totalLessons, // ✅ Now accurate!
        completedLessons,
        timeSpent: courseTimeSpent, // ✅ Real time from video durations!
        lastActivity: getTimeAgo(enrollment.lastAccessedAt),
        ...(enrollment.progress === 100 && {
          completedDate: formatDate(enrollment.updatedAt),
          certificate: `certificate-${enrollment._id}.pdf`,
        }),
        ...(enrollment.progress < 100 && {
          nextLesson: "Continue where you left off",
        }),
      });
    }

    console.log('✅ Progress calculated:', {
      totalCourses,
      completedCourses,
      inProgress,
      totalSeconds,
      displayHours,
      timeSpent,
      avgProgress,
    });

    res.status(200).json({
      success: true,
      data: {
        overallStats: {
          totalCourses,
          completed: completedCourses,
          inProgress,
          totalHours: displayHours, // Number for display
          timeSpent: timeSpent, // ✅ Human-readable string
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
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or course not completed",
      });
    }

    // ✅ FIX: Manually fetch the full course with modules
    const course = await Course.findById(req.params.courseId)
      .select('title instructor duration modules certificateTemplate')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ Debug: Log the course structure
    console.log('📚 Course structure:', {
      hasModules: !!course.modules,
      modulesCount: course.modules?.length || 0,
      firstModule: course.modules?.[0] ? {
        title: course.modules[0].title,
        lessonsCount: course.modules[0].lessons?.length || 0
      } : 'No modules',
    });

    // ✅ Calculate accurate stats from full course data
    const modules = course.modules || [];
    const totalModules = modules.length;
    
    // ✅ Count total lessons
    const totalLessons = modules.reduce((sum, module) => {
      const lessonCount = (module.lessons || []).length;
      console.log(`Module "${module.title}": ${lessonCount} lessons`);
      return sum + lessonCount;
    }, 0);

    // ✅ FIX: Calculate TOTAL SECONDS first, then convert to minutes/hours
    let totalSeconds = 0;
    
    modules.forEach((module) => {
      (module.lessons || []).forEach((lesson) => {
        if (lesson.duration && lesson.duration !== '00:00') {
          const parts = lesson.duration.split(":");
          const mins = parseInt(parts[0]) || 0;
          const secs = parseInt(parts[1]) || 0;
          const lessonTotalSeconds = (mins * 60) + secs;
          
          console.log(`  Lesson "${lesson.title}": ${lesson.duration} = ${lessonTotalSeconds}s`);
          totalSeconds += lessonTotalSeconds;
        }
      });
    });

    console.log(`📊 Total time: ${totalSeconds} seconds`);

    // ✅ Convert to appropriate unit
    let timeSpent;
    let hoursLearned;
    
    if (totalSeconds < 60) {
      // Less than 1 minute - show seconds
      timeSpent = `${totalSeconds}s`;
      hoursLearned = 0;
    } else if (totalSeconds < 3600) {
      // Less than 1 hour - show minutes
      const totalMinutes = Math.round(totalSeconds / 60);
      timeSpent = `${totalMinutes} min`;
      hoursLearned = 0;
    } else {
      // 1 hour or more - show hours
      const hours = (totalSeconds / 3600).toFixed(1);
      timeSpent = `${hours}h`;
      hoursLearned = Math.round(totalSeconds / 3600);
    }

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
      hoursLearned: hoursLearned,  // For stats display
      timeSpent: timeSpent,  // Human-readable time
      userName: req.user.name,
      certificatePreview: course.certificateTemplate || null,
    };

    console.log("✅ Certificate data prepared:", {
      userName: certificateData.userName,
      courseTitle: certificateData.title,
      modules: certificateData.modules,
      lessons: certificateData.lessons,
      totalSeconds: totalSeconds,
      timeSpent: certificateData.timeSpent,
      hoursLearned: certificateData.hoursLearned,
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
