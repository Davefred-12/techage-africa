// ============================================
// FILE: src/components/modals/ContinueLearningModal.jsx - NEW
// ============================================
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { X, PlayCircle, BookOpen, ArrowRight } from 'lucide-react';

const ContinueLearningModal = ({ isOpen, onClose, course, userName }) => {
  const navigate = useNavigate();

  if (!isOpen || !course) return null;

  const handleContinue = () => {
    onClose();
    navigate(`/user/courses/${course.id}/learn`);
  };

  const handleViewCourses = () => {
    onClose();
    navigate('/user/my-courses');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Course Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Greeting */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-muted-foreground">
              Ready to continue where you left off?
            </p>
          </div>

          {/* Course Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  You're {course.progress}% through this course
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary-600">
                  {course.progress}%
                </span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </div>

          {/* Motivation Message */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
            <p className="text-sm text-center">
              <span className="font-semibold text-primary-700 dark:text-primary-400">
                Keep it up! 🚀
              </span>
              <br />
              <span className="text-muted-foreground">
                You're making great progress. Just {100 - course.progress}% more to complete!
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleContinue}
              className="w-full group"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Continue Learning
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewCourses}
              className="w-full"
            >
              View All My Courses
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

export default ContinueLearningModal;