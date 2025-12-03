// ============================================
// FILE: src/components/home/HeroSection.jsx - WITH REAL STATS
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCountUp } from '../../hooks/useCountUp';
import api from '../../services/api';

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/public/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hero stats:', error);
        // Fallback values
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

  // ✅ Animated counters (only animate when stats are loaded)
  const studentsCount = useCountUp(stats?.students || 0, 2500);
  const coursesCount = useCountUp(stats?.courses || 0, 2500);
  const successRateCount = useCountUp(stats?.successRate || 95, 2500);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Background Image with Better Visibility */}
      <div className="absolute inset-0">
        <img 
          src="/images/her.jpg" 
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Lighter overlay for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/60 to-background/40"></div>
      </div>

      {/* Animated blobs - more subtle */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-100/90 dark:bg-primary-900/40 px-4 py-2 rounded-full backdrop-blur-sm border border-primary-200 dark:border-primary-800 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Empowering Young Africans Since 2019
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight drop-shadow-sm">
                Accelerate with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  TechAge
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl drop-shadow-sm">
                Empowering Africa's future through digital skills, brand
                visibility, and tech-driven opportunities. Learn, grow, and
                thrive in the digital economy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-200">
              <Button
                size="lg"
                className="text-base group shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base group backdrop-blur-sm bg-background/50 hover:bg-background/70 shadow-md"
                onClick={() => navigate("/about")}
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust Indicators - WITH REAL STATS */}
            <div className="flex items-center space-x-8 pt-4 animate-slide-up animation-delay-400">
              <div className="backdrop-blur-sm bg-background/30 px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : `${studentsCount}+`}
                </p>
                <p className="text-sm text-muted-foreground">Students Trained</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="backdrop-blur-sm bg-background/30 px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : `${coursesCount}+`}
                </p>
                <p className="text-sm text-muted-foreground">Expert Courses</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="backdrop-blur-sm bg-background/30 px-3 py-2 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? '...' : `${successRateCount}%`}
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Floating Cards */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Active Learners Card - Top Right */}
            <div className="absolute top-25 right-5 bg-card/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border-2 border-accent-200 dark:border-accent-800 animate-float">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🎓</span>
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">Active Learners</p>
                  <p className="text-sm text-muted-foreground">
                    {loading ? '...' : `${studentsCount}+ enrolled`}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Card - Bottom Left */}
            <div className="absolute bottom-80 right-50 bg-card/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border-2 border-primary-200 dark:border-primary-800 animate-float animation-delay-1000">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">⭐</span>
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">4.9/5 Rating</p>
                  <p className="text-sm text-muted-foreground">From our students</p>
                </div>
              </div>
            </div>

            {/* Certificate Badge - Middle Right */}
            <div className="absolute top-60 right-0 transform -translate-y-1/2 bg-card/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border-2 border-secondary-200 dark:border-secondary-800 animate-float animation-delay-500">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">Get Certified</p>
                  <p className="text-sm text-muted-foreground">Download on completion</p>
                </div>
              </div>
            </div>

            {/* Decorative glow effects */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-secondary-400 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>

      <style>{`
        /* Blob animation */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }

        /* Floating cards animation */
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

        /* Fade in animation */
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Slide up animation */
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

        /* Pulse animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        /* Animation delays */
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
