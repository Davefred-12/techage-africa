// ============================================
// FILE: backend/models/Blog.js
// ============================================
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxLength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      // REMOVED: required field - we'll generate it automatically
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxLength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
      enum: [
        'Technology',
        'Education',
        'Career Development',
        'Industry Insights',
        'Success Stories',
        'Tips & Tricks',
        'Announcements',
        'Tutorials',
      ],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog author is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    seoTitle: {
      type: String,
      maxLength: [60, 'SEO title cannot exceed 60 characters'],
    },
    seoDescription: {
      type: String,
      maxLength: [160, 'SEO description cannot exceed 160 characters'],
    },
    seoKeywords: [{
      type: String,
      trim: true,
    }],
    readingTime: {
      type: Number, // in minutes
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isApproved: {
        type: Boolean,
        default: true,
      },
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    relatedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ slug: 1 });

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Pre-save middleware to generate slug and reading time
blogSchema.pre('save', async function(next) {
  // Generate slug from title if not provided or title changed
  if (this.isModified('title') || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Ensure unique slug by appending number if needed
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug exists (skip if updating the same document)
    while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Static method to get published posts
blogSchema.statics.getPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 });
};

// Static method to get featured posts
blogSchema.statics.getFeatured = function(limit = 3) {
  return this.find({ status: 'published', featured: true })
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to get posts by category
blogSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ status: 'published', category })
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;