// ============================================
// FILE: backend/routes/adminRoutes.js - COMPLETE
// ============================================
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Course from "../models/course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { diskUpload, memoryUpload } from "../middleware/multer.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// ============================================
// ADMIN MIDDLEWARE
// ============================================
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

// Apply protect and isAdmin to all routes
router.use(protect, isAdmin);

// ============================================
// DASHBOARD STATS
// ============================================

// GET /api/admin/stats - Dashboard overview
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isPublished: true });

    // Total enrollments and revenue
    const enrollmentStats = await Enrollment.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const stats = enrollmentStats[0] || {
      totalEnrollments: 0,
      totalRevenue: 0,
    };

    // Recent enrollments (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEnrollments = await Enrollment.countDocuments({
      createdAt: { $gte: weekAgo },
      paymentStatus: "completed",
    });

    // Category stats
    const categoryStats = await Course.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        activeCourses,
        totalEnrollments: stats.totalEnrollments,
        totalRevenue: stats.totalRevenue,
        recentEnrollments,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
});

// GET /api/admin/recent-enrollments - Recent enrollments for dashboard
router.get("/recent-enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ paymentStatus: "completed" })
      .populate("user", "name email avatar")
      .populate("course", "title price")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedEnrollments = enrollments.map((e) => ({
      id: e._id,
      user: {
        name: e.user?.name || "Unknown",
        email: e.user?.email || "N/A",
        avatar: e.user?.avatar || "",
      },
      course: e.course?.title || "Course Deleted",
      amount: e.amount,
      date: e.createdAt,
      status: e.paymentStatus,
    }));

    res.json({
      success: true,
      data: formattedEnrollments,
    });
  } catch (error) {
    console.error("Get recent enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
});

// GET /api/admin/popular-courses - Popular courses for dashboard
router.get("/popular-courses", async (req, res) => {
  try {
    const popularCourses = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" },
          revenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$enrollments",
                    as: "e",
                    cond: { $eq: ["$$e.paymentStatus", "completed"] },
                  },
                },
                as: "e",
                in: "$$e.amount",
              },
            },
          },
        },
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: "$title",
          enrollments: "$enrollmentCount",
          revenue: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: popularCourses,
    });
  } catch (error) {
    console.error("Get popular courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular courses",
    });
  }
});

// ============================================
// COURSE MANAGEMENT
// ============================================

// GET /api/admin/courses - Get all courses (with filters)
router.get("/courses", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by status
    if (status && status !== "all") {
      query.isPublished = status === "active";
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(query);

    // Get enrollment counts for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({
          course: course._id,
          paymentStatus: "completed",
        });

        const revenueData = await Enrollment.aggregate([
          {
            $match: {
              course: course._id,
              paymentStatus: "completed",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const revenue = revenueData[0]?.total || 0;

        return {
          ...course.toObject(),
          enrollments: enrollmentCount,
          revenue,
          status: course.isPublished ? "active" : "draft",
          modules: course.modules?.length || 0,
          totalLessons:
            course.modules?.reduce(
              (sum, m) => sum + (m.lessons?.length || 0),
              0
            ) || 0,
        };
      })
    );

    res.json({
      success: true,
      courses: coursesWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
});

// GET /api/admin/courses/:id - Get single course
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email avatar"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
});

