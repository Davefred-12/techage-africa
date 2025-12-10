// ============================================
// FILE: backend/models/User.js
// ============================================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        // Password is only required if no OAuth provider
        return !this.provider || this.provider === "local";
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "", // User profile image URL (from Cloudinary)
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Add these fields before timestamps
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    provider: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },
    providerId: {
      type: String, // OAuth user ID from Google/Apple
      default: "",
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
        },
        completedLessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
          },
        ],
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
    // Referral and Points System
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but ensures uniqueness when present
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    points: {
      type: Number,
      default: 0,
    },
    referrals: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      earnedAt: {
        type: Date,
        default: Date.now,
      },
      pointsEarned: {
        type: Number,
        default: 500,
      },
    }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Generate unique referral code before saving
userSchema.pre("save", async function (next) {
  // Generate referral code if not exists
  if (!this.referralCode) {
    let code;
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 8-character code
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const existingUser = await mongoose.models.User.findOne({ referralCode: code });
      if (!existingUser) {
        isUnique = true;
      }
    }

    this.referralCode = code;
  }

  // Only hash password if it's modified and provider is local
  if (!this.isModified("password") || this.provider !== "local") {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Hash token and save to database
  this.resetPasswordToken = bcrypt.hashSync(resetToken, 10);

  // Set expire time (1 hour)
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
