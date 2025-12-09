// ============================================
// FILE: src/pages/ResetPassword.jsx
// ============================================
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import authService from "../services/authService";

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get reset token from URL

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await authService.resetPassword(token, data.password);
      setResetSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if token exists
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20">
        <div className="w-full max-w-md text-center">
          <Card className="border-2">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
                <Lock className="w-8 h-8 text-danger-600" />
              </div>
              <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
              <p className="text-muted-foreground">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate("/forgot-password")}
              >
                Request New Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {resetSuccess ? "Password Reset!" : "Reset Your Password"}
          </h1>
          <p className="text-muted-foreground">
            {resetSuccess
              ? "Your password has been successfully reset"
              : "Enter your new password below"}
          </p>
        </div>

        {/* Card */}
        <Card className="border-2">
          <CardContent className="p-8">
            {!resetSuccess ? (
              // Reset Form
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className={`pl-10 pr-10 ${
                        errors.password ? "border-danger-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      className={`pl-10 pr-10 ${
                        errors.confirmPassword ? "border-danger-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                  <p className="font-medium">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>At least 8 characters</li>
                    <li>
                      Mix of uppercase and lowercase letters (recommended)
                    </li>
                    <li>At least one number (recommended)</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    "Resetting Password..."
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // Success Message
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-accent-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    Password Reset Successfully!
                  </h3>
                  <p className="text-muted-foreground">
                    Your password has been changed. You can now login with your
                    new password.
                  </p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
