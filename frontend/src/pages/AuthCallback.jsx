// ============================================
// FILE: src/pages/AuthCallback.jsx - NEW
// ============================================
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Get token from URL query parameter
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      // Check for errors
      if (error) {
        if (error === 'oauth_failed') {
          toast.error('OAuth authentication failed. Please try again.');
        } else {
          toast.error('An error occurred during authentication.');
        }
        navigate('/login');
        return;
      }

      // Check if token exists
      if (!token) {
        toast.error('No authentication token received.');
        navigate('/login');
        return;
      }

      try {
        // Store token in localStorage
        localStorage.setItem('token', token);

        // Fetch user data using the token
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          // Store user data
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);

          // Show success message
          toast.success(`Welcome, ${data.user.name}! 👋`);

          // Redirect to home page
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Failed to complete authentication. Please try again.');
        
        // Clear any stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Loading Spinner */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold">
            Completing Sign In...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we set up your account
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2 pt-4">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

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

export default AuthCallback;