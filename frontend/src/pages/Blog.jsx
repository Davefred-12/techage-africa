// ============================================
// FILE: src/pages/Blog.jsx - SEO BLOG LISTING
// ============================================
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [pagination, setPagination] = useState(null);

  // SEO Meta Tags
  const seoTitle = selectedCategory
    ? `${selectedCategory} Articles - TechAge Africa Blog`
    : selectedTag
    ? `${selectedTag} Posts - TechAge Africa Blog`
    : searchTerm
    ? `Search Results for "${searchTerm}" - TechAge Africa Blog`
    : 'TechAge Africa Blog - Insights, Tutorials & Industry News';

  const seoDescription = selectedCategory
    ? `Read the latest ${selectedCategory.toLowerCase()} articles on TechAge Africa blog. Expert insights on technology, education, and career development in Africa.`
    : 'Stay updated with the latest technology trends, educational resources, and industry insights from TechAge Africa. Expert tutorials and career advice for African tech professionals.';

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
    fetchCategories();
    fetchTags();
  }, [searchParams]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams);
      const response = await api.get(`/api/blog?${params}`);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await api.get('/api/blog/featured?limit=3');
      setFeaturedBlogs(response.data.data);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/blog/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/blog/tags');
      setTags(response.data.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    setSearchParams(params);
  };

  const handleCategoryFilter = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === selectedCategory) {
      params.delete('category');
      setSelectedCategory('');
    } else {
      params.set('category', category);
      setSelectedCategory(category);
    }
    params.delete('tag');
    setSelectedTag('');
    setSearchParams(params);
  };

  const handleTagFilter = (tag) => {
    const params = new URLSearchParams(searchParams);
    if (tag === selectedTag) {
      params.delete('tag');
      setSelectedTag('');
    } else {
      params.set('tag', tag);
      setSelectedTag(tag);
    }
    params.delete('category');
    setSelectedCategory('');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setSearchParams(new URLSearchParams());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="TechAge Africa, technology blog, African tech, programming tutorials, career development, digital skills, tech education" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/images/blog-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <link rel="canonical" href={window.location.href} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "TechAge Africa Blog",
            "description": seoDescription,
            "url": window.location.origin + "/blog",
            "publisher": {
              "@type": "Organization",
              "name": "TechAge Africa",
              "logo": {
                "@type": "ImageObject",
                "url": window.location.origin + "/images/logo.png"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 mr-4" />
              <h1 className="text-4xl md:text-5xl font-heading font-bold">
                TechAge Africa Blog
              </h1>
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Insights, tutorials, and industry news to accelerate your tech career in Africa.
              Stay updated with the latest trends and expert knowledge.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-black bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryFilter(category._id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category._id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="font-medium">{category._id}</span>
                    <span className="ml-2 text-sm">({category.count})</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <Badge
                      key={tag._id}
                      variant={selectedTag === tag._id ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary-100"
                      onClick={() => handleTagFilter(tag._id)}
                    >
                      {tag._id} ({tag.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Posts */}
            {featuredBlogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Featured Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredBlogs.map((blog) => (
                    <div key={blog._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="block hover:text-primary-600 transition-colors"
                      >
                        <h4 className="font-semibold line-clamp-2 mb-2">{blog.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(blog.publishedAt)}
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {(selectedCategory || selectedTag || searchTerm) && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Active filters:</span>
                    {selectedCategory && (
                      <Badge variant="default" className="cursor-pointer" onClick={() => handleCategoryFilter(selectedCategory)}>
                        {selectedCategory} ×
                      </Badge>
                    )}
                    {selectedTag && (
                      <Badge variant="default" className="cursor-pointer" onClick={() => handleTagFilter(selectedTag)}>
                        #{selectedTag} ×
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge variant="default">
                        Search: "{searchTerm}"
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Blog Posts */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <Skeleton className="w-full h-48 md:h-full rounded-none" />
                      </div>
                      <div className="flex-1 md:w-2/3">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                          </div>

                          <Skeleton className="h-8 w-full mb-3" />

                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                              <Skeleton className="h-4 w-8" />
                              <Skeleton className="h-4 w-8" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              <Skeleton className="h-5 w-12" />
                              <Skeleton className="h-5 w-16" />
                            </div>

                            <Skeleton className="h-9 w-24" />
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory || selectedTag
                      ? "Try adjusting your search or filters."
                      : "Check back later for new content."}
                  </p>
                  {(searchTerm || selectedCategory || selectedTag) && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <Card key={blog._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      {blog.featuredImage && (
                        <div className="md:w-1/3">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`flex-1 ${blog.featuredImage ? 'md:w-2/3' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{blog.category}</Badge>
                            {blog.featured && <Badge variant="default">Featured</Badge>}
                          </div>

                          <Link to={`/blog/${blog.slug}`}>
                            <h2 className="text-2xl font-bold mb-3 hover:text-primary-600 transition-colors line-clamp-2">
                              {blog.title}
                            </h2>
                          </Link>

                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {blog.author?.name || 'TechAge Africa'}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(blog.publishedAt)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {blog.readingTime} min read
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {blog.views}
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {blog.likes?.length || 0}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {blog.comments?.length || 0}
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {blog.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                              {blog.tags?.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{blog.tags.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <Link to={`/blog/${blog.slug}`}>
                              <Button variant="outline" size="sm">
                                Read More
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={pagination.page <= 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', (pagination.page - 1).toString());
                        setSearchParams(params);
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
                          const params = new URLSearchParams(searchParams);
                          params.set('page', pageNum.toString());
                          setSearchParams(params);
                        }}
                      >
                        {pageNum}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', (pagination.page + 1).toString());
                        setSearchParams(params);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;