// ============================================
// FILE: backend/controllers/blogController.js
// ============================================
import Blog from '../models/Blog.js';

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = { status: 'published' };

    // Add filters
    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Exclude full content for listing

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar') // FIXED: Populate comment users
      .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    // Get related posts if not already set
    if (!blog.relatedPosts || blog.relatedPosts.length === 0) {
      const relatedPosts = await Blog.find({
        _id: { $ne: blog._id },
        status: 'published',
        $or: [
          { category: blog.category },
          { tags: { $in: blog.tags } },
        ],
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select('title slug excerpt featuredImage publishedAt');

      blog.relatedPosts = relatedPosts;
      await blog.save();
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get featured blog posts
// @route   GET /api/blog/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const blogs = await Blog.getFeatured(limit);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get blog categories with counts
// @route   GET /api/blog/categories
// @access  Public
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get blog tags with counts
// @route   GET /api/blog/tags
// @access  Public
export const getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Get blog tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Like/Unlike a blog post
// @route   POST /api/blog/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const userId = req.user.id;
    const existingLike = blog.likes.find(like => like.user.toString() === userId);

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(like => like.user.toString() !== userId);
    } else {
      // Like
      blog.likes.push({ user: userId });
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        likesCount: blog.likes.length,
        isLiked: !existingLike,
      },
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    blog.comments.push({
      user: req.user.id,
      content: content.trim(),
    });

    await blog.save();
    
    // FIXED: Populate the user data for the newly added comment
    await blog.populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      data: blog.comments[blog.comments.length - 1],
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get blog statistics (for admin)
// @route   GET /api/blog/stats
// @access  Private/Admin
export const getBlogStats = async (req, res) => {
  try {
    const totalPosts = await Blog.countDocuments();
    const publishedPosts = await Blog.countDocuments({ status: 'published' });
    const draftPosts = await Blog.countDocuments({ status: 'draft' });
    const featuredPosts = await Blog.countDocuments({ featured: true, status: 'published' });

    const totalViews = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const totalLikes = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } },
    ]);

    const categoryStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get all blog posts for admin (including drafts)
// @route   GET /api/admin/blog
// @access  Private/Admin
export const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // 'all', 'published', 'draft', 'archived'
    const search = req.query.search;

    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/admin/blog
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords,
      featured,
      status,
    } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, excerpt, content, category',
      });
    }

    // Create blog post
    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords || [],
      featured: featured || false,
      status: status || 'draft',
      author: req.user.id,
    });

    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/admin/blog/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords,
      featured,
      status,
    } = req.body;

    // Update fields
    if (title !== undefined) blog.title = title;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (tags !== undefined) blog.tags = tags;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (seoTitle !== undefined) blog.seoTitle = seoTitle;
    if (seoDescription !== undefined) blog.seoDescription = seoDescription;
    if (seoKeywords !== undefined) blog.seoKeywords = seoKeywords;
    if (featured !== undefined) blog.featured = featured;
    if (status !== undefined) blog.status = status;

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      data: blog,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/admin/blog/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// @desc    Get single blog post for admin editing
// @route   GET /api/admin/blog/:id
// @access  Private/Admin
export const getAdminBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.user', 'name avatar'); // FIXED: Also populate here for admin view

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get admin blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};