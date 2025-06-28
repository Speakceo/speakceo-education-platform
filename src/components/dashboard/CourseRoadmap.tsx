import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  Star, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Users, 
  Calendar, 
  ArrowRight,
  Brain,
  Mic,
  DollarSign,
  TrendingUp,
  Rocket,
  Clock,
  CheckCircle,
  Lock,
  Play,
  BrainCircuit,
  Video,
  Trophy,
  FileText,
  PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../lib/store';
import AILearningCoach from './AILearningCoach';
import ProgressBar from '../ui/ProgressBar';
import MyStartup from './MyStartup';
import LessonViewer from './LessonViewer';
import courseDataService, { CourseSection, CourseModule, CourseSlide } from '../../lib/courseDataService';

// LessonContent type definition from LessonViewer.tsx
type LessonContentType = 'video' | 'pdf' | 'ppt' | 'link' | 'text';

interface LessonContent {
  id: string;
  title: string;
  type: LessonContentType;
  url?: string;
  content?: string;
  order: number;
}

export default function CourseRoadmap() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);
  const [activeSlides, setActiveSlides] = useState<LessonContent[] | null>(null);
  const [activeLessonTitle, setActiveLessonTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseSection[]>([]);
  const [userData, setUserData] = useState({
    completedLessons: {} as Record<string, boolean>,
    overallProgress: 25, // Default progress percentage (can be adjusted)
    learningStreak: 5,  // Default streak (can be adjusted)
  });
  
  const navigate = useNavigate();
  const { user } = useUserStore();

  // Load course data
  useEffect(() => {
    setIsLoading(true);
    
    // Small delay to simulate loading
    setTimeout(() => {
      // Load course data from the service
      const loadedCourseData = courseDataService.loadCourseData();
      setCourseData(loadedCourseData);
      
      // Initialize with some completed lessons
      const randomCompletedLessons: Record<string, boolean> = {};
      
      // Mark some lessons as completed (around 25% for the default progress)
      let totalLessons = 0;
      let completedCount = 0;
      
      loadedCourseData.forEach(section => {
        section.modules.forEach(module => {
          if (module.slides) {
            module.slides.forEach(slide => {
              totalLessons++;
              // Mark some lessons as completed
              if (Math.random() < 0.25) {
                randomCompletedLessons[slide.id] = true;
                completedCount++;
              }
            });
          }
        });
      });
      
      // Calculate actual progress percentage
      const actualProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      
      setUserData({
        completedLessons: randomCompletedLessons,
        overallProgress: actualProgress,
        learningStreak: 5
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSectionHover = (sectionId: string | null) => {
    setHoveredSection(sectionId);
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedModule(selectedModule === sectionId ? null : sectionId);
  };

  // Helper function to validate slide type
  const validateSlideType = (type: string): LessonContentType => {
    const validTypes: LessonContentType[] = ['video', 'pdf', 'ppt', 'link', 'text'];
    return validTypes.includes(type as LessonContentType) 
      ? (type as LessonContentType) 
      : 'text';
  };

  const handleModuleClick = (module: CourseModule, sectionIndex: number) => {
    try {
      if (!module.slides || !Array.isArray(module.slides)) {
        setActiveLessonTitle(module.title);
        setActiveSlides(null);
        return;
      }
      
      // Create properly typed slides
      const typedSlides: LessonContent[] = module.slides.map((slide) => ({
        id: String(slide.id || Math.random().toString(36).substring(2)),
        title: String(slide.title || 'Untitled'),
        // Validate the type is one of the allowed values
        type: validateSlideType(slide.type),
        url: slide.url,
        content: slide.content,
        order: Number(slide.order || 0)
      }));
      
      // Set the active slides and title
      setActiveLessonTitle(module.title);
      setActiveSlides(typedSlides);
    } catch (err) {
      console.error('Error processing slides:', err);
      // Fallback to a simple approach if there's an error
      setActiveLessonTitle(module.title);
      setActiveSlides(null);
    }
  };

  const handleMarkLessonComplete = (lessonId: string) => {
    setUserData(prev => {
      const updatedCompletedLessons = {
        ...prev.completedLessons,
        [lessonId]: true
      };
      
      // Calculate new progress
      const newProgress = courseDataService.calculateUserProgress(updatedCompletedLessons);
      
      return {
        ...prev,
        completedLessons: updatedCompletedLessons,
        overallProgress: newProgress
      };
    });
  };

  // Mock progress functions using our courseDataService
  const getOverallProgress = () => userData.overallProgress;
  const getLearningStreak = () => userData.learningStreak;
  const getNextLesson = () => courseDataService.getNextLesson(userData.completedLessons);

  // Map the course data to the user's progress
  const mappedLearningPath = courseData.map((section, index) => {
    // Calculate progress based on user's overall progress
    let progress = 0;
    let status: 'completed' | 'in-progress' | 'locked' = 'locked';
    
    // Simple logic: each section represents 100/totalSections % of total progress
    const sectionThreshold = (100 / courseData.length) * (index + 1);
    const prevSectionThreshold = (100 / courseData.length) * index;
    
    if (userData.overallProgress >= sectionThreshold) {
      progress = 100;
      status = 'completed';
    } else if (userData.overallProgress > prevSectionThreshold) {
      // Calculate progress within this section
      progress = Math.round(((userData.overallProgress - prevSectionThreshold) / (sectionThreshold - prevSectionThreshold)) * 100);
      status = 'in-progress';
    } else if (index === 0 || userData.overallProgress >= (100 / courseData.length) * (index - 1)) {
      // First section or previous section has some progress
      status = 'in-progress';
      progress = 0;
    }
    
    return {
      ...section,
      id: `section-${index}`,
      progress,
      status
    };
  });

  const nextLesson = getNextLesson();

  const getTotalXP = () => {
    try {
      // Calculate XP based on overall progress
      // A simple formula: 10 XP per % of progress
      const overallProgressValue = typeof userData.overallProgress === 'number' ? userData.overallProgress : 0;
      return Math.max(0, Math.round(overallProgressValue * 10));
    } catch (err) {
      console.error('Error calculating XP:', err);
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-gray-600">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Updated for 90-Day Startup Journey */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🚀 Your 90-Day Startup Journey</h2>
            <p className="text-gray-500 mt-1">Learn. Build. Launch. One day at a time.</p>
          </div>
          <div className="flex flex-row items-center space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{userData.overallProgress}%</p>
              <p className="text-sm text-gray-500">Progress</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">Day {Math.floor(userData.overallProgress * 0.9)}</p>
              <p className="text-sm text-gray-500">of 90</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center h-10 w-10 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
              title="Refresh course data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white p-1 rounded-md">
                <Star className="h-5 w-5" />
              </div>
              <span className="ml-2 font-medium text-gray-800">XP Progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Bronze</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-xs text-gray-600">Silver</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-gray-600">Gold</span>
              </div>
            </div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center"
              style={{ width: `${userData.overallProgress}%` }}
            >
              <span className="mx-auto text-xs font-medium text-white">{getTotalXP()} XP</span>
            </div>
          </div>
        </div>

        {/* My Startup Section */}
        <MyStartup />

        {/* 90-Day Calendar Progress Tracker */}
        <div className="mt-8 bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">90-Day Calendar</h3>
          <div className="grid grid-cols-9 gap-1 md:gap-2">
            {Array.from({ length: 90 }, (_, i) => {
              // Calculate completion based on overall progress
              const isDayCompleted = i < Math.floor(userData.overallProgress * 0.9);
              const isCurrentDay = i === Math.floor(userData.overallProgress * 0.9);
              const dayClass = isDayCompleted 
                ? 'bg-green-100 text-green-800 border-green-300' 
                : isCurrentDay 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : 'bg-gray-50 text-gray-400 border-gray-200';
              
              return (
                <div 
                  key={i} 
                  className={`aspect-square flex items-center justify-center rounded-md border ${dayClass} text-xs md:text-sm font-medium`}
                >
                  {i + 1}
                  {isDayCompleted && (
                    <CheckCircle className="h-3 w-3 absolute" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Timeline */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Path</h3>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" />
            <div className="space-y-8">
              {mappedLearningPath.map((section, index) => {
                // Dynamically get the icon component
                const IconComponent = section.icon === 'Target' ? Target :
                                       section.icon === 'Sparkles' ? Sparkles :
                                       section.icon === 'Users' ? Users :
                                       section.icon === 'Rocket' ? Rocket :
                                       section.icon === 'Star' ? Star :
                                       Target; // Default fallback

                return (
                  <div
                    key={index}
                    className="relative flex items-start space-x-4 cursor-pointer"
                    onClick={() => handleSectionClick(section.id)}
                    onMouseEnter={() => handleSectionHover(section.id)}
                    onMouseLeave={() => handleSectionHover(null)}
                  >
                    <div className={`
                      flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center
                      ${section.status === 'completed' ? 'bg-green-100' : 
                        section.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      {section.status === 'completed' ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : section.status === 'locked' ? (
                        <Lock className="h-8 w-8 text-gray-400" />
                      ) : (
                        <IconComponent className={`h-8 w-8 ${
                          section.status === 'in-progress' ? 'text-blue-500' : 'text-gray-500'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          section.status === 'completed' ? 'bg-green-100 text-green-800' :
                          section.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {section.status === 'completed' ? 'Completed' :
                           section.status === 'in-progress' ? 'In Progress' :
                           'Locked'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{section.description}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Week {section.weeks}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Target className="h-4 w-4 mr-1" />
                            {section.modules.length} modules
                          </div>
                        </div>
                        {section.status !== 'locked' && (
                          <div className="flex items-center">
                            <div className="w-32">
                              <ProgressBar 
                                progress={section.progress} 
                                size="sm"
                                showLabel={false}
                                color={section.status === 'completed' ? 'green' : 'indigo'}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Module Details */}
                      {(hoveredSection === section.id || selectedModule === section.id) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Modules</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.modules.map((module, moduleIndex) => {
                              // Dynamically get the module icon component
                              const ModuleIconComponent = module.icon === 'Trophy' ? Trophy :
                                                          module.icon === 'BrainCircuit' ? BrainCircuit :
                                                          module.icon === 'Target' ? Target :
                                                          module.icon === 'Mic' ? Mic :
                                                          module.icon === 'Star' ? Star :
                                                          module.icon === 'Users' ? Users :
                                                          module.icon === 'BookOpen' ? BookOpen :
                                                          FileText; // Default fallback

                              return (
                                <div
                                  key={moduleIndex}
                                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleClick(module, index);
                                  }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`rounded-lg p-2 bg-gradient-to-r ${section.color}`}>
                                      <ModuleIconComponent className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{module.title}</p>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {module.duration}
                                        {module.slides && (
                                          <span className="ml-2 text-indigo-600 flex items-center">
                                            <FileText className="h-3 w-3 mr-1" />
                                            {module.slides.length} slides
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {section.status !== 'locked' && (
                                      section.status === 'completed' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        module.slides ? (
                                          <ArrowRight className="h-5 w-5 text-indigo-500" />
                                        ) : (
                                          <ArrowRight className="h-5 w-5 text-gray-400" />
                                        )
                                      )
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Skills and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
          {nextLesson ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="rounded-xl bg-green-500 p-3">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{nextLesson.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    Next in your journey
                  </div>
                </div>
              </div>
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => {
                  // Find the module that contains this lesson
                  for (const section of courseData) {
                    for (const module of section.modules) {
                      if (module.title === nextLesson.title) {
                        setActiveLessonTitle(module.title);
                        
                        // Process slides using the validateSlideType function before setting them
                        if (module.slides && Array.isArray(module.slides)) {
                          const typedSlides: LessonContent[] = module.slides.map((slide) => ({
                            id: String(slide.id || Math.random().toString(36).substring(2)),
                            title: String(slide.title || 'Untitled'),
                            type: validateSlideType(slide.type),
                            url: slide.url,
                            content: slide.content,
                            order: Number(slide.order || 0)
                          }));
                          setActiveSlides(typedSlides);
                        } else {
                          setActiveSlides(null);
                        }
                        return;
                      }
                    }
                  }
                }}
              >
                <Play className="h-4 w-4" />
                <span>Start Now</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              You've completed all available lessons! Check back soon for new content.
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* AI Coach */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">AI Learning Coach</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Need help with your journey? Get personalized guidance and tips from your AI coach.
            </p>
            <button 
              onClick={() => setShowAICoach(true)}
              className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Chat with Coach
            </button>
          </div>
        </div>
      </div>

      {/* AI Learning Coach Modal */}
      {showAICoach && <AILearningCoach onClose={() => setShowAICoach(false)} />}

      {/* Lesson Viewer Modal */}
      {activeSlides && (
        <LessonViewer 
          lessonTitle={activeLessonTitle}
          content={activeSlides}
          onClose={() => setActiveSlides(null)}
          onComplete={() => {
            // Mark the first slide as completed for demo purposes
            if (activeSlides.length > 0) {
              handleMarkLessonComplete(activeSlides[0].id);
            }
            setActiveSlides(null);
          }}
        />
      )}
    </div>
  );
}