// ============================================
// FILE: backend/models/Enrollment.js
// ============================================
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
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
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'paystack',
    },
    paystackReference: {
      type: String,
      required: [true, 'Payment reference is required'],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    paidAt: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateIssuedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure user can't enroll in same course twice
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Populate user and course details when querying
enrollmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email avatar',
  }).populate({
    path: 'course',
    select: 'title thumbnail price category level duration',
  });
  next();
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;