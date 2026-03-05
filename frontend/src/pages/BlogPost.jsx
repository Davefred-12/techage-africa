// ============================================
// FILE: src/pages/BlogPost.jsx - RESPONSIVE SEO BLOG POST PAGE
// ============================================
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/authContext';
import { Helmet } from 'react-helmet-async';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/blog/${slug}`);
      const blogData = response.data.data;
      setBlog(blogData);
      setRelatedPosts(blogData.relatedPosts || []);
      setLikesCount(blogData.likes?.length || 0);
      setLiked(blogData.likes?.some(like => like.user.toString() === user?.id) || false);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      if (error.response?.status === 404) {
        navigate('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/api/blog/${blog._id}/like`);
      setLiked(response.data.data.isLiked);
      setLikesCount(response.data.data.likesCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      await api.post(`/api/blog/${blog._id}/comment`, {
        content: commentContent.trim(),
      });
      setCommentContent('');
      fetchBlogPost();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2">Loading article...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const seoTitle = blog.seoTitle || `${blog.title} - JobLadda Blog`;
  const seoDescription = blog.seoDescription || blog.excerpt;
  const canonicalUrl = `${window.location.origin}/blog/${blog.slug}`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={blog.seoKeywords?.join(', ') || blog.tags?.join(', ')} />
        <meta name="author" content={blog.author?.name || 'JobLadda'} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={blog.featuredImage || '/images/blog-default.jpg'} />
        <meta property="og:site_name" content="JobLadda" />
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:author" content={blog.author?.name || 'JobLadda'} />
        <meta property="article:section" content={blog.category} />
        {blog.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={blog.featuredImage || '/images/blog-default.jpg'} />
        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.featuredImage || '/images/blog-default.jpg',
            "datePublished": blog.publishedAt,
            "dateModified": blog.updatedAt,
            "author": {
              "@type": "Person",
              "name": blog.author?.name || 'JobLadda',
              "image": blog.author?.avatar
            },
            "publisher": {
              "@type": "Organization",
              "name": "JobLadda",
              "logo": {
                "@type": "ImageObject",
                "url": window.location.origin + "/images/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "keywords": blog.tags?.join(', '),
            "articleSection": blog.category,
            "wordCount": blog.content.split(/\s+/).length,
            "timeRequired": `PT${blog.readingTime}M`
          })}
        </script>
      </Helmet>

      {/* Hero Section - Updated with Blue Gradient */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16 lg:py-20 relative overflow-hidden" data-aos="fade-up">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-white rounded-full -top-32 -left-32 md:-top-48 md:-left-48 animate-pulse"></div>
          <div
            className="absolute w-64 h-64 md:w-96 md:h-96 bg-white rounded-full -bottom-32 -right-32 md:-bottom-48 md:-right-48 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 md:mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
              <Badge variant="secondary" className="text-xs md:text-sm">{blog.category}</Badge>
              {blog.featured && <Badge variant="outline" className="text-xs md:text-sm">Featured</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold mb-4 md:mb-6 leading-tight">
              {blog.title}
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Author and Meta Info - Responsive Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 text-white/80 text-sm md:text-base">
              <div className="flex items-center">
                <Avatar className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3">
                  <AvatarImage src={blog.author?.avatar} />
                  <AvatarFallback>{getUserInitials(blog.author?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm md:text-base">{blog.author?.name || 'JobLadda'}</div>
                  <div className="text-xs md:text-sm">Author</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs md:text-sm">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{formatDate(blog.publishedAt)}</span>
                  <span className="sm:hidden">{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {blog.readingTime} min
                </div>

                <div className="flex items-center">
                  <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {blog.views}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12" data-aos="fade-left" data-aos-delay="50">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-6 md:mb-8">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <Card>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <>
                    <Separator className="my-6 md:my-8" />
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <Link key={tag} to={`/blog?tag=${tag}`}>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 text-xs md:text-sm">
                            #{tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* Engagement */}
                <Separator className="my-6 md:my-8" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Button
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2 text-xs md:text-sm"
                    >
                      <Heart className={`w-3 h-3 md:w-4 md:h-4 ${liked ? 'fill-current' : ''}`} />
                      <span className="hidden xs:inline">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                      <span className="xs:hidden">{likesCount}</span>
                    </Button>

                    <Button variant="outline" size="sm" onClick={sharePost} className="text-xs md:text-sm">
                      <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {blog.comments?.length || 0} comments
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="mt-6 md:mt-8">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Comments ({blog.comments?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                {user ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Add a comment</label>
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full p-3 border border-input bg-background rounded-md resize-none transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleComment} disabled={submittingComment} size="sm" className="text-xs md:text-sm">
                      {submittingComment ? (
                        <>
                          <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post Comment'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 bg-muted rounded-lg px-4">
                    <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto text-muted-foreground mb-3 md:mb-4" />
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Join the conversation</h3>
                    <p className="text-muted-foreground mb-4 text-xs md:text-sm">
                      Sign in to leave a comment and engage with other readers.
                    </p>
                    <Link to="/login">
                      <Button size="sm">Sign In</Button>
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                {blog.comments && blog.comments.length > 0 && (
                  <div className="space-y-4">
                    {blog.comments.map((comment) => (
                      <div key={comment._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-2 md:gap-3">
                          <Avatar className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                            <AvatarImage src={comment.user?.avatar} />
                            <AvatarFallback className="text-xs">{getUserInitials(comment.user?.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-semibold text-xs md:text-sm">{comment.user?.name || 'Anonymous'}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs md:text-sm break-words">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12">
                    <AvatarImage src={blog.author?.avatar} />
                    <AvatarFallback>{getUserInitials(blog.author?.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm md:text-base">{blog.author?.name || 'JobLadda'}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Author</div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Expert in {blog.category} with a passion for sharing knowledge and empowering
                  the African tech community.
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {relatedPosts.map((post) => (
                    <Link key={post._id} to={`/blog/${post.slug}`} className="block">
                      <div className="hover:bg-muted p-2 md:p-3 rounded-lg transition-colors">
                        <h4 className="font-semibold line-clamp-2 mb-1 md:mb-2 text-xs md:text-sm">{post.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Article Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Article Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span>Views</span>
                  <span className="font-semibold">{blog.views}</span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span>Likes</span>
                  <span className="font-semibold">{likesCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span>Comments</span>
                  <span className="font-semibold">{blog.comments?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span>Reading Time</span>
                  <span className="font-semibold">{blog.readingTime} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;