// ============================================
// FILE: src/components/home/Stats.jsx - FIXED SUCCESS RATE
// ============================================
import { useState, useEffect } from 'react';
import { Users, BookOpen, Award, TrendingUp, Loader2 } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import api from '../../services/api';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch real stats from backend (only once)
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const response = await api.get('/api/public/stats');
        if (response.data.success && isMounted) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback values
        if (isMounted) {
          setStats({
            students: 2000,
            courses: 12,
            successRate: 95,
            jobPlacements: 500,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Animated counters
  const studentsCount = useCountUp(stats?.students || 0, 2500);
  const coursesCount = useCountUp(stats?.courses || 0, 2500);
  const successRateCount = useCountUp(95, 2500); // ✅ Always count to 95%
  const jobPlacementsCount = useCountUp(500, 2500); // ✅ Always count to 500+

  const statsDisplay = [
    {
      icon: Users,
      value: loading ? '...' : `${studentsCount}+`,
      label: 'Students Trained',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: BookOpen,
      value: loading ? '...' : `${coursesCount}+`,
      label: 'Expert Courses',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/30',
    },
    {
      icon: Award,
      value: loading ? '...' : `${successRateCount}%`, // ✅ Fixed at 95%
      label: 'Success Rate',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100 dark:bg-accent-900/30',
    },
    {
      icon: TrendingUp,
      value: loading ? '...' : `${jobPlacementsCount}+`, // ✅ Fixed at 500+
      label: 'Job Placements',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {statsDisplay.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-3 p-4 md:p-6 rounded-xl bg-card border hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full ${stat.bgColor} flex items-center justify-center`}>
                {loading ? (
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-muted-foreground" />
                ) : (
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                )}
              </div>
              <div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Stats;