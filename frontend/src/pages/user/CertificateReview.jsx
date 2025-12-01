// ============================================
// FILE: src/pages/user/CertificateReview.jsx - FIXED & CLEAN
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
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import {
  Award,
  Download,
  Star,
  Send,
  CheckCircle,
  Calendar,
  Clock,
  Trophy,
  Share2,
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
  const [downloading, setDownloading] = useState(false);

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

  // ✅ Generate and download PDF certificate
  const handleDownloadCertificate = async () => {
    if (!courseData || downloading) return;

    try {
      setDownloading(true);
      toast.info('Generating your certificate...');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Load the admin's certificate template as background
      if (courseData.certificatePreview && !courseData.certificatePreview.includes('placeholder')) {
        try {
          // Load image
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = courseData.certificatePreview;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Add template as background
          pdf.addImage(img, 'JPEG', 0, 0, 297, 210);
        } catch (imgError) {
          console.error('Failed to load template:', imgError);
          // Fallback to default design
          addDefaultCertificateDesign(pdf);
        }
      } else {
        // No template, use default design
        addDefaultCertificateDesign(pdf);
      }

      // ✅ Add user's name and details on top of template
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      
      // Center the name
      const userName = courseData.userName || 'Student';
      const textWidth = pdf.getTextWidth(userName);
      const centerX = (297 - textWidth) / 2;
      pdf.text(userName, centerX, 105);

      // Add course title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'normal');
      const courseTitle = courseData.title;
      const titleWidth = pdf.getTextWidth(courseTitle);
      const titleX = (297 - titleWidth) / 2;
      pdf.text(courseTitle, titleX, 125);

      // Add date
      pdf.setFontSize(12);
      const dateText = `Completed on ${courseData.completedDate}`;
      const dateWidth = pdf.getTextWidth(dateText);
      const dateX = (297 - dateWidth) / 2;
      pdf.text(dateText, dateX, 140);

      // Save PDF
      const fileName = `Certificate-${courseData.title.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      pdf.save(fileName);

      toast.success('Certificate downloaded successfully! 🎉');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate certificate');
    } finally {
      setDownloading(false);
    }
  };

  // Default certificate design (fallback)
  const addDefaultCertificateDesign = (pdf) => {
    // Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 297, 210, 'F');

    // Border
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(2);
    pdf.rect(10, 10, 277, 190);

    // Inner border
    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, 267, 180);

    // Header
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(41, 128, 185);
    const headerText = 'CERTIFICATE OF COMPLETION';
    const headerWidth = pdf.getTextWidth(headerText);
    pdf.text(headerText, (297 - headerWidth) / 2, 40);

    // Decorative line
    pdf.setDrawColor(231, 76, 60);
    pdf.setLineWidth(1);
    pdf.line(80, 50, 217, 50);

    // "This certifies that"
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const certText = 'This certifies that';
    const certWidth = pdf.getTextWidth(certText);
    pdf.text(certText, (297 - certWidth) / 2, 75);

    // "has successfully completed"
    pdf.setFontSize(12);
    const completedText = 'has successfully completed';
    const completedWidth = pdf.getTextWidth(completedText);
    pdf.text(completedText, (297 - completedWidth) / 2, 135);

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    const footerText = 'TechAge Africa - Empowering Africa through Technology';
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (297 - footerWidth) / 2, 185);
  };

  // Submit review
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
        {/* ✅ CLEANER Header */}
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

        {/* ✅ CLEANER Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Modules', value: courseData.modules, color: 'primary' },
            { icon: Award, label: 'Lessons', value: courseData.lessons, color: 'secondary' },
            { icon: Clock, label: 'Hours', value: `${courseData.hoursLearned}h`, color: 'accent' },
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
          {/* ✅ CLEANER Certificate Section */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary-600" />
                <div>
                  <h2 className="text-xl font-bold">Your Certificate</h2>
                  <p className="text-sm text-muted-foreground">Download and share</p>
                </div>
              </div>

              {/* ✅ Certificate Preview - Using Admin's Template */}
              <div className="relative aspect-[16/11] border-2 border-border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                {courseData.certificatePreview && !courseData.certificatePreview.includes('placeholder') ? (
                  <img
                    src={courseData.certificatePreview}
                    alt="Certificate Template"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback preview
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <Award className="w-16 h-16 text-primary-600 mb-4" />
                    <h3 className="text-xl font-bold text-center mb-2">
                      Certificate of Completion
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">This certifies that</p>
                    <p className="text-2xl font-bold mb-2">{courseData.userName}</p>
                    <p className="text-sm text-muted-foreground mb-2">has completed</p>
                    <p className="text-lg font-semibold text-center text-primary-600">
                      {courseData.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleDownloadCertificate}
                  disabled={downloading}
                  className="w-full"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Certificate (PDF)
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </div>

              {/* Course Info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Completed: {courseData.completedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Review Section - Keep as is */}
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