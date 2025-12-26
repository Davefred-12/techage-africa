// ============================================
// FILE: src/components/modals/WelcomeModal.jsx - NEW
// ============================================
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Award, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose, userName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGetStarted = () => {
    onClose();
    navigate('/courses');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-6 text-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">
              Welcome to TechAge Africa, {userName}! 🎉
            </h2>
            <p className="text-white/90 text-base max-w-sm mx-auto">
              We're excited to have you here. Let's start your learning journey!
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Expert Courses</h3>
              <p className="text-xs text-muted-foreground">
                Learn from industry professionals
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center">
                <Award className="w-5 h-5 text-secondary-600" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Get Certified</h3>
              <p className="text-xs text-muted-foreground">
                Earn certificates on completion
              </p>
            </div>

            <div className="text-center p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-100 dark:border-accent-800">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-600" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">Track Progress</h3>
              <p className="text-xs text-muted-foreground">
                Monitor your learning journey
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary-600" />
              Quick Tips to Get Started:
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Browse our course catalog to find topics that interest you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Complete your profile to personalize your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>Enroll in courses and start learning at your own pace</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="flex-1 group"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              I'll Do This Later
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;