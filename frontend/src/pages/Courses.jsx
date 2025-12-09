// ============================================
// FILE: src/pages/Courses.jsx - Enhanced with Animations
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Clock, Users, Star, Search, Filter, Sparkles } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('newest');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/courses');
        
        if (response.data.success) {
          setAllCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Filter and sort courses
  const getFilteredCourses = () => {
    let filtered = [...allCourses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by filter
    switch (filterBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
        break;
      case 'top-rated':
        filtered.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/20 dark:via-background dark:to-secondary-900/20">
      <div className="container-custom">
        {/* Header with animation */}
        <div 
          className={`mb-12 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Transform Your Career</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
            Explore Our Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your learning journey with our expertly crafted courses designed for African learners.
          </p>
        </div>

        {/* Search and Filter - Modern compact design */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Search - Reduced width to 320px */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-300 group-focus-within:text-primary-600" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
            />
          </div>

          {/* Filter - Compact design with reduced width */}
          <div className="flex items-center gap-2 bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 px-3 py-1 border">
            <Filter className="h-4 w-4 text-primary-600" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40 border-0 focus:ring-0 h-9 font-medium">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count with animation */}
        <div 
          className={`mb-6 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="text-sm text-muted-foreground font-medium">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-pulse">Loading courses</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </span>
            ) : (
                              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Showing <span className="font-bold text-primary-600">{filteredCourses.length}</span> courses
              </span>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden animate-pulse">
                <div className="relative h-48 bg-muted">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div
                key={course._id}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <Card
                  className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/courses/${course.slug || course._id}`)}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-110">
                      {course.level}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    {/* Category */}
                    <Badge variant="secondary" className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                      {course.category}
                    </Badge>

                    {/* Title */}
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary-600">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary-600">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledStudents || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">
                          {course.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-muted-foreground/70">
                          ({course.rating?.count || 0})
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 flex justify-between items-center border-t">
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatCurrency(course.price)}
                      </p>
                    </div>
                    <Button size="sm" className="transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 mb-4 animate-pulse">
              <Search className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;