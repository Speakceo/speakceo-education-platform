import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProgress {
  totalXP: number;
  level: number;
  badges: string[];
  completedLessons: string[];
  completedTasks: string[];
  completedQuizzes: string[];
  weeklyProgress: { [weekNumber: string]: number };
  currentStreak: number;
  lastActivityDate: string;
  totalTimeSpent: number; // in minutes
  averageQuizScore: number;
  tasksSubmittedThisWeek: number;
  lessonsCompletedThisWeek: number;
}

interface UserProgressContextType {
  progress: UserProgress;
  updateXP: (amount: number, source: string) => void;
  completeLesson: (lessonId: string, weekNumber: number) => void;
  completeTask: (taskId: string, xpAwarded: number) => void;
  completeQuiz: (quizId: string, score: number, xpAwarded: number) => void;
  addBadge: (badgeId: string) => void;
  updateTimeSpent: (minutes: number) => void;
  resetProgress: () => void;
  initializeNewUser: () => void;
  initializeExistingUser: (userData: Partial<UserProgress>) => void;
  getLevelProgress: () => { current: number; next: number; percentage: number };
  getWeekProgress: (weekNumber: number) => number;
  getTotalProgress: () => number;
}

// Fresh start for new users
const newUserProgress: UserProgress = {
  totalXP: 0,
  level: 1,
  badges: [],
  completedLessons: [],
  completedTasks: [],
  completedQuizzes: [],
  weeklyProgress: {},
  currentStreak: 0,
  lastActivityDate: new Date().toISOString(),
  totalTimeSpent: 0,
  averageQuizScore: 0,
  tasksSubmittedThisWeek: 0,
  lessonsCompletedThisWeek: 0
};

// Demo user with some progress for testing
const demoUserProgress: UserProgress = {
  totalXP: 485,
  level: 4,
  badges: ['first-step', 'idea-generator', 'market-researcher'],
  completedLessons: [
    'lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-1-4', 'lesson-1-5',
    'lesson-2-1', 'lesson-2-2', 'lesson-2-3', 'lesson-2-4', 'lesson-2-5',
    'lesson-3-1', 'lesson-3-2'
  ],
  completedTasks: ['task-1-1', 'task-1-2', 'task-2-1'],
  completedQuizzes: ['quiz-week-1', 'quiz-week-2'],
  weeklyProgress: {
    '1': 100,
    '2': 100,
    '3': 40,
    '4': 0,
    '5': 0
  },
  currentStreak: 5,
  lastActivityDate: new Date().toISOString(),
  totalTimeSpent: 420,
  averageQuizScore: 85,
  tasksSubmittedThisWeek: 2,
  lessonsCompletedThisWeek: 3
};

// Check if this is a demo environment (you can modify this logic based on your needs)
const isDemoUser = () => {
  // Only consider demo user if explicitly set AND it's the demo/admin accounts
  const isDemoFlag = localStorage.getItem('isDemoUser') === 'true';
  const isDemoURL = window.location.search.includes('demo=true');
  const isDemoEmail = localStorage.getItem('userEmail')?.includes('demo@speakceo.ai') || 
                     localStorage.getItem('userEmail')?.includes('admin@speakceo.ai');
  
  // Only apply demo progress for actual demo accounts
  return (isDemoFlag || isDemoURL) && isDemoEmail;
};

