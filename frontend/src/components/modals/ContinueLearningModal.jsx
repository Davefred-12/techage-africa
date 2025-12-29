// ============================================
// FILE: src/components/modals/ContinueLearningModal.jsx - UPDATED
// ============================================
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { BookOpen, TrendingUp, Award, ArrowRight } from 'lucide-react';

const ContinueLearningModal = ({ isOpen, onClose, course }) => {
  const navigate = useNavigate();

  // Handle different scenarios
  const hasNoCourses = course?.totalCourses === 0;
  const hasCourses = course?.totalCourses > 0;
  const lastCourse = course?.lastCourse;

  const handleContinue = () => {
    if (hasNoCourses) {
      // No courses - go to courses page
      navigate('/courses');
    } else if (lastCourse) {
      // Has courses - go to last accessed course
      navigate(`/user/courses/${lastCourse.id}/learn`);
    } else {
      // Fallback - go to dashboard
      navigate('/user');
    }
    onClose();
  };

  const handleViewAll = () => {
    navigate('/user/courses');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-heading">
            {hasNoCourses ? '🎓 Start Your Learning Journey' : '📚 Welcome Back!'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {hasNoCourses 
              ? "You haven't enrolled in any courses yet. Let's get started!"
              : 'Ready to continue your learning journey?'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* NO COURSES - Show Browse Courses CTA */}
          {hasNoCourses && (
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary-600" />
              </div>
              <p className="text-muted-foreground">
                Explore our courses and start building your tech skills today!
              </p>
              <Button 
                onClick={handleContinue}
                size="lg"
                className="w-full"
              >
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* HAS COURSES - Show Stats and Last Course */}
          {hasCourses && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-2xl font-bold">{course.totalCourses}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.totalCourses === 1 ? 'Course' : 'Courses'}
                  </p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary-600" />
                  <p className="text-2xl font-bold">{course.inProgressCount}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Award className="w-6 h-6 mx-auto mb-2 text-success-600" />
                  <p className="text-2xl font-bold">{course.completedCount}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              {/* Last Accessed Course */}
              {lastCourse && (
                <div className="border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Continue where you left off:
                  </p>
                  <div className="flex gap-4">
                    <img
                      src={lastCourse.thumbnail}
                      alt={lastCourse.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold line-clamp-2">
                        {lastCourse.title}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{lastCourse.progress}%</span>
                        </div>
                        <Progress value={lastCourse.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleContinue}
                  size="lg"
                  className="w-full"
                >
                  {lastCourse?.progress === 100 
                    ? 'Review Course' 
                    : lastCourse?.progress > 0 
                      ? 'Continue Learning' 
                      : 'Start Course'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleViewAll}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  View All My Courses
                </Button>
              </div>
            </>
          )}

          {/* Skip Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContinueLearningModal;