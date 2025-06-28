import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  Star, 
  Award, 
  MessageSquare, 
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Lock,
  Play,
  BrainCircuit,
  Sparkles,
  Video,
  Clock,
  Trophy,
  Mic,
  PenTool,
  DollarSign,
  Rocket,
  ChevronRight,
  X,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Presentation
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import AILearningCoach from './AILearningCoach';
import { useProgressStore, useUserStore } from '../../lib/store';
import ProgressBar from '../ui/ProgressBar';
import MyStartup from './MyStartup';
import LessonViewer from './LessonViewer';
import { setupCourseContentSubscriptions } from '../../lib/stores/progressStore';

export default function LearningJourney() {
  const [step, setStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSlides, setActiveSlides] = useState<{
    id: string;
    title: string;
    type: string;
    url?: string;
    content?: string;
    order: number;
  }[] | null>(null);
  const [activeLessonTitle, setActiveLessonTitle] = useState<string>('');
  
  const { user } = useUserStore();
  const { 
    modules, 
    userProgress, 
    fetchUserProgress,
    getModuleProgress,
    getOverallProgress,
    getNextLesson,
    getLearningStreak,
    refreshModules
  } = useProgressStore();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchUserProgress(user.id);
      
      // Refresh modules to ensure we have the latest data
      refreshModules();
      
      // Set up real-time subscriptions
      const unsubscribe = setupCourseContentSubscriptions();
      
      // Clean up subscriptions on unmount
      return () => {
        unsubscribe();
      };
    }
  }, [user, fetchUserProgress, refreshModules]);

  // Check if we have module data from navigation
  useEffect(() => {
    if (location.state?.moduleData) {
      const moduleData = location.state.moduleData;
      setActiveLessonTitle(moduleData.title);
      setActiveSlides(moduleData.slides || null);
      
      // Clear the location state to prevent reloading on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const chartOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#6366f1'],
    fill: {
      opacity: 0.5
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['Leadership', 'Public Speaking', 'Financial Literacy', 'Marketing', 'Business Strategy']
    }
  };

  const series = [{
    name: 'Skill Level',
    data: [65, 45, 30, 20, 40]
  }];
  
  const nextLesson = getNextLesson();
  const overallProgress = getOverallProgress();
  const learningStreak = getLearningStreak();

  const handleLessonComplete = () => {
    // In a real implementation, this would update the user's progress
    setActiveSlides(null);
    
    // Show success message or update progress
    alert('Lesson completed! You earned points for this lesson.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">90-Day CEO Journey</h2>
            <p className="text-gray-500 mt-1">Your path to entrepreneurial success</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{overallProgress}%</p>
              <p className="text-sm text-gray-500">Overall Progress</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">Day {Math.floor(overallProgress * 0.9)}</p>
              <p className="text-sm text-gray-500">of 90</p>
            </div>
          </div>
        </div>

        {/* My Startup Section */}
        <MyStartup />

        {/* Module Timeline */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Path</h3>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" />
            <div className="space-y-8">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="relative flex items-start space-x-4 cursor-pointer"
                  onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                  onMouseEnter={() => setHoveredSection(module.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className={`
                    flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center
                    ${getModuleProgress(module.id) >= 100 ? 'bg-green-100' : 
                      getModuleProgress(module.id) > 0 ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    {getModuleProgress(module.id) >= 100 ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : getModuleProgress(module.id) === 0 && index > 0 ? (
                      <Lock className="h-8 w-8 text-gray-400" />
                    ) : (
                      <Target className={`h-8 w-8 ${
                        getModuleProgress(module.id) > 0 ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                    )}
                  </div>

                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getModuleProgress(module.id) >= 100 ? 'bg-green-100 text-green-800' :
                        getModuleProgress(module.id) > 0 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getModuleProgress(module.id) >= 100 ? 'Completed' :
                         getModuleProgress(module.id) > 0 ? 'In Progress' :
                         'Not Started'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{module.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Week {index + 1}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Target className="h-4 w-4 mr-1" />
                          {module.lessons?.length || 0} lessons
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32">
                          <ProgressBar 
                            progress={getModuleProgress(module.id)} 
                            size="sm"
                            showLabel={false}
                            color={getModuleProgress(module.id) >= 100 ? 'green' : 'indigo'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lessons Details */}
                    {(hoveredSection === module.id || selectedModule === module.id) && module.lessons && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Lessons</h4>
                        <div className="space-y-3">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigate to lesson content
                                navigate('/dashboard/journey', { 
                                  state: { 
                                    moduleData: {
                                      ...lesson,
                                      sectionTitle: module.title
                                    }
                                  }
                                });
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="rounded-lg p-2 bg-indigo-100">
                                  {lesson.type === 'video' && <Video className="h-4 w-4 text-indigo-600" />}
                                  {lesson.type === 'document' && <FileText className="h-4 w-4 text-indigo-600" />}
                                  {lesson.type === 'quiz' && <BrainCircuit className="h-4 w-4 text-indigo-600" />}
                                  {lesson.type === 'assignment' && <FileText className="h-4 w-4 text-indigo-600" />}
                                  {lesson.type === 'ppt' && <Presentation className="h-4 w-4 text-indigo-600" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lesson.duration}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {userProgress.completedLessons[lesson.id] ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <ArrowRight className="h-5 w-5 text-indigo-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                  for (const module of modules) {
                    for (const lesson of module.lessons || []) {
                      if (lesson.id === nextLesson.lessonId) {
                        // Get lesson content
                        setActiveLessonTitle(lesson.title);
                        // Navigate to the lesson
                        navigate('/dashboard/journey', { 
                          state: { 
                            moduleData: {
                              ...lesson,
                              sectionTitle: module.title
                            }
                          }
                        });
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
          {/* Skill Radar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress</h3>
            <Chart
              options={chartOptions}
              series={series}
              type="radar"
              height={300}
            />
          </div>

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
          onComplete={handleLessonComplete}
        />
      )}
    </div>
  );
}