// Always start with fresh progress - demo progress will be applied only when explicitly needed
const initialProgress: UserProgress = newUserProgress;

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  // Real-time updates when progress changes
  useEffect(() => {
    // Update level based on XP
    const newLevel = Math.floor(progress.totalXP / 100) + 1;
    if (newLevel !== progress.level) {
      setProgress(prev => ({ ...prev, level: newLevel }));
    }
  }, [progress.totalXP]);

  // Check for new badges based on progress
  useEffect(() => {
    const newBadges: string[] = [];
    
    // XP-based badges
    if (progress.totalXP >= 100 && !progress.badges.includes('xp-master-100')) {
      newBadges.push('xp-master-100');
    }
    if (progress.totalXP >= 500 && !progress.badges.includes('xp-legend-500')) {
      newBadges.push('xp-legend-500');
    }
    
    // Task-based badges
    if (progress.completedTasks.length >= 5 && !progress.badges.includes('task-warrior')) {
      newBadges.push('task-warrior');
    }
    if (progress.completedTasks.length >= 10 && !progress.badges.includes('assignment-ace')) {
      newBadges.push('assignment-ace');
    }
    
    // Lesson-based badges
    if (progress.completedLessons.length >= 10 && !progress.badges.includes('learning-champion')) {
      newBadges.push('learning-champion');
    }
    if (progress.completedLessons.length >= 25 && !progress.badges.includes('knowledge-seeker')) {
      newBadges.push('knowledge-seeker');
    }
    
    // Streak-based badges
    if (progress.currentStreak >= 7 && !progress.badges.includes('weekly-warrior')) {
      newBadges.push('weekly-warrior');
    }
    
    // Quiz performance badges
    if (progress.averageQuizScore >= 90 && progress.completedQuizzes.length >= 3 && !progress.badges.includes('quiz-master')) {
      newBadges.push('quiz-master');
    }

    if (newBadges.length > 0) {
      setProgress(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges]
      }));
    }
  }, [progress.totalXP, progress.completedTasks.length, progress.completedLessons.length, progress.currentStreak, progress.averageQuizScore, progress.completedQuizzes.length]);

  const updateXP = (amount: number, source: string) => {
    setProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + amount,
      lastActivityDate: new Date().toISOString()
    }));
    
    // Show notification
    if (amount > 0) {
      setTimeout(() => {
        // This could trigger a notification system
        console.log(`🎉 +${amount} XP from ${source}!`);
      }, 100);
    }
  };

  const completeLesson = (lessonId: string, weekNumber: number) => {
    if (progress.completedLessons.includes(lessonId)) return;

    setProgress(prev => {
      const newCompletedLessons = [...prev.completedLessons, lessonId];
      const weekProgress = { ...prev.weeklyProgress };
      
      // Calculate week progress (5 lessons per week)
      const weekLessons = newCompletedLessons.filter(id => 
        id.startsWith(`lesson-${weekNumber}-`)
      ).length;
      weekProgress[weekNumber.toString()] = Math.min((weekLessons / 5) * 100, 100);

      return {
        ...prev,
        completedLessons: newCompletedLessons,
        weeklyProgress: weekProgress,
        lessonsCompletedThisWeek: prev.lessonsCompletedThisWeek + 1,
        lastActivityDate: new Date().toISOString()
      };
    });

    updateXP(15, 'Lesson Completion');
  };

  const completeTask = (taskId: string, xpAwarded: number) => {
    if (progress.completedTasks.includes(taskId)) return;

    setProgress(prev => ({
      ...prev,
      completedTasks: [...prev.completedTasks, taskId],
      tasksSubmittedThisWeek: prev.tasksSubmittedThisWeek + 1,
      lastActivityDate: new Date().toISOString()
    }));

    updateXP(xpAwarded, 'Task Completion');
  };

  const completeQuiz = (quizId: string, score: number, xpAwarded: number) => {
    if (progress.completedQuizzes.includes(quizId)) return;

    setProgress(prev => {
      const newQuizzes = [...prev.completedQuizzes, quizId];
      const totalScore = prev.averageQuizScore * prev.completedQuizzes.length + score;
      const newAverageScore = totalScore / newQuizzes.length;

      return {
        ...prev,
        completedQuizzes: newQuizzes,
        averageQuizScore: Math.round(newAverageScore),
        lastActivityDate: new Date().toISOString()
      };
    });

    updateXP(xpAwarded, 'Quiz Completion');
  };

  const addBadge = (badgeId: string) => {
    if (progress.badges.includes(badgeId)) return;

    setProgress(prev => ({
      ...prev,
      badges: [...prev.badges, badgeId]
    }));

    updateXP(25, 'Badge Achievement');
  };

  const updateTimeSpent = (minutes: number) => {
    setProgress(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + minutes,
      lastActivityDate: new Date().toISOString()
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  const initializeNewUser = () => {
    setProgress(newUserProgress);
    // Give new users the "first-step" badge to welcome them
    setTimeout(() => {
      addBadge('first-step');
    }, 1000);
  };

  const initializeExistingUser = (userData: Partial<UserProgress>) => {
    const existingProgress: UserProgress = {
      ...newUserProgress,
      ...userData,
      lastActivityDate: new Date().toISOString()
    };
    setProgress(existingProgress);
  };

  const getLevelProgress = () => {
    const currentLevelXP = (progress.level - 1) * 100;
    const nextLevelXP = progress.level * 100;
    const currentProgress = progress.totalXP - currentLevelXP;
    const neededForNext = nextLevelXP - currentLevelXP;
    const percentage = Math.min((currentProgress / neededForNext) * 100, 100);

    return {
      current: currentProgress,
      next: neededForNext,
      percentage: Math.round(percentage)
    };
  };

  const getWeekProgress = (weekNumber: number) => {
    return progress.weeklyProgress[weekNumber.toString()] || 0;
  };

  const getTotalProgress = () => {
    const totalWeeks = 13;
    const completedWeeks = Object.values(progress.weeklyProgress).filter(p => p === 100).length;
    return Math.round((completedWeeks / totalWeeks) * 100);
  };

  return (
    <UserProgressContext.Provider value={{
      progress,
      updateXP,
      completeLesson,
      completeTask,
      completeQuiz,
      addBadge,
      updateTimeSpent,
      resetProgress,
      initializeNewUser,
      initializeExistingUser,
      getLevelProgress,
      getWeekProgress,
      getTotalProgress
    }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}; 