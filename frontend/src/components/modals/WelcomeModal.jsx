// ============================================
// FILE 1: src/components/modals/WelcomeModal.jsx - MOBILE RESPONSIVE
// ============================================
import { useNavigate } from 'react-router-dom';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Mobile: max-w-sm, Desktop: max-w-lg */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-card rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[95vh] flex flex-col">
        {/* Header - Smaller on mobile */}
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-4 sm:p-6 text-white overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="relative text-center space-y-1 sm:space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full backdrop-blur-sm mb-1">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
              Welcome, {userName}! 🎉
            </h2>
            <p className="text-white/90 text-xs sm:text-sm max-w-xs mx-auto">
              Let's start your learning journey!
            </p>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 overflow-y-auto flex-1">
          {/* Features - 3 columns on all screens */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-[11px] sm:text-sm">Expert Courses</h3>
            </div>

            <div className="text-center p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-[11px] sm:text-sm">Get Certified</h3>
            </div>

            <div className="text-center p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-100 dark:border-accent-800">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 rounded-full bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent-600" />
              </div>
              <h3 className="font-semibold text-[11px] sm:text-sm">Track Progress</h3>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3 space-y-1.5">
            <h3 className="font-semibold flex items-center gap-2 text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              Quick Tips:
            </h3>
            <ul className="space-y-1 text-[11px] sm:text-xs text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <span className="text-primary-600">•</span>
                <span>Browse courses to find topics you love</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary-600">•</span>
                <span>Complete your profile to personalize experience</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary-600">•</span>
                <span>Start learning at your own pace</span>
              </li>
            </ul>
          </div>

          {/* Buttons - Stack on mobile */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={handleGetStarted}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors group"
            >
              Explore Courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-border hover:bg-muted py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
