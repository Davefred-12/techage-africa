// ============================================
// FILE: src/components/home/Newsletter.jsx - CONNECTED
// ============================================
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await api.post('/api/public/subscribe', { email });
      
      if (response.data.success) {
        setIsSubscribed(true);
        setEmail('');
        toast.success('Successfully subscribed! Check your email for confirmation.');
        
        // Reset after 10 seconds
        setTimeout(() => setIsSubscribed(false), 10000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-12 bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Stay Updated with TechAge
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get the latest tech insights, course updates, and exclusive opportunities delivered to your inbox. Join 5000+ subscribers!
            </p>
          </div>

          {/* Newsletter Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isLoading}
                  className="bg-white text-primary-600 hover:bg-white/90"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              <p className="text-sm text-white/70 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 animate-fade-in">
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="w-6 h-6" />
                <p className="font-medium">Thanks for subscribing! Check your email.</p>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Weekly updates</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Newsletter;
