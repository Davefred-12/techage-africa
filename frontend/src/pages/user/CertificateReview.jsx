// ============================================
// FILE: src/pages/user/CertificateReview.jsx - COMPLETE
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { toast } from 'sonner';
import CertificateGenerator from '../../components/CertificateGenerator';
import {
  Award,
  Star,
  Send,
  CheckCircle,
  Calendar,
  Clock,
  Trophy,
  Loader2,
  BookOpen,
} from 'lucide-react';

const CertificateReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const reviewSchema = z.object({
    review: z.string().min(10, 'Review must be at least 10 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/certificates/${id}`);

        if (response.data.success) {
          setCourseData(response.data.data);
        }
      } catch (error) {
        console.error('Certificate fetch error:', error);
        toast.error(error.response?.data?.message || 'Failed to load certificate');
        navigate('/user/my-courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id, navigate]);

  const onSubmitReview = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating!');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`/api/user/courses/${id}/review`, {
        rating,
        comment: data.review,
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setReviewSubmitted(true);
      }
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading certificate...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!courseData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Certificate not found</p>
          <Button onClick={() => navigate('/user/my-courses')}>
            Back to My Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-heading font-bold">
            Congratulations! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've successfully completed <strong>{courseData.title}</strong>
          </p>
        </div>

        {/* Stats */}
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { icon: BookOpen, label: 'Modules', value: courseData.modules, color: 'primary' },
    { icon: Award, label: 'Lessons', value: courseData.lessons, color: 'secondary' },
    { icon: Clock, label: 'Time Spent', value: courseData.timeSpent || `${courseData.hoursLearned}h`, color: 'accent' },  // ✅ FIXED
    { icon: CheckCircle, label: 'Progress', value: '100%', color: 'green' },
  ].map((stat, index) => (
    <Card key={index}>
      <CardContent className="p-4 text-center">
        <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}-600`} />
        <div className="text-2xl font-bold mb-1">{stat.value}</div>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </CardContent>
    </Card>
  ))}
</div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certificate Section */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary-600" />
                <div>
                  <h2 className="text-xl font-bold">Your Certificate</h2>
                  <p className="text-sm text-muted-foreground">Download and share</p>
                </div>
              </div>

              {/* Auto-Generated Certificate */}
              <CertificateGenerator certificateData={courseData} />

              {/* Course Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Completed: {courseData.completedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <div>
                  <h2 className="text-xl font-bold">Share Your Experience</h2>
                  <p className="text-sm text-muted-foreground">Help others learn</p>
                </div>
              </div>

              {reviewSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your review has been submitted successfully.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/user/my-courses')}>
                    Back to My Courses
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Rate this course
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm font-medium text-primary-600 mt-2">
                        {rating === 1 && '😞 Poor'}
                        {rating === 2 && '😕 Fair'}
                        {rating === 3 && '😊 Good'}
                        {rating === 4 && '😄 Very Good'}
                        {rating === 5 && '🤩 Excellent'}
                      </p>
                    )}
                  </div>

                  {/* Review Text */}
                  <div>
                    <label htmlFor="review" className="block text-sm font-semibold mb-2">
                      Your review
                    </label>
                    <Textarea
                      id="review"
                      {...register('review')}
                      placeholder="What did you like about this course? What could be improved?"
                      rows={6}
                    />
                    {errors.review && (
                      <p className="text-sm text-red-600 mt-1">{errors.review.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CertificateReview;