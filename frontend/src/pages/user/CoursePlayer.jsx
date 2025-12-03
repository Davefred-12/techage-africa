// ============================================
// FILE: src/pages/user/CoursePlayer.jsx - UPDATED (No Lesson Description)
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  Menu,
  X,
  BookOpen,
  Star,
  Loader2,
} from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [marking, setMarking] = useState(false);

  // ✅ Fetch course content from API
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/courses/${id}/content`);

        if (response.data.success) {
          setCourseData(response.data.data);
        }
      } catch (error) {
        console.error('Course content fetch error:', error);
        toast.error(error.response?.data?.message || 'Failed to load course');
        navigate('/user/my-courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [id, navigate]);

  // ✅ Mark lesson as complete
  const handleMarkComplete = async () => {
    if (!allLessons[currentLessonIndex]) return;

    const lessonId = allLessons[currentLessonIndex]._id;
    const isCompleted = courseData.completedLessonIds?.includes(lessonId);

    if (isCompleted) {
      toast.info('Lesson already completed!');
      return;
    }

    try {
      setMarking(true);
      const response = await api.post(
        `/api/user/courses/${id}/lessons/${lessonId}/complete`
      );

      if (response.data.success) {
        toast.success('Lesson marked as complete!');
        
        // Update local state
        setCourseData(prev => ({
          ...prev,
          completedLessonIds: [...(prev.completedLessonIds || []), lessonId],
          progress: response.data.data.progress,
        }));

        // Check if certificate issued
        if (response.data.data.certificateIssued) {
          toast.success('🎉 Congratulations! You earned a certificate!', {
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Mark complete error:', error);
      toast.error('Failed to mark lesson as complete');
    } finally {
      setMarking(false);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      handleMarkComplete();
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleLessonSelect = (index) => {
    setCurrentLessonIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <Button onClick={() => navigate('/user/my-courses')}>
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  const allLessons = courseData.modules?.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleName: module.title,
    }))
  ) || [];

  const currentLesson = allLessons[currentLessonIndex];
  const isLessonCompleted = courseData.completedLessonIds?.includes(currentLesson?._id);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/user/my-courses')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Exit Course
            </Button>
            <div className="hidden md:block border-l pl-4">
              <h1 className="font-semibold text-xl text-center">{courseData.title}</h1>
              <p className="text-xs text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-muted px-4 py-2 rounded-full">
              <Progress value={courseData.progress} className="w-24 h-2" />
              <span className="text-sm font-semibold">
                {courseData.progress}%
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {currentLesson?.videoUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-white text-center">
                <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No video available for this lesson</p>
              </div>
            )}
          </div>

          {/* Video Controls & Info */}
          <div className="bg-card border-t">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Lesson Info
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'description'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Course Description
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
              {/* Lesson Info Tab */}
              {activeTab === 'overview' && currentLesson && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        {currentLesson.moduleName}
                      </Badge>
                      <h2 className="text-xl font-bold mb-2">
                        {currentLesson.title}
                      </h2>
                      {/* ✅ REMOVED: No description shown anymore */}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleMarkComplete}
                        disabled={isLessonCompleted || marking}
                        size="sm"
                        className={
                          isLessonCompleted
                            ? 'bg-accent-600 hover:bg-accent-700'
                            : ''
                        }
                      >
                        {marking ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {isLessonCompleted ? 'Completed' : 'Complete'}
                      </Button>
                      <Button
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === allLessons.length - 1}
                        size="sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Description Tab */}
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold mb-3">About This Course</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {courseData.description || 'No description available'}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Modules</p>
                      <p className="text-2xl font-bold">{courseData.modules?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Lessons</p>
                      <p className="text-2xl font-bold">{allLessons.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold">{courseData.completedLessons || 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-card border-l overflow-y-auto animate-slide-in-right">
            <div className="p-4">
              {/* Progress Card */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-semibold">
                      {courseData.progress}%
                    </span>
                  </div>
                  <Progress value={courseData.progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {courseData.completedLessons} of {allLessons.length} lessons completed
                  </p>
                </CardContent>
              </Card>

              <h3 className="font-bold mb-4">Course Content</h3>

              {/* Modules & Lessons */}
              <div className="space-y-4">
                {courseData.modules?.map((module, moduleIndex) => (
                  <div key={module._id || moduleIndex}>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2 px-2">
                      {moduleIndex + 1}. {module.title}
                    </h4>
                    <div className="space-y-1">
                      {module.lessons?.map((lesson) => {
                        const lessonGlobalIndex = allLessons.findIndex(
                          (l) => l._id === lesson._id
                        );
                        const isActive = lessonGlobalIndex === currentLessonIndex;
                        const isCompleted = courseData.completedLessonIds?.includes(lesson._id);

                        return (
                          <button
                            key={lesson._id}
                            onClick={() => handleLessonSelect(lessonGlobalIndex)}
                            className={`w-full text-left p-3 rounded-lg transition-all border ${
                              isActive
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card hover:bg-muted border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-accent-600" />
                                ) : isActive ? (
                                  <PlayCircle className="h-5 w-5" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isActive ? '' : 'text-foreground'}`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-xs mt-1 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;