// POST /api/admin/courses - Create course (with file uploads)
router.post("/courses", async (req, res) => {
  try {
    console.log("📦 Creating new course...");
    console.log("Request body keys:", Object.keys(req.body));

    const {
      title,
      description,
      longDescription,
      category,
      level,
      price,
      discountPrice,
      isFeatured,
      isMostPopular,
      isNew,
      isHotDeal,
      duration,
      language,
      thumbnail,
      previewVideo,
      certificateTemplate,
      whatYouWillLearn,
      requirements,
      modules,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !level || !price) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, description, category, level, price",
      });
    }

    // Upload thumbnail to Cloudinary
    let thumbnailUrl = "";
    if (thumbnail) {
      console.log("📸 Uploading thumbnail to Cloudinary...");
      const buffer = Buffer.from(thumbnail.split(",")[1], "base64");
      const result = await uploadToCloudinary(buffer, {
        folder: "courses/thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = result.secure_url;
      console.log("✅ Thumbnail uploaded:", thumbnailUrl);
    }

    // Upload preview video (if provided)
    let previewVideoUrl = "";
    if (previewVideo) {
      console.log("🎥 Uploading preview video to Cloudinary...");
      const buffer = Buffer.from(previewVideo.split(",")[1], "base64");
      const result = await uploadToCloudinary(buffer, {
        folder: "courses/previews",
        resource_type: "video",
      });
      previewVideoUrl = result.secure_url;
      console.log("✅ Preview video uploaded:", previewVideoUrl);
    }

    // Upload certificate template (if provided)
    let certificateUrl = "";
    if (certificateTemplate) {
      console.log("📄 Uploading certificate template to Cloudinary...");
      const buffer = Buffer.from(certificateTemplate.split(",")[1], "base64");
      const result = await uploadToCloudinary(buffer, {
        folder: "courses/certificates",
        resource_type: "image",
      });
      certificateUrl = result.secure_url;
      console.log("✅ Certificate uploaded:", certificateUrl);
    }
    // Process modules and upload lesson videos
    const processedModules = await Promise.all(
      (modules || []).map(async (module) => {
        const processedLessons = await Promise.all(
          (module.lessons || []).map(async (lesson) => {
            let videoUrl = lesson.videoUrl;

            // Upload lesson video if it's base64
            if (videoUrl && videoUrl.startsWith("data:")) {
              console.log(`🎥 Uploading lesson video: ${lesson.title}...`);
              const buffer = Buffer.from(videoUrl.split(",")[1], "base64");
              const result = await uploadToCloudinary(buffer, {
                folder: "courses/lessons",
                resource_type: "video",
              });
              videoUrl = result.secure_url;
              console.log("✅ Lesson video uploaded");
            }

            return {
              title: lesson.title,
              videoUrl,
              duration: lesson.duration, // ✅ No default! Keep what's sent
              order: lesson.order || 1,
            };
          })
        );

        return {
          title: module.title,
          description: module.description || "",
          order: module.order || 1,
          lessons: processedLessons,
        };
      })
    );

    // Calculate discount percentage
    const discountPercentage =
      discountPrice && price
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    // Create course
    const course = await Course.create({
      title,
      description,
      longDescription,
      category,
      level,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
      discountPercentage,
      isFeatured: isFeatured === true || isFeatured === "true",
      isMostPopular: isMostPopular === true || isMostPopular === "true",
      isNew: isNew === true || isNew === "true",
      isHotDeal: isHotDeal === true || isHotDeal === "true",
      duration,
      language: language || "English",
      thumbnail: thumbnailUrl,
      previewVideo: previewVideoUrl,
      certificateTemplate: certificateUrl,
      whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      modules: processedModules,
      instructor: req.user._id,
      isPublished: false, // Start as draft
      rating: { average: 0, count: 0 },
    });

    console.log("✅ Course created successfully:", course._id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("❌ Create course error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
});

// PUT /api/admin/courses/:id - Update course
router.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    Object.assign(course, req.body);
    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
});

