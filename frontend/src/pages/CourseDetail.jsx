// ============================================
// FILE: src/pages/CourseDetail.jsx - COMPLETE WITH VIDEO PLAYER
// ============================================
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../services/api";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Play,
  Globe,
  ArrowLeft,
  Loader2,
  XCircle,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // ✅ NEW

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // ✅ Fetch course data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/courses/${id}`);

        if (response.data.success) {
          setCourse(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course. Please try again.");
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ✅ Check if user is enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isAuthenticated || !course) {
        setCheckingEnrollment(false);
        return;
      }

      try {
        const response = await api.get(`/api/enrollments/check/${course._id}`);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [course, isAuthenticated]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!course) return;

      try {
        setReviewsLoading(true);
        const response = await api.get(
          `/api/user/courses/${course._id}/reviews`
        );

        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [course]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    if (isEnrolled) {
      navigate(`/user/courses/${course._id}/learn`);
      return;
    }

    setEnrolling(true);
    try {
      const response = await api.post("/api/enrollments/initiate", {
        courseId: course._id,
      });

      if (response.data.success) {
        const { authorization_url, reference } = response.data.data;
        localStorage.setItem("payment_reference", reference);
        window.location.href = authorization_url;
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
      setEnrolling(false);
    }
  };

  const getEnrollButtonContent = () => {
    if (checkingEnrollment) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Checking...
        </>
      );
    }

    if (!isAuthenticated) {
      return "Login to Enroll";
    }

    if (isEnrolled) {
      return (
        <>
          <Play className="w-4 h-4 mr-2" />
          Go to Course
        </>
      );
    }

    if (enrolling) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      );
    }

    return `Enroll Now - ${course ? formatCurrency(course.price) : "..."}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-danger-600" />
            </div>
            <h2 className="text-2xl font-bold">Course Not Found</h2>
            <p className="text-muted-foreground">
              {error || "The course you are looking for does not exist."}
            </p>
            <Button onClick={() => navigate("/courses")}>
              Browse All Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Back Button */}
      <div className="bg-background border-b">
        <div className="container-custom py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <Badge className="text-xs">{course.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-heading font-bold">
                  {course.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating?.average?.toFixed(1) || "0.0"}</span>
                  <span className="text-muted-foreground">
                    ({course.totalReviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>{course.enrolledStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getInitials(course.instructor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Course Instructor
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Course Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-0">
                  {/* ✅ THUMBNAIL/VIDEO PLAYER */}
                  <div className="relative aspect-video bg-black overflow-hidden">
                    {showPreview && course.previewVideo ? (
                      // ✅ Video Player
                      <div className="relative w-full h-full bg-black">
                        <video
                          controls
                          autoPlay
                          className="w-full h-full"
                          style={{ objectFit: "contain" }}
                        >
                          <source src={course.previewVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {/* Close button */}
                        <button
                          onClick={() => setShowPreview(false)}
                          className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white rounded-full p-2.5 transition-all z-50 shadow-xl"
                          type="button"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      // ✅ Thumbnail with Play Button
                      <div className="relative w-full h-full group cursor-pointer">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {course.previewVideo && (
                          <div
                            className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center"
                            onClick={() => setShowPreview(true)}
                          >
                            {/* Play Button */}
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                              <Play className="w-10 h-10 text-primary-600 ml-1.5 fill-primary-600" />
                            </div>

                            {/* Preview Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/55 text-foreground gap-1.5 px-3 py-1.5 text-xs font-semibold">
                                <Play className="w-3.5 h-3.5" />
                                Preview Available
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Price */}
                    <div>
                      <p className="text-3xl font-bold text-primary-600">
                        {formatCurrency(course.price)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        One-time payment • Lifetime access
                      </p>
                    </div>

                    {/* Enroll Button */}
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={checkingEnrollment || enrolling}
                    >
                      {getEnrollButtonContent()}
                    </Button>

                    {/* Enrollment status */}
                    {isAuthenticated && isEnrolled && (
                      <div className="flex items-center justify-center gap-2 text-sm text-accent-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>You're enrolled in this course</span>
                      </div>
                    )}

                    <Separator />

                    {/* What's Included */}
                    <div className="space-y-3">
                      <p className="font-semibold">This course includes:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                          <span>Lifetime access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                          <span>Certificate of completion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                          <span>Mobile and desktop access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                          <span>Downloadable Certificate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="container-custom py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.longDescription}
                </p>
              </CardContent>
            </Card>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    What You'll Learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {course.requirements && course.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-primary-600">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                {course.modules && course.modules.length > 0 ? (
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Module {module.order}: {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {module.lessons?.length || 0} lessons
                            </p>
                          </div>
                        </div>
                        {module.lessons && module.lessons.length > 0 && (
                          <ul className="space-y-2 ml-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li
                                key={lessonIndex}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                {lesson.title}{" "}
                                {lesson.duration && `(${lesson.duration})`}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Curriculum coming soon...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user?.avatar} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {review.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">
                                  {review.user?.name || "Anonymous"}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this course!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructor Tab */}
          <TabsContent value="instructor">
            <Card>
              <CardContent className="p-6">
                {course.instructor ? (
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                        {getInitials(course.instructor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {course.instructor.name}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Course Instructor
                      </p>
                      <p className="leading-relaxed">
                        {course.instructor.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Instructor information coming soon...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
