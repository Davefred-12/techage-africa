// ============================================
// FILE: src/pages/Login.jsx
// ============================================
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import api from '../services/api';
import { useCountUp } from '../hooks/useCountUp';

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // ✅ Get from context
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  // Get the page user was trying to access before login
  const from = location.state?.from || "/user"; // Default to dashboard for logged-in users

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/public/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback values
        setStats({
          students: 2000,
          courses: 12,
          successRate: 95,
          jobPlacements: 500,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await login(data); // ✅ Use AuthContext

      // ✅ SUCCESS: Toast + Redirect to Home
      toast.success(`Welcome back, ${response.user.name}! 👋`);

      setTimeout(() => {
        navigate(from); // ✅ Go to home page
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage); // ✅ Toast instead of alert
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    // TODO: Redirect to backend Google OAuth route
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/auth/google`;
  };

  const handleAppleLogin = () => {
    // TODO: Redirect to backend Apple OAuth route
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/auth/apple`;
  };

  const features = [
    { icon: CheckCircle, text: "Access to 12+ expert courses" },
    { icon: CheckCircle, text: "Learn at your own pace" },
    { icon: CheckCircle, text: "Downloadable certificates" },
    { icon: CheckCircle, text: "Join 2000+ successful learners" },
  ];

  // Animated counters
  const studentsCount = useCountUp(stats?.students || 0, 2500);
  const coursesCount = useCountUp(stats?.courses || 0, 2500);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image/Brand Section with Full Background */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/reg.jpg"
            alt="Learning"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-primary-800/65 to-secondary-900/90"></div>
        </div>

        {/* Animated background blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-lg space-y-8 text-white">
          {/* Heading */}
          <div className="space-y-4 animate-slide-up animation-delay-200">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Welcome Back to Your Learning Journey
            </h1>
            <p className="text-lg text-white/90">
              Continue building your digital skills and unlock new opportunities
              in Africa's growing tech ecosystem.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 animate-fade-in-left"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4 animate-fade-in-up animation-delay-800">
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-3">
              <p className="text-3xl font-bold">{statsLoading ? '...' : `${studentsCount}+`}</p>
              <p className="text-sm text-white/80 mt-1">Students</p>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-3">
              <p className="text-3xl font-bold">{statsLoading ? '...' : `${coursesCount}+`}</p>
              <p className="text-sm text-white/80 mt-1">Courses</p>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/10 rounded-lg p-3">
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-white/80 mt-1">Success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center animate-fade-in">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <span className="font-heading font-bold text-2xl">
                TechAge Africa
              </span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold">
              Login
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form Card */}
          <Card className="border-2 shadow-xl animate-scale-in animation-delay-200">
            <CardContent className="p-8">
              {/* Email/Password Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Social Login Buttons */}
                <div className="flex gap-3 mb-6">
                  {/* Google Login */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 hover:bg-accent transition-colors"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      Google
                    </span>
                    <span className="sm:hidden">Google</span>
                  </Button>

                  {/* Apple Login */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 hover:bg-accent transition-colors"
                    onClick={handleAppleLogin}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span className="hidden sm:inline">
                      Apple
                    </span>
                    <span className="sm:hidden">Apple</span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      Or continue with Email
                    </span>
                  </div>
                </div>
                {/* Email */}
                <div className="animate-slide-up animation-delay-300">
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="john@example.com"
                      className={`pl-10 transition-all ${
                        errors.email ? "border-danger-500 shake" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-danger-600 mt-1 animate-fade-in">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="animate-slide-up animation-delay-400">
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 transition-all ${
                        errors.password ? "border-danger-500 shake" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-danger-600 mt-1 animate-fade-in">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between animate-fade-in-up animation-delay-500">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full animate-slide-up animation-delay-600 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Logging in...
                    </span>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Register Link */}
          <div className="text-center space-y-4 animate-fade-in-up animation-delay-700">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
              onClick={() => navigate("/register")}
            >
              Create an Account
            </Button>
          </div>

          {/* Back to Home */}
          <div className="text-center animate-fade-in-up animation-delay-800">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">
                ←
              </span>
              <span className="ml-1">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 10px) scale(1.05); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .shake {
          animation: shake 0.3s ease-in-out;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Login;
