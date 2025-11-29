// ============================================
// FILE: backend/models/Course.js - UPDATED
// ============================================
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, "Video URL is required"],
  },
  duration: {
    type: String, // e.g., "15:30" (15 minutes 30 seconds)
    required: [true, "Duration is required"],
  },
  order: {
    type: Number,
    required: true,
  },
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ["pdf", "doc", "link", "other"],
      },
    },
  ],
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Module title is required"],
    trim: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    longDescription: {
      type: String,
      required: [true, "Long description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Artificial Intelligence",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Cybersecurity",
        "Digital Marketing",
        "UI/UX Design",
        "Blockchain",
        "Cloud Computing",
        "Career Development",
        "Product Design",
        "Business",
        "Other",
      ],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isMostPopular: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    isHotDeal: {
      type: Boolean,
      default: false,
    },

    certificateTemplate: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    thumbnailPublicId: {
      type: String, // Cloudinary public ID for deletion
    },
    previewVideo: {
      type: String, // Cloudinary video URL
    },
    previewVideoPublicId: {
      type: String, // Cloudinary public ID
    },
    certificateTemplate: {
      type: String, // Cloudinary URL
    },
    certificatePublicId: {
      type: String,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    modules: [moduleSchema],
    whatYouWillLearn: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    language: {
      type: String,
      default: "English",
    },
    duration: {
      type: String, // e.g., "6 weeks", "3 months"
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // ✅ Calculate discount percentage if discount price is set
  if (this.isModified("discountPrice") || this.isModified("price")) {
    if (this.discountPrice > 0 && this.discountPrice < this.price) {
      this.isDiscounted = true;
      this.discountPercentage = Math.round(
        ((this.price - this.discountPrice) / this.price) * 100
      );
    } else {
      this.isDiscounted = false;
      this.discountPercentage = 0;
    }
  }

  next();
});

// Populate instructor details when querying
courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "name email avatar",
  });
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
