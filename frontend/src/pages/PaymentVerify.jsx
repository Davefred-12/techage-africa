// ============================================
// FILE: src/pages/PaymentVerify.jsx - FIXED AUTH ISSUE
// ============================================
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [course, setCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    const verifyPayment = async () => {
      hasVerified.current = true;

      // Get reference from URL
      const reference = searchParams.get('reference');

      if (!reference) {
        console.error('No payment reference in URL');
        toast.error('Invalid payment reference');
        setStatus('failed');
        setErrorMessage('No payment reference found in URL');
        return;
      }

      console.log('🔍 Verifying payment reference:', reference);

      // ✅ Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        setStatus('failed');
        setErrorMessage('Authentication required. Please login again.');
        toast.error('Please login to complete enrollment');
        setTimeout(() => {
          navigate('/login', { state: { from: window.location.pathname } });
        }, 2000);
        return;
      }

      try {
        console.log('📤 Sending verification request...');
        
        // Call backend to verify payment
        const response = await api.post('/api/enrollments/verify', {
          reference,
        });

        console.log('✅ Verification response:', response.data);

        if (response.data.success) {
          setStatus('success');
          setCourse(response.data.data.course);

          // Clear payment reference from localStorage
          localStorage.removeItem('payment_reference');

          toast.success('🎉 Enrollment successful! Welcome to the course!');
        } else {
          throw new Error(response.data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('❌ Payment verification error:', error);
        
        setStatus('failed');
        
        // Handle different error types
        if (error.response?.status === 401) {
          setErrorMessage('Session expired. Please login again.');
          toast.error('Session expired. Please login again.');
          setTimeout(() => {
            navigate('/login', { state: { from: window.location.pathname } });
          }, 2000);
        } else if (error.response?.status === 404) {
          setErrorMessage('Enrollment not found. The payment reference may be invalid.');
          toast.error('Enrollment not found');
        } else if (error.response?.status === 400) {
          setErrorMessage(error.response.data.message || 'Payment verification failed');
          toast.error(error.response.data.message || 'Payment verification failed');
        } else {
          setErrorMessage(error.response?.data?.message || error.message || 'Payment verification failed');
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto" />
              <h2 className="text-2xl font-heading font-bold">
                Verifying Payment...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment
              </p>
              <div className="flex justify-center space-x-2 pt-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-accent-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-bold">
                  Payment Successful! 🎉
                </h2>
                <p className="text-muted-foreground">
                  You're now enrolled in {course?.title || 'the course'}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate(`/user/courses/${course?._id}/learn`)}
                >
                  Start Learning Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/user/my-courses')}
                >
                  View My Courses
                </Button>
              </div>
            </div>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-danger-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-bold">
                  Payment Verification Failed
                </h2>
                <p className="text-muted-foreground text-sm">
                  {errorMessage || "We couldn't verify your payment. Please try again or contact support."}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/courses')}
                >
                  Back to Courses
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default PaymentVerify;