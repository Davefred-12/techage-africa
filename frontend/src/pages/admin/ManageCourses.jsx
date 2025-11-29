/* eslint-disable react-hooks/exhaustive-deps */
// ============================================
// FILE: src/pages/admin/ManageCourses.jsx - REAL API
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  BookOpen,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  MoreVertical,
  Loader2,
  Star,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';

const ManageCourses = () => {
  const navigate = useNavigate();
  
  // ✅ State for real data
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch courses on mount and when filters change
  useEffect(() => {
    fetchCourses();
  }, [searchQuery, filterCategory, filterStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await api.get('/api/admin/courses', { params });
      setCourses(response.data.courses || []);
      
      // Calculate stats from courses
      const totalCourses = response.data.total || 0;
      const activeCourses = response.data.courses?.filter(c => c.status === 'active').length || 0;
      const totalEnrollments = response.data.courses?.reduce((sum, c) => sum + (c.enrollments || 0), 0) || 0;
      const totalRevenue = response.data.courses?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;

      setStats({ totalCourses, activeCourses, totalEnrollments, totalRevenue });
    } catch (error) {
      console.error('Fetch courses error:', error);
      toast.error('Failed to load courses');
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

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowViewDialog(true);
  };

  const handleEditCourse = (course) => {
    // Navigate to edit page (you'll create this later)
    navigate(`/admin/courses/edit/${course._id}`);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/admin/courses/${selectedCourse._id}`);
      toast.success('Course deleted successfully!');
      setShowDeleteDialog(false);
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await api.patch(`/api/admin/courses/${course._id}/publish`);
      toast.success(`Course ${course.isPublished ? 'unpublished' : 'published'} successfully!`);
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error('Failed to update course status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Manage Courses
            </h1>
            <p className="text-muted-foreground">
              View, edit, and manage all courses
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/upload')}
            className="bg-gradient-to-r from-primary-600 to-secondary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="animate-fade-in-up animation-delay-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Courses
                    </p>
                    <p className="text-3xl font-bold">{stats.totalCourses}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-150">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Active Courses
                    </p>
                    <p className="text-3xl font-bold">{stats.activeCourses}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Enrollments
                    </p>
                    <p className="text-3xl font-bold">{stats.totalEnrollments}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animation-delay-250">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search & Filters */}
        <Card className="animate-fade-in-up animation-delay-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Artificial Intelligence">AI</SelectItem>
                  <SelectItem value="Career Development">Career</SelectItem>
                  <SelectItem value="Digital Marketing">Marketing</SelectItem>
                  <SelectItem value="Product Design">Design</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="animate-fade-in-up animation-delay-400">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Course</th>
                      <th className="text-left p-4 font-medium text-sm">Category</th>
                      <th className="text-left p-4 font-medium text-sm">Price</th>
                      <th className="text-left p-4 font-medium text-sm">Enrollments</th>
                      <th className="text-left p-4 font-medium text-sm">Revenue</th>
                      <th className="text-left p-4 font-medium text-sm">Rating</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-right p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <tr
                          key={course._id}
                          className="border-t hover:bg-muted/30 transition-colors animate-fade-in-up"
                          style={{ animationDelay: `${index * 50 + 500}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={course.thumbnail || 'https://via.placeholder.com/150'}
                                alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold text-sm">{course.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {course.modules || 0} modules • {course.totalLessons || 0} lessons
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {course.category}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold">
                              ₦{course.price?.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{course.enrollments || 0}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold text-primary-600">
                              {formatCurrency(course.revenue || 0)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">★</span>
                              <span className="text-sm">
                                {course.rating?.average > 0 ? course.rating.average.toFixed(1) : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                course.status === 'active'
                                  ? 'bg-accent-600'
                                  : 'bg-muted text-foreground'
                              }
                            >
                              {course.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewCourse(course)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Course
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleTogglePublish(course)}
                                >
                                  <Star className="mr-2 h-4 w-4" />
                                  {course.isPublished ? 'Unpublish' : 'Publish'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCourse(course)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <p className="font-semibold mb-1">No courses found</p>
                              <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Course Modal */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Course Details</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-6">
                <img
                  src={selectedCourse.thumbnail || 'https://via.placeholder.com/800x400'}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-xl mb-2">{selectedCourse.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <p className="font-semibold">₦{selectedCourse.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Enrollments:</span>
                    <p className="font-semibold">{selectedCourse.enrollments || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Revenue:</span>
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(selectedCourse.revenue || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={selectedCourse.status === 'active' ? 'bg-accent-600' : 'bg-muted'}>
                      {selectedCourse.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowViewDialog(false);
                handleEditCourse(selectedCourse);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedCourse?.title}"? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Course'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>
    </AdminLayout>
  );
};

export default ManageCourses;