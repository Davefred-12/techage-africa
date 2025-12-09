// ============================================
// FILE: src/pages/admin/BlogEditor.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Save,
  ArrowLeft,
  Eye,
  Upload,
  X,
  Loader2,
  FileText,
  Tag,
  Image,
} from 'lucide-react';

// Blog validation schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional(),
  seoKeywords: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
});

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featuredImage: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      featured: false,
      status: 'draft',
    },
  });

  const categories = [
    'Technology',
    'Education',
    'Career Development',
    'Industry Insights',
    'Success Stories',
    'Tips & Tricks',
    'Announcements',
    'Tutorials',
  ];

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/blog/${id}`);
      const blog = response.data.data;

      form.reset({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        featuredImage: blog.featuredImage || '',
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        seoKeywords: blog.seoKeywords?.join(', ') || '',
        featured: blog.featured || false,
        status: blog.status || 'draft',
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Process tags and keywords
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        seoKeywords: data.seoKeywords ? data.seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword) : [],
      };

      if (isEditing) {
        await api.put(`/api/admin/blog/${id}`, processedData);
        toast.success('Blog post updated successfully');
      } else {
        await api.post('/api/admin/blog', processedData);
        toast.success('Blog post created successfully');
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary
      // For now, we'll just create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValue('featuredImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue('featuredImage', '');
  };


  const autoGenerateSEO = () => {
    const title = form.getValues('title');
    const excerpt = form.getValues('excerpt');

    if (title && !form.getValues('seoTitle')) {
      form.setValue('seoTitle', title.substring(0, 60));
    }

    if (excerpt && !form.getValues('seoDescription')) {
      form.setValue('seoDescription', excerpt.substring(0, 160));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary-600 mb-4" />
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your blog post content' : 'Write and publish engaging content'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update' : 'Publish'}
                </>
              )}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter blog post title..."
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                autoGenerateSEO();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief summary of your blog post..."
                              rows={3}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                autoGenerateSEO();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="technology, react, javascript..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blog Content *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your blog post content here... (HTML supported)"
                              rows={20}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Featured Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {form.watch('featuredImage') ? (
                      <div className="relative">
                        <img
                          src={form.watch('featuredImage')}
                          alt="Featured"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload a featured image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>Choose Image</span>
                          </Button>
                        </label>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Mark as featured post</FormLabel>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      SEO Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title (60 chars max)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Custom SEO title..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            {field.value?.length || 0}/60 characters
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description (160 chars max)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Custom SEO description..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            {field.value?.length || 0}/160 characters
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Keywords (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="keyword1, keyword2, keyword3..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;