// ============================================
// FILE: src/components/home/FeaturedCourses.jsx - UPDATED
// ============================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, Users, Star, ArrowRight, Loader2 } from "lucide-react";

const FeaturedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/courses");
        if (response.data.success) {
          // Show only first 3 courses as featured
          setCourses(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Featured Courses</Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Start Learning Today
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular courses and begin your journey to mastering
            in-demand skills.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <>
            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/courses/${course._id}`)} // ✅ Use MongoDB _id
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-white/45 text-foreground">
                      {course.level}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    {/* Category */}
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>

                    {/* Title */}
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledStudents || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {course.rating?.average?.toFixed(1) || "0.0"}
                        </span>{" "}
                       
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(course.price)}
                      </p>
                    </div>
                    <Button size="sm" className="group-hover:bg-primary-700">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/courses")}
                className="gap-2"
              >
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          // No courses
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses available at the moment.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
