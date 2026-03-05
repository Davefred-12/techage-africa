// ============================================
// FILE: src/pages/Register.jsx - NEW JOBLADDA SPLIT DESIGN
// ============================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from '../services/api';

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        name: data.fullName,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode,
      });
      if (response.data.success) {
        setUserEmail(data.email);
        setShowOTPModal(true);
        toast.success("Check your email for verification code!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setVerifyingOTP(true);
    try {
      const response = await api.post('/api/auth/verify-otp', { email: userEmail, otp });
      if (response.data.success) {
        toast.success("Verified successfully! 🎉");
        setShowOTPModal(false);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyingOTP(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Dark Navy Info Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full stroke-gray-500" aria-hidden="true">
            <defs>
              <pattern id="grid-reg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-reg)" />
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
               Stop Applying Randomly. <br />
              <span className="text-secondary-500 text-6xl">Start Getting Hired.</span>
            </h1>
            
            <ul className="space-y-5">
              {["Uncover your hidden skill gaps", "Get an ATS-optimized profile", "Access sure job opening updates", "Land interviews in 14 days"].map((item, i) => (
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

        <div className="relative z-10 text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} JobLadda. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden bg-gray-50 lg:bg-white pt-24 lg:pt-12">
        <div className="lg:hidden absolute top-8 left-8">
            <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-500 flex items-center justify-center">
                    <span className="text-white font-black text-lg">J</span>
                </div>
                <span className="font-black text-xl tracking-tight text-[#111827]">JobLadda</span>
            </Link>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-black text-[#111827]">Create Account</h2>
            <p className="text-gray-500 font-medium text-lg">Join thousands of job seekers today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input {...register("fullName")} placeholder="John Doe" className="pl-12 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-medium" />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs font-bold ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input {...register("email")} placeholder="name@company.com" className="pl-12 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-medium" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm</label>
                        <div className="relative">
                            <Input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white transition-all" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                    </div>
                </div>
                {(errors.password || errors.confirmPassword) && <p className="text-red-500 text-xs font-bold ml-1">{errors.password?.message || errors.confirmPassword?.message}</p>}
                
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Referral (Optional)</label>
                    <Input {...register("referralCode")} placeholder="Code" className="h-14 rounded-2xl border-2 border-gray-100 bg-gray-50/50" />
                </div>
            </div>

            <div className="flex items-start gap-3 p-2">
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-200 text-secondary-500" />
                <label htmlFor="terms" className="text-sm text-gray-500 font-medium">
                    I agree to the <Link to="/terms" className="text-secondary-500 font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-secondary-500 font-bold hover:underline">Privacy Policy</Link>
                </label>
            </div>

            <Button type="submit" disabled={isLoading || !agreedToTerms} className="w-full h-16 bg-[#111827] hover:bg-black text-white rounded-2xl text-xl font-black transition-all shadow-xl group">
              {isLoading ? "Creating..." : "Create Account"}
              {!isLoading && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <p className="text-center text-gray-500 font-medium text-lg">
            Already have an account? <Link to="/login" className="text-secondary-500 font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#111827]">Verify Email</h3>
              <p className="text-gray-500">Enter the 6-digit code sent to<br/><span className="font-bold text-gray-900">{userEmail}</span></p>
            </div>
            <Input value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))} placeholder="000000" className="text-center text-3xl font-black tracking-widest h-20 rounded-2xl border-2 focus:border-[#111827]" />
            <Button onClick={handleVerifyOTP} disabled={verifyingOTP || otp.length !== 6} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl">
              {verifyingOTP ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;