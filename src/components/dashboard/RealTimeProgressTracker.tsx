import React, { useEffect, useState } from 'react';
import { useRealTimeProgressStore } from '../../lib/stores/realTimeProgressStore';
import { useUserStore } from '../../lib/store';
import { 
  Zap, 
  Trophy, 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  BookOpen,
  CheckSquare,
  Brain,
  Award,
  Flame
} from 'lucide-react';

export default function RealTimeProgressTracker() {
  const { user } = useUserStore();
  const { 
    progress, 
    markLessonComplete, 
    markTaskComplete, 
    markQuizComplete,
    getProgressPercentage,
    getCurrentStreak,
    getTodayXP,
    getWeeklyXP,
    getCompletionStats
  } = useRealTimeProgressStore();

  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [showTestButtons, setShowTestButtons] = useState(true);

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString());
  }, [progress]);

  const handleLessonComplete = async () => {
    const lessonId = `lesson_${Date.now()}`;
    await markLessonComplete(lessonId, 50);
  };

  const handleTaskComplete = async () => {
    const taskId = `task_${Date.now()}`;
    await markTaskComplete(taskId, 100);
  };

  const handleQuizComplete = async () => {
    const quizId = `quiz_${Date.now()}`;
    const score = Math.floor(Math.random() * 40) + 60;
    await markQuizComplete(quizId, score, 75);
  };

  const completionStats = getCompletionStats();
  const progressPercentage = getProgressPercentage();
  const currentStreak = getCurrentStreak();
  const todayXP = getTodayXP();
  const weeklyXP = getWeeklyXP();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="h-6 w-6 text-indigo-600 mr-2" />
          Real-Time Progress
        </h3>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdate}
        </div>
      </div>

      {/* Real-time Progress Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total XP Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Zap className="h-8 w-8 text-indigo-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-900">
                {progress.totalXP.toLocaleString()}
              </div>
              <div className="text-xs text-indigo-600">Total XP</div>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Flame className="h-8 w-8 text-orange-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-900">
                {currentStreak}
              </div>
              <div className="text-xs text-orange-600">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Target className="h-8 w-8 text-green-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">
                {progressPercentage}%
              </div>
              <div className="text-xs text-green-600">Complete</div>
            </div>
          </div>
        </div>

        {/* Today's XP Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {todayXP}
              </div>
              <div className="text-xs text-blue-600">Today XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">
            {completionStats.completed} / {completionStats.total} activities
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{progress.completedLessons.length}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <BookOpen className="h-4 w-4 mr-1" />
            Lessons
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{progress.completedTasks.length}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <CheckSquare className="h-4 w-4 mr-1" />
            Tasks
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{progress.completedQuizzes.length}</div>
          <div className="text-sm text-gray-600 flex items-center justify-center">
            <Brain className="h-4 w-4 mr-1" />
            Quizzes
          </div>
        </div>
      </div>

      {/* Test Buttons for Demo */}
      {showTestButtons && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Test Real-time Updates:</h4>
            <button
              onClick={() => setShowTestButtons(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hide Test Buttons
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleLessonComplete}
              className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              +50 XP
            </button>
            <button
              onClick={handleTaskComplete}
              className="flex items-center justify-center p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              +100 XP
            </button>
            <button
              onClick={handleQuizComplete}
              className="flex items-center justify-center p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Brain className="h-4 w-4 mr-1" />
              +75 XP
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Click buttons above to see real-time progress updates!
          </div>
        </div>
      )}

      {/* Achievement Indicators */}
      {progress.achievements.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Recent Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {progress.achievements.slice(-3).map((achievement, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                <Trophy className="h-3 w-3 mr-1" />
                Achievement
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">This Week</h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">XP Earned:</span>
          <span className="font-semibold text-indigo-600">+{weeklyXP}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current Streak:</span>
          <span className="font-semibold text-orange-600">{currentStreak} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Daily Goal:</span>
          <span className="font-semibold text-green-600">{progress.dailyGoalProgress}/5</span>
        </div>
      </div>
    </div>
  );
} 