import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Star, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Calendar, 
  ArrowRight,
  Clock,
  CheckCircle,
  Lock,
  Play,
  Video,
  Trophy,
  FileText,
  PenTool,
  Brain,
  Target,
  Zap,
  Crown,
  Flame,
  Download,
  Upload,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../lib/store';
import { Week, Lesson, Quiz, Task, StudentProgress } from '../../types';
import youngCEOProgram from '../../lib/courseProgramData';
import { useUserProgress } from '../../contexts/UserProgressContext';

interface YoungCEOProgramProps {
  onLessonSelect?: (lesson: Lesson, week: Week) => void;
}

export default function YoungCEOProgram({ onLessonSelect }: YoungCEOProgramProps) {
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTask, setShowTask] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { progress, completeLesson, completeQuiz, completeTask } = useUserProgress();

  // Calculate current week based on completed lessons
  const getCurrentWeekNumber = () => {
    const completedLessonsCount = progress.completedLessons.length;
    const lessonsPerWeek = 5;
    const currentWeek = Math.floor(completedLessonsCount / lessonsPerWeek) + 1;
    return Math.min(currentWeek, 13); // Cap at week 13
  };

  // Get current week based on progress
  const getCurrentWeek = () => {
    const currentWeekNumber = getCurrentWeekNumber();
    return youngCEOProgram.weeks.find(week => week.weekNumber === currentWeekNumber) || youngCEOProgram.weeks[0];
  };

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson, week: Week) => {
    const currentWeekNumber = getCurrentWeekNumber();
    
    // Always allow access to first lesson of week 1 for new users
    if (week.weekNumber === 1 && lesson.order === 1) return true;
    
    // Allow access to weeks that are unlocked based on progress
    if (week.weekNumber <= currentWeekNumber) {
      // In current or previous weeks, unlock lessons progressively
      if (week.weekNumber < currentWeekNumber) return true; // All lessons in completed weeks
      
      // In current week, unlock lessons based on previous completions
      const weekLessons = week.lessons.slice(0, lesson.order);
      const completedInWeek = weekLessons.filter(l => progress.completedLessons.includes(l.id)).length;
      
      // Unlock next lesson if previous one is completed (or first lesson)
      return lesson.order === 1 || completedInWeek >= lesson.order - 1;
    }
    
    return false;
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  // Calculate week progress
  const calculateWeekProgress = (week: Week) => {
    const totalItems = week.lessons.length + 1 + 1; // lessons + quiz + task
    let completedItems = 0;
    
    week.lessons.forEach(lesson => {
      if (isLessonCompleted(lesson.id)) completedItems++;
    });
    
    if (progress.completedQuizzes.includes(week.quiz.id)) completedItems++;
    if (progress.completedTasks.includes(week.task.id)) completedItems++;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  // Get next available lesson
  const getNextLesson = () => {
    const currentWeekNumber = getCurrentWeekNumber();
    
    for (const week of youngCEOProgram.weeks) {
      if (week.weekNumber > currentWeekNumber) continue;
      
      for (const lesson of week.lessons) {
        if (!isLessonCompleted(lesson.id) && isLessonUnlocked(lesson, week)) {
          return { lesson, week };
        }
      }
    }
    return null;
  };

  // Handle lesson completion - now uses progress context
  const handleLessonComplete = (lessonId: string, weekNumber: number) => {
    completeLesson(lessonId, weekNumber);
  };

  // Handle quiz completion - now uses progress context
  const handleQuizComplete = (quizId: string, score: number) => {
    const quiz = youngCEOProgram.weeks.find(w => w.quiz.id === quizId)?.quiz;
    const xpEarned = quiz ? quiz.xpReward : 5;
    completeQuiz(quizId, score, xpEarned);
  };

  // Handle task completion - now uses progress context
  const handleTaskComplete = (taskId: string) => {
    const task = youngCEOProgram.weeks.find(w => w.task.id === taskId)?.task;
    const xpEarned = task ? task.xpReward : 5;
    completeTask(taskId, xpEarned);
  };

  // Get badges earned
  const getEarnedBadges = () => {
    return youngCEOProgram.badges.filter(badge => progress.badges.includes(badge.id));
  };

  const nextLesson = getNextLesson();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="h-8 w-8 text-yellow-300" />
                <h1 className="text-4xl font-bold">90-Day Young CEO Program</h1>
              </div>
              <p className="text-xl text-purple-100 mb-6 max-w-2xl">
                Transform your ideas into reality! Join thousands of young entrepreneurs on an amazing 90-day journey to becoming a Young CEO.
              </p>
              
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">Total XP</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.totalXP.toLocaleString()}</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-medium">Current Week</span>
                  </div>
                  <p className="text-2xl font-bold">{getCurrentWeekNumber()} / 13</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-300" />
                    <span className="text-sm font-medium">Learning Streak</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.currentStreak} days</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">Badges</span>
                  </div>
                  <p className="text-2xl font-bold">{progress.badges.length}</p>
                </div>
              </div>
            </div>
            
            {/* Next Lesson CTA */}
            {nextLesson && (
              <div className="bg-white rounded-2xl p-6 shadow-lg min-w-[300px]">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Continue Learning</h3>
                <p className="text-gray-600 mb-4">{nextLesson.lesson.title}</p>
                <button
                  onClick={() => onLessonSelect?.(nextLesson.lesson, nextLesson.week)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {getEarnedBadges().length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Your Achievements
          </h2>
          <div className="flex flex-wrap gap-3">
            {getEarnedBadges().map((badge) => (
              <div key={badge.id} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="font-bold text-sm">{badge.name}</p>
                <p className="text-xs opacity-90">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Progress Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          Your Learning Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {youngCEOProgram.weeks.map((week) => {
            const weekProgress = calculateWeekProgress(week);
            const currentWeekNumber = getCurrentWeekNumber();
            const isCurrentWeek = week.weekNumber === currentWeekNumber;
            const isCompleted = weekProgress === 100;
            const isLocked = week.weekNumber > currentWeekNumber;
            
            return (
              <div
                key={week.id}
                onClick={() => !isLocked && setSelectedWeek(selectedWeek?.id === week.id ? null : week)}
                className={`relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                  isCurrentWeek 
                    ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200' 
                    : isCompleted
                    ? 'border-green-300 hover:shadow-md'
                    : isLocked
                    ? 'border-gray-200 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {/* Week Status Indicator */}
                <div className="absolute top-4 right-4">
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : isCurrentWeek ? (
                    <div className="h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{week.weekNumber}</span>
                    </div>
                  ) : isLocked ? (
                    <Lock className="h-6 w-6 text-gray-400" />
                  ) : (
                    <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-bold">{week.weekNumber}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Week {week.weekNumber}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{week.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{week.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">Progress</span>
                    <span className="text-xs font-bold text-gray-700">{weekProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : isCurrentWeek ? 'bg-indigo-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${weekProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Week Theme */}
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">{week.theme}</span>
                </div>

                {/* Expand Indicator */}
                {selectedWeek?.id === week.id && (
                  <div className="absolute bottom-2 right-2">
                    <ChevronRight className="h-5 w-5 text-indigo-500 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Week Details */}
      {selectedWeek && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Week {selectedWeek.weekNumber}: {selectedWeek.title}</h2>
              <p className="text-gray-600 mt-2">{selectedWeek.description}</p>
            </div>
            <button
              onClick={() => setSelectedWeek(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-400 rotate-90" />
            </button>
          </div>

          {/* Lessons Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-indigo-600" />
              Lessons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedWeek.lessons.map((lesson, index) => {
                const isUnlocked = isLessonUnlocked(lesson, selectedWeek);
                const isCompleted = isLessonCompleted(lesson.id);
                
                return (
                  <div
                    key={lesson.id}
                    onClick={() => isUnlocked && onLessonSelect?.(lesson, selectedWeek)}
                    className={`bg-gray-50 rounded-xl p-4 transition-all duration-200 ${
                      isUnlocked ? 'cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-green-500 text-white' : 
                          isUnlocked ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration} min</p>
                        </div>
                      </div>
                      {!isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{lesson.description}</p>
                    
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Video className="h-3 w-3" />
                        Video
                      </div>
                      {lesson.pdfUrl && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FileText className="h-3 w-3" />
                          PDF
                        </div>
                      )}
                      {lesson.pptUrl && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FileText className="h-3 w-3" />
                          PPT
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz and Task */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quiz */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Weekly Quiz</h3>
                {progress.completedQuizzes.includes(selectedWeek.quiz.id) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{selectedWeek.quiz.title}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {selectedWeek.quiz.questions.length} questions • +{selectedWeek.quiz.xpReward} XP
                </div>
                <button
                  onClick={() => setShowQuiz(true)}
                  disabled={progress.completedQuizzes.includes(selectedWeek.quiz.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {progress.completedQuizzes.includes(selectedWeek.quiz.id) ? 'Completed' : 'Take Quiz'}
                </button>
              </div>
            </div>

            {/* Task */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <PenTool className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Weekly Task</h3>
                {progress.completedTasks.includes(selectedWeek.task.id) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{selectedWeek.task.title}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {selectedWeek.task.type} • +{selectedWeek.task.xpReward} XP
                </div>
                <button
                  onClick={() => setShowTask(true)}
                  disabled={progress.completedTasks.includes(selectedWeek.task.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {progress.completedTasks.includes(selectedWeek.task.id) ? 'Completed' : 'Start Task'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">AI Learning Assistant</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Need help with this week's content? Ask our AI assistant any questions about the lessons, concepts, or assignments.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              Ask Question
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Lessons Completed</h3>
              <p className="text-gray-600">{progress.completedLessons.length} / {youngCEOProgram.weeks.reduce((total, week) => total + week.lessons.length, 0)}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${(progress.completedLessons.length / youngCEOProgram.weeks.reduce((total, week) => total + week.lessons.length, 0)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quizzes Completed</h3>
              <p className="text-gray-600">{progress.completedQuizzes.length} / {youngCEOProgram.weeks.length}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${(progress.completedQuizzes.length / youngCEOProgram.weeks.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <PenTool className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tasks Completed</h3>
              <p className="text-gray-600">{progress.completedTasks.length} / {youngCEOProgram.weeks.length}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-purple-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${(progress.completedTasks.length / youngCEOProgram.weeks.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && selectedWeek && (
        <QuizModal
          quiz={selectedWeek.quiz}
          onComplete={(score) => {
            handleQuizComplete(selectedWeek.quiz.id, score);
            setShowQuiz(false);
          }}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Task Modal */}
      {showTask && selectedWeek && (
        <TaskModal
          task={selectedWeek.task}
          onComplete={() => {
            handleTaskComplete(selectedWeek.task.id);
            setShowTask(false);
          }}
          onClose={() => setShowTask(false)}
        />
      )}
    </div>
  );
}

// Quiz Modal Component
interface QuizModalProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onClose: () => void;
}

function QuizModal({ quiz, onComplete, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and show results
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        answer === quiz.questions[index].correct
      ).length;
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    onComplete(score);
  };

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correct
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '😅'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-4">
              You scored {correctAnswers} out of {quiz.questions.length} questions correctly
            </p>
            <div className="text-3xl font-bold text-indigo-600 mb-6">{score}%</div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Review
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Complete (+{quiz.xpReward} XP)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>+{quiz.xpReward} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Modal Component
interface TaskModalProps {
  task: Task;
  onComplete: () => void;
  onClose: () => void;
}

function TaskModal({ task, onComplete, onClose }: TaskModalProps) {
  const [submission, setSubmission] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (task.type === 'upload' && !uploadedFile) return;
    if (task.type === 'text' && !submission.trim()) return;
    
    onComplete();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">{task.description}</p>
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <p className="text-blue-800">{task.instructions}</p>
          </div>
        </div>

        {/* Submission Area */}
        <div className="mb-8">
          {task.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Submission
              </label>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                rows={8}
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your response here..."
              />
            </div>
          )}

          {task.type === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Your Work
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                {uploadedFile ? (
                  <div className="text-green-600">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">File uploaded successfully</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, or image files</p>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {task.type === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your project..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Project Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload your project files</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submission Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Reward: +{task.xpReward} XP
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                (task.type === 'text' && !submission.trim()) ||
                (task.type === 'upload' && !uploadedFile) ||
                (task.type === 'project' && (!submission.trim() || !uploadedFile))
              }
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 