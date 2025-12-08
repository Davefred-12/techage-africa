// ============================================
// FILE: src/pages/admin/ManageBlogs.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Loader2,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react';

const ManageBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const response = await api.get(`/api/admin/blog?${params}`);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/blog/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching blog stats:', error);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await api.delete(`/api/admin/blog/${blogId}`);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
      fetchStats();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statsCards = [
    {
      icon: FileText,
      label: 'Total Posts',
      value: stats?.totalPosts?.toString() || '0',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      icon: TrendingUp,
      label: 'Published',
      value: stats?.publishedPosts?.toString() || '0',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: Clock,
      label: 'Drafts',
      value: stats?.draftPosts?.toString() || '0',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: stats?.totalViews?.toLocaleString() || '0',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Blog Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage your blog content
            </p>
          </div>
          <Button onClick={() => navigate('/admin/blog/create')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Blog Posts ({blogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-2">Loading blog posts...</span>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your search or filters."
                    : "Get started by creating your first blog post."}
                </p>
                <Button onClick={() => navigate('/admin/blog/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {blog.featuredImage && (
                              <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium line-clamp-1">{blog.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {blog.excerpt}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={blog.author?.avatar} />
                              <AvatarFallback className="text-xs">
                                {getUserInitials(blog.author?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{blog.author?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{blog.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(blog.status)}</TableCell>
                        <TableCell>{blog.views?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(blog.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {blog.status === 'published' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(blog._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set('page', (pagination.page - 1).toString());
                    navigate(`/admin/blog?${params}`);
                  }}
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set('page', pageNum.toString());
                      navigate(`/admin/blog?${params}`);
                    }}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set('page', (pagination.page + 1).toString());
                    navigate(`/admin/blog?${params}`);
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageBlogs;