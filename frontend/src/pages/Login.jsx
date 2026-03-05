// ============================================
// FILE: src/pages/Login.jsx - NEW JOBLADDA SPLIT DESIGN
// ============================================
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/authContext";
import WelcomeModal from '../components/modals/WelcomeModal';
import ContinueLearningModal from '../components/modals/ContinueLearningModal';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [lastCourse, setLastCourse] = useState(null);
  
  const from = location.state?.from || "/user";

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
      const response = await login(data);
      if (response.isFirstLogin) {
        toast.success(`Welcome to JobLadda, ${response.user.name}! 🎉`);
        setShowWelcomeModal(true);
      } else if (response.lastAccessedCourse) {
        toast.success(`Welcome back, ${response.user.name}! 👋`);
        setLastCourse(response.lastAccessedCourse);
        setShowContinueModal(true);
      } else {
        toast.success(`Welcome back, ${response.user.name}! 👋`);
        setTimeout(() => navigate(from, { replace: true }), 1000);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  const checklist = [
    "Take the Job Readiness Test",
    "See your score and major gaps",
    "Upgrade to the full report",
    "Follow our structured plan",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Dark Navy Info Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] relative overflow-hidden flex-col justify-between p-16">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full stroke-gray-500" aria-hidden="true">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 mb-16 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-500 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-2xl">J</span>
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-white">
              Job<span className="text-secondary-500">Ladda</span>
            </span>
          </Link>

          <div className="space-y-8 max-w-lg">
            <h1 className="text-5xl font-heading font-black text-white leading-tight">
              Discover why you’re <br />
              <span className="text-secondary-500 text-6xl">not getting hired.</span>
            </h1>
            
            <ul className="space-y-5">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300 text-lg font-medium">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Floating abstract representation */}
        <div className="relative z-10 mt-12">
            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-3xl backdrop-blur-sm max-w-sm ml-auto rotate-3 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="h-2 w-32 bg-gray-700 rounded-full"></div>
                </div>
                <div className="space-y-3">
                    <div className="h-2 w-full bg-gray-700/50 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-gray-700/50 rounded-full"></div>
                    <div className="h-2 w-4/6 bg-orange-500/30 rounded-full"></div>
                </div>
            </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} JobLadda. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-gray-50 lg:bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
            <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-500 flex items-center justify-center">
                <span className="text-white font-black text-lg">J</span>
                </div>
                <span className="font-black text-xl tracking-tight text-[#111827]">JobLadda</span>
            </Link>
        </div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-heading font-black text-[#111827]">Sign In</h2>
            <p className="text-gray-500 font-medium text-lg">
                Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register("email")}
                  placeholder="name@company.com"
                  className="pl-12 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-medium"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm font-medium ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" size="sm" className="text-secondary-500 font-bold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm font-medium ml-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-[#111827] hover:bg-black text-white rounded-2xl text-xl font-black transition-all group shadow-xl"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-500 font-medium text-lg">
                Don’t have an account?{" "}
                <Link to="/register" className="text-secondary-500 font-black hover:underline">
                    Create free account
                </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => { setShowWelcomeModal(false); navigate(from); }} />
      {lastCourse && <ContinueLearningModal isOpen={showContinueModal} onClose={() => { setShowContinueModal(false); navigate(from); }} course={lastCourse} />}
    </div>
  );
};

export default Login;