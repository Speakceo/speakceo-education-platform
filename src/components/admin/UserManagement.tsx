import React, { useState } from 'react';
import { UserPlus, Users, Settings, Save, RefreshCw, Crown, Star } from 'lucide-react';
import { useUserProgress } from '../../contexts/UserProgressContext';

interface NewUser {
  name: string;
  email: string;
  role: 'student' | 'admin';
  startAsDemo: boolean;
}

export default function UserManagement() {
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    role: 'student',
    startAsDemo: false
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  
  const { initializeNewUser, initializeExistingUser, resetProgress } = useUserProgress();

  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    setMessage('');

    try {
      // Simulate user creation (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Initialize user progress based on whether they should start as demo
      if (newUser.startAsDemo) {
        // Set demo flag in localStorage for this demo
        localStorage.setItem('isDemoUser', 'true');
        // Initialize with existing demo data
        initializeExistingUser({
          totalXP: 485,
          level: 4,
          badges: ['first-step', 'idea-generator', 'market-researcher'],
          completedLessons: [
            'lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-1-4', 'lesson-1-5',
            'lesson-2-1', 'lesson-2-2', 'lesson-2-3',
            'lesson-3-1', 'lesson-3-2'
          ],
          completedTasks: ['task-1-1', 'task-1-2', 'task-2-1'],
          completedQuizzes: ['quiz-week-1', 'quiz-week-2'],
          weeklyProgress: {
            '1': 100,
            '2': 100,
            '3': 40
          },
          currentStreak: 5,
          totalTimeSpent: 420,
          averageQuizScore: 85,
          tasksSubmittedThisWeek: 2,
          lessonsCompletedThisWeek: 3
        });
      } else {
        // Remove demo flag
        localStorage.removeItem('isDemoUser');
        // Initialize as new user with zero progress
        initializeNewUser();
      }

      setMessage(`User "${newUser.name}" created successfully! ${newUser.startAsDemo ? 'Started with demo progress.' : 'Starting fresh.'}`);
      setNewUser({ name: '', email: '', role: 'student', startAsDemo: false });
    } catch (error) {
      setMessage('Error creating user. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetCurrentUser = () => {
    if (confirm('Are you sure you want to reset current user progress? This cannot be undone.')) {
      localStorage.removeItem('isDemoUser');
      initializeNewUser();
      setMessage('Current user progress has been reset to zero.');
    }
  };

  const handleSetDemoMode = () => {
    if (confirm('Set current user as demo user with sample progress?')) {
      localStorage.setItem('isDemoUser', 'true');
      window.location.reload(); // Reload to apply demo state
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        {/* Current User Controls */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="h-6 w-6 text-gray-600" />
            Current User Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleResetCurrentUser}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to New User
            </button>
            <button
              onClick={handleSetDemoMode}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Set Demo Mode
            </button>
          </div>
        </div>

        {/* Create New User */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            Create New User
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter student's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'student' | 'admin' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newUser.startAsDemo}
                  onChange={(e) => setNewUser(prev => ({ ...prev, startAsDemo: e.target.checked }))}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Start with demo progress</span>
                  <p className="text-xs text-gray-500">User will start with sample completed lessons and XP</p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleCreateUser}
              disabled={isCreating || !newUser.name.trim() || !newUser.email.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create User
                </>
              )}
            </button>

            {message && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* User Setup Instructions */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Setup Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>New Users:</strong> Will start with 0 XP, no completed lessons, and access to the first lesson of Week 1.</p>
            <p><strong>Demo Users:</strong> Will start with sample progress (485 XP, completed lessons 1-2, some Week 3 progress).</p>
            <p><strong>Real-time Progress:</strong> All users will have access to the real-time progress tracking system.</p>
            <p><strong>Lesson Unlocking:</strong> Lessons unlock sequentially as users complete previous lessons.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 