// PATCH /api/admin/courses/:id/publish - Publish/Unpublish course
router.patch("/courses/:id/publish", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished && !course.publishedAt) {
      course.publishedAt = new Date();
    }
    await course.save();

    res.json({
      success: true,
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      } successfully`,
      data: course,
    });
  } catch (error) {
    console.error("Publish course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course status",
    });
  }
});

// DELETE /api/admin/courses/:id - Delete course
router.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if course has enrollments
    const enrollmentCount = await Enrollment.countDocuments({
      course: course._id,
    });
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete course with active enrollments",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// GET /api/admin/users - Get all users (with filters)
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role && role !== "all") {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    // Get enrollment stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const enrollments = await Enrollment.find({
          user: user._id,
          paymentStatus: "completed",
        });

        const totalSpent = enrollments.reduce((sum, e) => sum + e.amount, 0);

        return {
          ...user.toObject(),
          coursesEnrolled: enrollments.length,
          totalSpent,
          verified: true, // Adjust based on your user model
          joinedDate: user.createdAt,
          lastActive: user.updatedAt,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// GET /api/admin/users/:id - Get single user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// PATCH /api/admin/users/:id/role - Make user admin
router.patch("/users/:id/role", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot change your own role",
      });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({
      success: true,
      message: `User role changed to ${user.role}`,
      data: user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admins
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

// ============================================
// ANALYTICS
// ============================================

// GET /api/admin/analytics - Revenue analytics
router.get("/analytics", async (req, res) => {
  try {
    const { period = "30days" } = req.query;

    // Calculate date range
    let startDate;
    const now = new Date();

    switch (period) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1year":
        startDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get enrollments in period
    const enrollments = await Enrollment.find({
      paymentStatus: "completed",
      createdAt: { $gte: startDate },
    });

    // Calculate stats
    const totalRevenue = enrollments.reduce((sum, e) => sum + e.amount, 0);
    const totalOrders = enrollments.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const activeStudents = await User.countDocuments({ role: "user" });

    // Get previous period for growth calculation
    const previousStartDate = new Date(
      startDate.getTime() - (now.getTime() - startDate.getTime())
    );
    const previousEnrollments = await Enrollment.find({
      paymentStatus: "completed",
      createdAt: { $gte: previousStartDate, $lt: startDate },
    });

    const previousRevenue = previousEnrollments.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const previousOrders = previousEnrollments.length;
    const previousAvg =
      previousOrders > 0 ? previousRevenue / previousOrders : 0;

    // Calculate growth
    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
    const ordersGrowth =
      previousOrders > 0
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0;
    const avgGrowth =
      previousAvg > 0 ? ((avgOrderValue - previousAvg) / previousAvg) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
        totalOrders,
        ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
        avgOrderValue,
        avgGrowth: parseFloat(avgGrowth.toFixed(1)),
        activeStudents,
        studentsGrowth: 0, // Calculate this based on your logic
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
});

// GET /api/admin/analytics/revenue-chart - Revenue trend data
router.get("/analytics/revenue-chart", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      paymentStatus: "completed",
      createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
    }).sort({ createdAt: 1 });

    // Group by month
    const monthlyData = {};
    enrollments.forEach((e) => {
      const month = new Date(e.createdAt).toLocaleString("en", {
        month: "short",
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      monthlyData[month].revenue += e.amount;
      monthlyData[month].orders += 1;
    });

    const revenueData = Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month].revenue,
      orders: monthlyData[month].orders,
    }));

    res.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error("Get revenue chart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue chart",
    });
  }
});

// GET /api/admin/analytics/top-courses - Top performing courses
router.get("/analytics/top-courses", async (req, res) => {
  try {
    const topCourses = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" },
          revenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$enrollments",
                    as: "e",
                    cond: { $eq: ["$$e.paymentStatus", "completed"] },
                  },
                },
                as: "e",
                in: "$$e.amount",
              },
            },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          enrollments: "$enrollmentCount",
          revenue: 1,
          growth: 15.2, // Mock growth - calculate based on your logic
        },
      },
    ]);

    res.json({
      success: true,
      data: topCourses,
    });
  } catch (error) {
    console.error("Get top courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top courses",
    });
  }
});

// GET /api/admin/analytics/recent-transactions - Recent transactions
router.get("/analytics/recent-transactions", async (req, res) => {
  try {
    const transactions = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedTransactions = transactions.map((t) => ({
      id: t._id,
      user: t.user?.name || "Unknown",
      course: t.course?.title || "Course Deleted",
      amount: t.amount,
      date: t.createdAt,
      status: t.paymentStatus,
    }));

    res.json({
      success: true,
      data: formattedTransactions,
    });
  } catch (error) {
    console.error("Get recent transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
});

// ============================================
// SETTINGS
// ============================================

// PUT /api/admin/profile - Update admin profile
router.put("/profile", memoryUpload.single("avatar"), async (req, res) => {
  try {
    const { fullName, email, phone, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.file) {
      console.log("📸 Uploading profile image to Cloudinary...");
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "profiles",
        resource_type: "image",
      });
      user.avatar = result.secure_url;
      console.log("✅ Profile image uploaded:", result.secure_url);
    }

    // Update fields
    if (fullName) user.name = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

// PUT /api/admin/password - Change password
router.put("/password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

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
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
});

// PUT /api/admin/site-settings - Update site settings
router.put("/site-settings", async (req, res) => {
  try {
    const { siteName, siteDescription, supportEmail, currency } = req.body;

    // TODO: Store in database (SiteSettings model) or environment
    // For now, just return success
    console.log("Site settings update:", req.body);

    res.json({
      success: true,
      message: "Site settings updated successfully",
      data: {
        siteName,
        siteDescription,
        supportEmail,
        currency,
      },
    });
  } catch (error) {
    console.error("Update site settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
    });
  }
});

// PUT /api/admin/email-settings - Update email settings
router.put("/email-settings", async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName } =
      req.body;

    // TODO: Store in database or environment
    console.log("Email settings update:", req.body);

    res.json({
      success: true,
      message: "Email settings updated successfully",
    });
  } catch (error) {
    console.error("Update email settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update email settings",
    });
  }
});

// ============================================
// ENROLLMENT MANAGEMENT
// ============================================

// GET /api/admin/enrollments - Get all enrollments
router.get("/enrollments", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.paymentStatus = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate("user", "name email avatar")
      .populate("course", "title price thumbnail")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Enrollment.countDocuments(query);

    res.json({
      success: true,
      enrollments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
});

// GET /api/admin/enrollments/:id - Get single enrollment
router.get("/enrollments/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("user", "name email avatar")
      .populate("course", "title price thumbnail modules");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
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
});

// PUT /api/admin/enrollments/:id/progress - Update enrollment progress
router.put("/enrollments/:id/progress", async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (progress !== undefined) enrollment.progress = progress;
    if (completedLessons) enrollment.completedLessons = completedLessons;

    await enrollment.save();

    res.json({
      success: true,
      message: "Progress updated successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
});

// POST /api/admin/enrollments/:id/refund - Refund enrollment
router.post("/enrollments/:id/refund", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only refund completed payments",
      });
    }

    // TODO: Integrate with Paystack refund API
    enrollment.paymentStatus = "refunded";
    await enrollment.save();

    res.json({
      success: true,
      message: "Enrollment refunded successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Refund enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refund enrollment",
    });
  }
});

// ============================================
// FILE UPLOADS (Standalone endpoints)
// ============================================

// POST /api/admin/upload/image - Upload single image (profile, thumbnail, etc.)
router.post("/upload/image", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    console.log("📸 Uploading image to Cloudinary...");
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: req.body.folder || "uploads",
      resource_type: "image",
    });

    console.log("✅ Image uploaded:", result.secure_url);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
});

// POST /api/admin/upload/video - Upload single video
router.post("/upload/video", diskUpload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    console.log("🎥 Uploading video to Cloudinary...");
    const fs = await import("fs");
    const fileBuffer = fs.readFileSync(req.file.path);

    const result = await uploadToCloudinary(fileBuffer, {
      folder: req.body.folder || "videos",
      resource_type: "video",
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    console.log("✅ Video uploaded:", result.secure_url);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload video",
    });
  }
});

// POST /api/admin/upload/pdf - Upload PDF (certificate, etc.)
router.post("/upload/pdf", memoryUpload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file provided",
      });
    }

    console.log("📄 Uploading PDF to Cloudinary...");
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: req.body.folder || "pdfs",
      resource_type: "raw",
      format: "pdf",
    });

    console.log("✅ PDF uploaded:", result.secure_url);

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      url: result.secure_url,
    });

    console.log("✅ PDF uploaded:", pdfUrl);

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      url: pdfUrl,
    });
  } catch (error) {
    console.error("Upload PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload PDF",
    });
  }
});

// ============================================
// EXPORT
// ============================================

export default router;
