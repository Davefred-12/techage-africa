// ============================================
// FILE: src/components/home/HeroSection.jsx - SLEEK VERSION
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import api from "../../services/api";

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/public/stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch hero stats:", error);
        setStats({
          students: 2000,
          courses: 12,
          successRate: 95,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ✅ Animated counters
  const studentsCount = useCountUp(stats?.students || 0, 2500);
  const coursesCount = useCountUp(stats?.courses || 0, 2500);
  const successRateCount = useCountUp(stats?.successRate || 95, 2500);

  return (
    <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden min-h-[550px] lg:min-h-[650px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/african.jpg"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-background/40 to-background/40"></div>
      </div>

      {/* Animated blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-100/90 dark:bg-primary-900/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-primary-200 dark:border-primary-800 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                Empowering Young Africans Since 2019
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-3 animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Accelerate with{" "}
                <span className="text-primary-400">TechAge</span>
              </h1>
              <p className="text-base md:text-lg max-w-xl leading-relaxed text-black-900">
                Empowering Africa's future through digital skills, brand
                visibility, and tech-driven opportunities. Learn, grow, and
                thrive in the digital economy.
              </p>
            </div>

            {/* CTA Buttons - Compact on mobile, full width on sm+ */}
            <div className="flex flex-row gap-2 sm:gap-3 animate-slide-up animation-delay-200">
              <Button
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all flex-1 sm:flex-none sm:px-8"
                onClick={() => navigate("/courses")}
              >
                <span className="sm:hidden text-sm">Courses</span>
                <span className="hidden sm:inline">Explore Courses</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group backdrop-blur-sm bg-background/50 hover:bg-background/70 shadow-md flex-1 sm:flex-none sm:px-8"
                onClick={() => navigate("/services")}
              >
                <span className="sm:hidden text-sm">Services</span>
                <span className="hidden sm:inline">Boost Your Brand</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust Indicators - Compact */}
            <div className="flex items-center gap-6 pt-2 animate-slide-up animation-delay-400">
              <div className="backdrop-blur-sm bg-background/40 px-3 py-2 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  {loading ? "..." : `${studentsCount}+`}
                </p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="backdrop-blur-sm bg-background/40 px-3 py-2 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  {loading ? "..." : `${coursesCount}+`}
                </p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="backdrop-blur-sm bg-background/40 px-3 py-2 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  {loading ? "..." : `${successRateCount}%`}
                </p>
                <p className="text-xs text-muted-foreground">Success</p>
              </div>
            </div>
          </div>

          {/* Right Side - Floating Cards */}
          <div className="relative hidden lg:block h-[450px]">
            {/* Active Learners Card */}
            <div className="absolute top-8 right-0 bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-primary-200 dark:border-primary-800 animate-float max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Active Learners
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "..." : `${studentsCount}+`}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="absolute bottom-20 left-0 bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-secondary-200 dark:border-secondary-800 animate-float animation-delay-1000 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    4.9/5 Rating
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Student reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Badge */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-card/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-accent-200 dark:border-accent-800 animate-float animation-delay-500 max-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Get Certified
                  </p>
                  <p className="text-xs text-muted-foreground">On completion</p>
                </div>
              </div>
            </div>

            {/* Decorative glows */}
            <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-secondary-400 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
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
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
};

export default HeroSection;
