// ============================================
// FILE: src/pages/ForgotPassword.jsx
// ============================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import authService from "../services/authService";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      setSubmittedEmail(data.email);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            {emailSent ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="text-muted-foreground">
            {emailSent
              ? "We sent you a password reset link"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        {/* Card */}
        <Card className="border-2">
          <CardContent className="p-8">
            {!emailSent ? (
              // Email Form
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className={`pl-10 ${
                        errors.email ? "border-danger-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-danger-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter the email address associated with your account
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Reset Link
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
                  <p className="text-muted-foreground">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold text-foreground">
                    {submittedEmail}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
                  <p>Didn't receive the email?</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Check your spam folder</li>
                    <li>Verify your email address is correct</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Try Another Email
                </Button>
              </div>
            )}

            {/* Back to Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
            </div>

            <Link to="/login">
              <Button variant="ghost" size="lg" className="w-full">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Login
              </Button>
            </Link>
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

export default ForgotPassword;
