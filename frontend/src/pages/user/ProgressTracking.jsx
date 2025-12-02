// ============================================
// FILE: src/pages/user/ProgressTracking.jsx - REAL API
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
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  CheckCircle,
  Download,
  Calendar,
  PlayCircle,
  Loader2,
} from "lucide-react";

const ProgressTracking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // ✅ Fetch progress data from API
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);

        // Fetch progress overview
        const progressResponse = await api.get("/api/user/progress/overview");

        // Fetch achievements
        const achievementsResponse = await api.get(
          "/api/user/progress/achievements"
        );

        if (progressResponse.data.success) {
          setProgressData(progressResponse.data.data);
        }

        if (achievementsResponse.data.success) {
          setAchievements(achievementsResponse.data.data);
        }
      } catch (error) {
        console.error("Progress fetch error:", error);
        toast.error("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading progress data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!progressData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No progress data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const { overallStats, courseProgress } = progressData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Progress Tracking
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-5 w-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold">{overallStats.avgProgress}%</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Progress</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-150">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <PlayCircle className="h-5 w-5 text-secondary-600" />
              </div>
              <p className="text-2xl font-bold">{overallStats.inProgress}</p>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-accent-600" />
              </div>
              <p className="text-2xl font-bold">{overallStats.completed}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-250">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <p className="text-2xl font-bold">
                {overallStats.timeSpent || `${overallStats.totalHours}h`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Time Spent</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-5 w-5 text-secondary-600" />
              </div>
              <p className="text-2xl font-bold">{overallStats.certificates}</p>
              <p className="text-xs text-muted-foreground mt-1">Certificates</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-350">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-accent-600" />
              </div>
              <p className="text-2xl font-bold">{overallStats.totalCourses}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Details */}
        <div className="animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl font-bold mb-6">Course Progress</h2>
          <div className="space-y-4">
            {courseProgress && courseProgress.length > 0 ? (
              courseProgress.map((course, index) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-6 items-center">
                      {/* Course Info */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
                            onClick={() =>
                              navigate(`/user/courses/${course.id}/learn`)
                            }
                          >
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="font-bold text-lg hover:text-primary-600 transition-colors cursor-pointer"
                                onClick={() =>
                                  navigate(`/user/courses/${course.id}/learn`)
                                }
                              >
                                {course.title}
                              </h3>
                              <Badge
                                className={
                                  course.status === "completed"
                                    ? "bg-accent-600"
                                    : "bg-secondary-600"
                                }
                              >
                                {course.status === "completed"
                                  ? "Completed"
                                  : "In Progress"}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                              <span>
                                {course.completedLessons}/{course.totalLessons}{" "}
                                lessons
                              </span>
                              <span>•</span>
                              <span>{course.timeSpent} spent</span>
                              {course.status === "in-progress" && (
                                <>
                                  <span>•</span>
                                  <span>Active {course.lastActivity}</span>
                                </>
                              )}
                              {course.status === "completed" && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Completed {course.completedDate}
                                  </span>
                                </>
                              )}
                            </div>

                            {course.status === "in-progress" && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Progress
                                  </span>
                                  <span className="font-semibold">
                                    {course.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={course.progress}
                                  className="h-2"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Next: {course.nextLesson}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <Button
                          className="w-full"
                          onClick={() =>
                            navigate(`/user/courses/${course.id}/learn`)
                          }
                        >
                          {course.status === "completed"
                            ? "Review Course"
                            : "Continue Learning"}
                        </Button>

                        {course.status === "completed" &&
                          course.certificate && (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() =>
                                navigate(
                                  `/user/courses/${course.id}/certificate`
                                )
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Certificate
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No courses enrolled yet
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <Card className="animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? "bg-gradient-to-br from-accent-50 to-secondary-50 dark:from-accent-900/20 dark:to-secondary-900/20 border-accent-200 dark:border-accent-800"
                        : "bg-muted/30 border-dashed border-muted-foreground/30"
                    } animate-fade-in-up`}
                    style={{ animationDelay: `${index * 100 + 700}ms` }}
                  >
                    <div className="text-center space-y-2">
                      <div
                        className={`text-4xl mb-2 ${
                          !achievement.earned && "opacity-30"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <h4 className="font-bold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-accent-600 dark:text-accent-400 font-medium">
                          Earned {achievement.date}
                        </p>
                      )}
                      {!achievement.earned && achievement.progress && (
                        <Badge variant="secondary" className="text-xs">
                          {achievement.progress}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-150 { animation-delay: 150ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-250 { animation-delay: 250ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-350 { animation-delay: 350ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default ProgressTracking;
