import React, { useState } from 'react';
import { BookOpen, Crown, Star, ArrowRight } from 'lucide-react';
import YoungCEOProgram from './YoungCEOProgram';
import CourseLessonViewer from './CourseLessonViewer';
import { Lesson, Week } from '../../types';
import youngCEOProgram from '../../lib/courseProgramData';
import { useUserProgress } from '../../contexts/UserProgressContext';

type ViewMode = 'overview' | 'course' | 'lesson';

export default function MyCourses() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  
  // Use progress context for real-time updates
  const { progress, completeLesson, getTotalProgress } = useUserProgress();

  const handleLessonSelect = (lesson: Lesson, week: Week) => {
    setSelectedLesson(lesson);
    setSelectedWeek(week);
    setCurrentView('lesson');
  };

  const handleBackToProgram = () => {
    setCurrentView('course');
    setSelectedLesson(null);
    setSelectedWeek(null);
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedLesson(null);
    setSelectedWeek(null);
  };

  const getCurrentLessonIndex = () => {
    if (!selectedLesson || !selectedWeek) return { current: 0, total: 0 };
    
    const lessonIndex = selectedWeek.lessons.findIndex(l => l.id === selectedLesson.id);
    return {
      current: lessonIndex,
      total: selectedWeek.lessons.length
    };
  };

  const getNextLesson = () => {
    if (!selectedLesson || !selectedWeek) return null;
    
    const { current } = getCurrentLessonIndex();
    
    // Check if there's a next lesson in current week
    if (current < selectedWeek.lessons.length - 1) {
      return {
        lesson: selectedWeek.lessons[current + 1],
        week: selectedWeek
      };
    }
    
    // Check if there's a next week
    const currentWeekIndex = youngCEOProgram.weeks.findIndex(w => w.id === selectedWeek.id);
    if (currentWeekIndex < youngCEOProgram.weeks.length - 1) {
      const nextWeek = youngCEOProgram.weeks[currentWeekIndex + 1];
      return {
        lesson: nextWeek.lessons[0],
        week: nextWeek
      };
    }
    
    return null;
  };

  const getPreviousLesson = () => {
    if (!selectedLesson || !selectedWeek) return null;
    
    const { current } = getCurrentLessonIndex();
    
    // Check if there's a previous lesson in current week
    if (current > 0) {
      return {
        lesson: selectedWeek.lessons[current - 1],
        week: selectedWeek
      };
    }
    
    // Check if there's a previous week
    const currentWeekIndex = youngCEOProgram.weeks.findIndex(w => w.id === selectedWeek.id);
    if (currentWeekIndex > 0) {
      const prevWeek = youngCEOProgram.weeks[currentWeekIndex - 1];
      return {
        lesson: prevWeek.lessons[prevWeek.lessons.length - 1],
        week: prevWeek
      };
    }
    
    return null;
  };

  const handleNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      setSelectedLesson(next.lesson);
      setSelectedWeek(next.week);
    }
  };

  const handlePreviousLesson = () => {
    const previous = getPreviousLesson();
    if (previous) {
      setSelectedLesson(previous.lesson);
      setSelectedWeek(previous.week);
    }
  };

  const handleLessonComplete = () => {
    if (selectedLesson && selectedWeek) {
      // Mark lesson as complete in progress context
      completeLesson(selectedLesson.id, selectedWeek.weekNumber);
      console.log('Lesson completed:', selectedLesson.id);
    }
  };

  if (currentView === 'lesson' && selectedLesson && selectedWeek) {
    return (
      <CourseLessonViewer
        lesson={selectedLesson}
        week={selectedWeek}
        onComplete={handleLessonComplete}
        onNext={handleNextLesson}
        onPrevious={handlePreviousLesson}
        hasNext={getNextLesson() !== null}
        hasPrevious={getPreviousLesson() !== null}
        onBack={handleBackToProgram}
      />
    );
  }

  if (currentView === 'course') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={handleBackToOverview}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ← Back to My Courses
          </button>
        </div>
        <YoungCEOProgram onLessonSelect={handleLessonSelect} />
      </div>
    );
  }

  // Overview page
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>
        <p className="text-xl text-gray-600">
          Continue your entrepreneurial journey with our comprehensive learning programs
        </p>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* 90-Day Young CEO Program */}
        <div 
          onClick={() => setCurrentView('course')}
          className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="absolute top-4 right-4">
            <Crown className="h-8 w-8 text-yellow-300" />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium text-purple-100">PREMIUM COURSE</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">90-Day Young CEO Program</h2>
            <p className="text-purple-100 text-sm leading-relaxed">
              Transform your ideas into reality with our comprehensive 13-week entrepreneurship program designed specifically for young innovators.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-100">Progress</span>
              <span className="font-semibold">{getTotalProgress()}% Complete</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-100">Lessons Completed</span>
              <span className="font-semibold">{progress.completedLessons.length} / 65</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-100">Current Level</span>
              <span className="font-semibold">Level {progress.level}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-100">Total XP</span>
              <span className="font-semibold">{progress.totalXP.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-purple-100 mb-2">
              <span>Course Progress</span>
              <span>{getTotalProgress()}%</span>
            </div>
            <div className="w-full bg-purple-400/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-orange-300 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${getTotalProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-100">Your Progress</span>
              <span className="text-sm font-bold">25%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-semibold">Week 1 of 13</div>
              <div className="text-purple-100">Continue Learning</div>
            </div>
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-colors">
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              Coming Soon
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Advanced Business Strategy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Take your business skills to the next level with advanced strategies, financial planning, and scaling techniques.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-semibold text-gray-700">8 Weeks</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Level</span>
              <span className="font-semibold text-gray-700">Intermediate</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Prerequisites</span>
              <span className="font-semibold text-gray-700">Young CEO Program</span>
            </div>
          </div>

          <button 
            disabled
            className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-xl font-medium cursor-not-allowed"
          >
            Available After Completion
          </button>
        </div>

        {/* Add New Course Placeholder */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">More Courses Coming</h3>
            <p className="text-sm">
              We're constantly adding new courses to help you grow as an entrepreneur. Stay tuned!
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-500">Lessons Completed</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">125</div>
            <div className="text-sm text-gray-500">XP Earned</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-500">Badges Earned</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
} 