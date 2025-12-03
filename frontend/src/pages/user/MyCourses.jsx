// ============================================
// FILE: src/pages/user/MyCourses.jsx - REAL API
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  Clock,
  PlayCircle,
  CheckCircle,
  Calendar,
  Filter,
  Loader2,
} from "lucide-react";

const MyCourses = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);

  // ✅ Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/user/courses/enrolled", {
          params: { status: filter === "all" ? undefined : filter },
        });

        if (response.data.success) {
          setAllCourses(response.data.data);
        }
      } catch (error) {
        console.error("Fetch courses error:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filter]);

  const stats = {
    all: allCourses.length,
    inProgress: allCourses.filter((c) => c.status === "in-progress").length,
    completed: allCourses.filter((c) => c.status === "completed").length,
  };

  const handleCourseClick = (course) => {
    navigate(`/user/courses/${course.id}/learn`);
  };



  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Manage and continue your enrolled courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-fade-in-up animation-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold">{stats.all}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Completed
                  </p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Filter */}
        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="animate-fade-in-up animation-delay-400"
        >
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-2">
            <TabsTrigger value="all" className="gap-2">
              All Courses
              <Badge variant="secondary" className="ml-1">
                {stats.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="gap-2">
              In Progress
              <Badge variant="secondary" className="ml-1">
                {stats.inProgress}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              Completed
              <Badge variant="secondary" className="ml-1">
                {stats.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {allCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allCourses.map((course, index) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-xl transition-all group animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 100 + 500}ms` }}
                    onClick={() => handleCourseClick(course)}
                  >
                    {/* Course Thumbnail */}
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Status Badge */}
                      <Badge
                        className={`absolute top-3 left-3 ${
                          course.status === "completed"
                            ? "bg-accent-600"
                            : "bg-secondary-600"
                        }`}
                      >
                        {course.status === "completed" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </>
                        )}
                      </Badge>

                      {/* Play Button */}
                      <div className="absolute bottom-3 right-3">
                        <Button
                          size="sm"
                          className="rounded-full h-10 w-10 p-0"
                        >
                          <PlayCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-4">
                      {/* Course Title */}
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Enrolled {course.enrolledDate}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
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
                          <Progress value={course.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {course.completedLessons} of {course.totalLessons}{" "}
                            lessons
                          </p>
                        </div>
                      )}

                      {/* Completed Info */}
                      {course.status === "completed" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
                            <p className="text-sm font-medium text-accent-700 dark:text-accent-400 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Course Completed!
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Finished on {course.completedDate}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (course.status === "completed") {
                              navigate(
                                `/user/courses/${course.id}/certificate`
                              );
                            } else {
                              navigate(`/user/courses/${course.id}/learn`);
                            }
                          }}
                        >
                          {course.status === "completed"
                            ? "View Certificate"
                            : "Continue Learning"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {filter === "all"
                      ? "You haven't enrolled in any courses yet."
                      : `You don't have any ${filter.replace(
                          "-",
                          " "
                        )} courses.`}
                  </p>
                  <Button onClick={() => navigate("/courses")}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
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
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>
    </DashboardLayout>
  );
};

export default MyCourses;
