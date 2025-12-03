// ============================================
// FILE: backend/controllers/statsController.js - FIXED
// ============================================
import User from '../models/User.js';
import Course from '../models/course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get public platform statistics
// @route   GET /api/public/stats
// @access  Public
export const getPlatformStats = async (req, res) => {
  try {
    console.log('📊 Fetching platform statistics');

    // ✅ Count total users (students only, exclude admins)
    // Remove isEmailVerified filter to count all registered users
    const totalStudents = await User.countDocuments({ 
      role: 'user'
    });

    console.log('👥 Total students found:', totalStudents);

    // ✅ Count total published courses
    const totalCourses = await Course.countDocuments({ 
      isPublished: true 
    });

    console.log('📚 Total courses found:', totalCourses);

    // ✅ Count total enrollments with completed payment
    const totalEnrollments = await Enrollment.countDocuments({ 
      paymentStatus: 'completed' 
    });

    // ✅ FIXED: Success rate is now static at 95%
    const successRate = 95;

    // ✅ Job placements - Fixed value
    const jobPlacements = 500;

    // ✅ Additional useful stats
    const totalCertificates = await Enrollment.countDocuments({ 
      certificateIssued: true 
    });

    const stats = {
      students: totalStudents,
      courses: totalCourses,
      successRate: successRate, // ✅ Fixed at 95%
      jobPlacements: jobPlacements, // ✅ Fixed at 500
      enrollments: totalEnrollments,
      certificates: totalCertificates,
    };

    console.log('✅ Platform stats calculated:', stats);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Get platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics',
    });
  }
};