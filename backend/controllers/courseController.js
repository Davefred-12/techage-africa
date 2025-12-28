// ============================================
// FILE: backend/controllers/courseController.js - FIXED
// ============================================
import mongoose from 'mongoose';
import Course from '../models/course.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email avatar') // ✅ Populate instructor
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    let course;
    
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      // Search by MongoDB ID
      course = await Course.findById(req.params.id)
        .populate('instructor', 'name email avatar bio'); // ✅ Added bio field
    } else {
      // Search by slug
      course = await Course.findOne({ slug: req.params.id })
        .populate('instructor', 'name email avatar bio'); // ✅ Added bio field
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // ✅ ADD LOGGING TO DEBUG
    console.log('📚 Course found:', course.title);
    console.log('👨‍🏫 Instructor data:', course.instructor);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Admin only)
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
    });
  }
};