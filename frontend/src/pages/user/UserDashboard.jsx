// ============================================
// FILE: src/pages/user/UserDashboard.jsx - REAL DATA ONLY
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // ✅ Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/dashboard/stats");

        if (response.data.success) {
          console.log("📊 Dashboard data received:", response.data.data);
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, currentCourses, recentActivity } = dashboardData;

  const statsDisplay = [
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: stats.totalCourses.toString(),
      change:
        stats.inProgress > 0
          ? `${stats.inProgress} in progress`
          : "No courses yet",
      color: "text-primary-600",
      bgColor: "bg-primary-100 dark:bg-primary-900/30",
    },
    {
      icon: Clock,
      label: "Time Spent",
      value: stats.timeSpent || `${stats.totalHours}h`,
      change:
        stats.totalHours > 0 ? "Total learning time" : "Start learning now",
      color: "text-secondary-600",
      bgColor: "bg-secondary-100 dark:bg-secondary-900/30",
    },
    {
      icon: Award,
      label: "Completed Courses",
      value: stats.completed.toString(),
      change:
        stats.completed > 0
          ? `${stats.inProgress} in progress`
          : "Complete your first course",
      color: "text-accent-600",
      bgColor: "bg-accent-100 dark:bg-accent-900/30",
    },
    {
      icon: TrendingUp,
      label: "Overall Progress",
      value: `${stats.avgProgress}%`,
      change: stats.avgProgress > 0 ? "Average completion" : "Enroll to start",
      color: "text-primary-600",
      bgColor: "bg-primary-100 dark:bg-primary-900/30",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground">
            {stats.totalCourses > 0
              ? "Here's what's happening with your learning journey today."
              : "Start your learning journey by enrolling in a course!"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Courses */}
        {currentCourses && currentCourses.length > 0 && (
          <div className="animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Continue Learning</h2>
                <p className="text-muted-foreground text-sm">
                  Pick up where you left off
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/user/my-courses")}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {currentCourses.map((course, index) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group animate-fade-in-left"
                  style={{ animationDelay: `${index * 150 + 500}ms` }}
                  onClick={() => navigate(`/user/courses/${course.id}/learn`)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                      In Progress
                    </Badge>
                    <div className="absolute bottom-3 right-3">
                      <Button size="sm" className="rounded-full h-10 w-10 p-0">
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Last accessed {course.lastAccessed}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons completed
                      </p>
                    </div>

                    {/* Next Lesson */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        Next up:
                      </p>
                      <p className="text-sm font-medium">{course.nextLesson}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No courses enrolled */}
        {(!currentCourses || currentCourses.length === 0) && (
          <Card className="animate-fade-in-up animation-delay-400">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {stats.totalCourses === 0
                  ? "No courses yet"
                  : "All courses completed!"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {stats.totalCourses === 0
                  ? "Start your learning journey today!"
                  : "Browse more courses to continue learning."}
              </p>
              <Button onClick={() => navigate("/courses")}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          {recentActivity && recentActivity.length > 0 && (
            <Card className="lg:col-span-2 animate-fade-in-up animation-delay-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-left"
                      style={{ animationDelay: `${index * 100 + 800}ms` }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "completed"
                            ? "bg-accent-100 dark:bg-accent-900/30"
                            : activity.type === "enrolled"
                            ? "bg-primary-100 dark:bg-primary-900/30"
                            : "bg-secondary-100 dark:bg-secondary-900/30"
                        }`}
                      >
                        {activity.type === "completed" && (
                          <CheckCircle className="h-5 w-5 text-accent-600" />
                        )}
                        {activity.type === "enrolled" && (
                          <BookOpen className="h-5 w-5 text-primary-600" />
                        )}
                        {activity.type === "certificate" && (
                          <Award className="h-5 w-5 text-secondary-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.course}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="animate-fade-in-up animation-delay-900">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Button>
              {stats.totalCourses > 0 && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/user/progress")}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Progress
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/user/orders")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/user/settings")}
              >
                <Award className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
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
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default UserDashboard;
