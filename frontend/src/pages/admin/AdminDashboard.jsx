// ============================================
// FILE: src/pages/admin/AdminDashboard.jsx - REAL API
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { useAuth } from '../../context/authContext';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ✅ State for real data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  // ✅ Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data in parallel
      const [statsRes, enrollmentsRes, coursesRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/recent-enrollments'),
        api.get('/api/admin/popular-courses')
      ]);

      setStats(statsRes.data.data);
      setRecentEnrollments(enrollmentsRes.data.data);
      setPopularCourses(coursesRes.data.data);
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
    }).format(amount);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  // ✅ Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div>
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <Skeleton className="h-5 w-16 mb-1" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <Skeleton className="h-5 w-full flex-1" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Skeleton */}
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // ✅ Stats cards data (from API)
  const statsCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      change: '+12.5%',
      changeType: 'increase',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: stats?.totalCourses || '0',
      change: `${stats?.activeCourses || 0} active`,
      changeType: 'increase',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/30',
    },
    {
      icon: ShoppingBag,
      label: 'Total Enrollments',
      value: stats?.totalEnrollments?.toLocaleString() || '0',
      change: `${stats?.recentEnrollments || 0} this week`,
      changeType: 'increase',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100 dark:bg-accent-900/30',
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+15.3%',
      changeType: 'increase',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening with TechAge Africa today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.changeType === 'increase' ? 'default' : 'secondary'} className="gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Enrollments */}
          <Card className="lg:col-span-2 animate-fade-in-up animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Recent Enrollments
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/courses')}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {recentEnrollments.slice(0, 4).map((enrollment, index) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-left"
                      style={{ animationDelay: `${index * 100 + 500}ms` }}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 ring-2 ring-primary-200">
                          <AvatarImage src={enrollment.user?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                            {getInitials(enrollment.user?.name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{enrollment.user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{enrollment.course}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(enrollment.date)}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-bold text-primary-600">
                          {formatCurrency(enrollment.amount)}
                        </p>
                        <Badge className="bg-accent-600 text-xs mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent enrollments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Courses */}
          <Card className="animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {popularCourses.length > 0 ? (
                <div className="space-y-4">
                  {popularCourses.map((course, index) => (
                    <div
                      key={course._id}
                      className="p-4 rounded-lg border hover:border-primary-300 hover:shadow-md transition-all animate-fade-in-up"
                      style={{ animationDelay: `${index * 100 + 700}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                          {course.name}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Enrollments</span>
                          <span className="font-semibold">{course.enrollments}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-semibold text-primary-600">
                            {formatCurrency(course.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No course data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-2 animate-fade-in-up animation-delay-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Actions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage your platform efficiently
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/admin/upload')}>
                  Upload New Course
                </Button>
                <Button onClick={() => navigate('/admin/blog')}>
                  Manage Blog
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/users')}>
                  Manage Users
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/revenue')}>
                  View Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
        }

        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;