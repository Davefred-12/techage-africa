// ============================================
// FILE: backend/models/Review.js - NEW
// ============================================
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews (one review per user per course)
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

// Populate user details when querying
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;