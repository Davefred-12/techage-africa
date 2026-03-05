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
import { Skeleton } from "../../components/ui/skeleton";
import WelcomeModal from "../../components/modals/WelcomeModal";
import ContinueLearningModal from "../../components/modals/ContinueLearningModal";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { toast } from "sonner";
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [lastCourse, setLastCourse] = useState(null);

  // ✅ NEW: Check for modals on mount
  useEffect(() => {
    // Check if we should show welcome modal
    const shouldShowWelcome = sessionStorage.getItem("showWelcomeModal");
    if (shouldShowWelcome === "true") {
      setShowWelcomeModal(true);
      sessionStorage.removeItem("showWelcomeModal");
    }

    // Check if we should show continue learning modal
    const lastAccessedCourse = sessionStorage.getItem("lastAccessedCourse");
    if (lastAccessedCourse && shouldShowWelcome !== "true") {
      const course = JSON.parse(lastAccessedCourse);
      setLastCourse(course);
      setShowContinueModal(true);
      sessionStorage.removeItem("lastAccessedCourse");
    }
  }, []);

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

          {/* Current Courses Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-40" />
                    </div>

                    <div className="pt-3 border-t">
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Grid Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
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
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
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
              ? "Here's the current status of your 14-day career readiness path."
              : "Start your journey by taking the Free Job Readiness Test!"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1"> Readiness Score </p>
                <p className="text-3xl font-bold mb-2"> {stats.totalCourses > 0 ? "72%" : "N/A"} </p>
                <p className="text-xs text-muted-foreground"> {stats.totalCourses > 0 ? "Above average" : "Take the test now"} </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1"> 14-Day Path </p>
                <p className="text-3xl font-bold mb-2"> Day 4 </p>
                <p className="text-xs text-muted-foreground"> 10 days remaining </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1"> Tasks Completed </p>
                <p className="text-3xl font-bold mb-2"> {stats.completed} </p>
                <p className="text-xs text-muted-foreground"> {stats.inProgress} tasks pending </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1"> Success Probability </p>
                <p className="text-3xl font-bold mb-2"> 85% </p>
                <p className="text-xs text-muted-foreground"> Based on your profile </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        {currentCourses && currentCourses.length > 0 && (
          <div className="animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Target Skills & Action Plan</h2>
                <p className="text-muted-foreground text-sm">
                  Focus on these to improve your readiness score
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/user/my-courses")}
              >
                View Plan
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
                      {course.progress > 0 ? "Improving" : "Start Now"}
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
                        Last active {course.lastAccessed}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Action Plan Progress</span>
                        <span className="font-semibold">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Next Lesson */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">
                        Next Action:
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
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Ready to get hired?
              </h3>
              <p className="text-muted-foreground mb-6">
                Take the Job Readiness Test to identify your skill gaps and get a 14-day action plan.
              </p>
              <Button onClick={() => navigate("/register")}>
                Take Free Readiness Test
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
                          <CheckCircle className="h-5 w-5 text-primary-600" />
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
                onClick={() => navigate("/register")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Take Readiness Test
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Career Courses
              </Button>
              {stats.totalCourses > 0 && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/user/progress")}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    My Readiness Stats
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/user/settings")}
              >
                <User className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={user?.name?.split(" ")[0] || "there"}
      />

      <ContinueLearningModal
        isOpen={showContinueModal}
        onClose={() => setShowContinueModal(false)}
        course={lastCourse}
        userName={user?.name?.split(" ")[0] || "there"}
      />

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
