import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../supabase';

export interface RealTimeProgress {
  userId: string;
  completedLessons: string[];
  completedTasks: string[];
  completedQuizzes: string[];
  totalXP: number;
  currentStreak: number;
  lastActivityDate: string;
  weeklyXP: number;
  monthlyProgress: number;
  overallProgress: number;
  achievements: string[];
  dailyGoalProgress: number;
  studyTimeToday: number; // in minutes
}

interface ProgressMetrics {
  totalLessons: number;
  totalTasks: number;
  totalQuizzes: number;
  completionRate: number;
  averageScore: number;
  timeSpentLearning: number;
}

interface RealTimeProgressState {
  progress: RealTimeProgress;
  metrics: ProgressMetrics;
  isLoading: boolean;
  lastUpdated: string;
  
  // Real-time actions
  initializeProgress: (userId: string) => Promise<void>;
  markLessonComplete: (lessonId: string, xpEarned?: number) => Promise<void>;
  markTaskComplete: (taskId: string, xpEarned?: number) => Promise<void>;
  markQuizComplete: (quizId: string, score: number, xpEarned?: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  addStudyTime: (minutes: number) => void;
  checkDailyGoal: () => void;
  awardAchievement: (achievementId: string) => Promise<void>;
  
  // Getters
  getProgressPercentage: () => number;
  getCurrentStreak: () => number;
  getTodayXP: () => number;
  getWeeklyXP: () => number;
  getCompletionStats: () => { completed: number; total: number; percentage: number };
  
  // Real-time updates
  refreshProgress: () => Promise<void>;
  subscribeToUpdates: () => void;
}

const initialProgress: RealTimeProgress = {
  userId: '',
  completedLessons: [],
  completedTasks: [],
  completedQuizzes: [],
  totalXP: 0,
  currentStreak: 0,
  lastActivityDate: new Date().toISOString().split('T')[0],
  weeklyXP: 0,
  monthlyProgress: 0,
  overallProgress: 0,
  achievements: [],
  dailyGoalProgress: 0,
  studyTimeToday: 0
};

const initialMetrics: ProgressMetrics = {
  totalLessons: 50,
  totalTasks: 25,
  totalQuizzes: 15,
  completionRate: 0,
  averageScore: 0,
  timeSpentLearning: 0
};

export const useRealTimeProgressStore = create<RealTimeProgressState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,
      metrics: initialMetrics,
      isLoading: false,
      lastUpdated: new Date().toISOString(),

      initializeProgress: async (userId: string) => {
        if (!userId) return;
        
        set({ isLoading: true });
        
        try {
          // Fetch current progress from database
          const { data: dbProgress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching progress:', error);
            return;
          }

          let currentProgress = initialProgress;
          
          if (dbProgress) {
            currentProgress = {
              userId,
              completedLessons: dbProgress.completed_lessons || [],
              completedTasks: dbProgress.completed_tasks || [],
              completedQuizzes: dbProgress.completed_quizzes || [],
              totalXP: dbProgress.total_xp || 0,
              currentStreak: dbProgress.current_streak || 0,
              lastActivityDate: dbProgress.last_activity_date || new Date().toISOString().split('T')[0],
              weeklyXP: dbProgress.weekly_xp || 0,
              monthlyProgress: dbProgress.monthly_progress || 0,
              overallProgress: dbProgress.overall_progress || 0,
              achievements: dbProgress.achievements || [],
              dailyGoalProgress: dbProgress.daily_goal_progress || 0,
              studyTimeToday: dbProgress.study_time_today || 0
            };
          } else {
            // Create initial progress record
            currentProgress.userId = userId;
            await supabase
              .from('user_progress')
              .insert({
                user_id: userId,
                completed_lessons: [],
                completed_tasks: [],
                completed_quizzes: [],
                total_xp: 0,
                current_streak: 0,
                last_activity_date: new Date().toISOString().split('T')[0],
                weekly_xp: 0,
                monthly_progress: 0,
                overall_progress: 0,
                achievements: [],
                daily_goal_progress: 0,
                study_time_today: 0
              });
          }

          // Calculate current metrics
          const { completedLessons, completedTasks, completedQuizzes } = currentProgress;
          const { totalLessons, totalTasks, totalQuizzes } = get().metrics;
          
          const totalCompleted = completedLessons.length + completedTasks.length + completedQuizzes.length;
          const totalActivities = totalLessons + totalTasks + totalQuizzes;
          const overallProgress = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;

          set({ 
            progress: { ...currentProgress, overallProgress },
            isLoading: false,
            lastUpdated: new Date().toISOString()
          });
          
        } catch (error) {
          console.error('Error initializing progress:', error);
          set({ isLoading: false });
        }
      },

      markLessonComplete: async (lessonId: string, xpEarned = 50) => {
        const { progress } = get();
        
        // Check if already completed
        if (progress.completedLessons.includes(lessonId)) return;
        
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = progress.lastActivityDate !== today;
        
        const updatedProgress = {
          ...progress,
          completedLessons: [...progress.completedLessons, lessonId],
          totalXP: progress.totalXP + xpEarned,
          weeklyXP: progress.weeklyXP + xpEarned,
          lastActivityDate: today,
          currentStreak: isNewDay ? progress.currentStreak + 1 : progress.currentStreak,
          dailyGoalProgress: progress.dailyGoalProgress + 1
        };

        // Calculate new overall progress
        const { totalLessons, totalTasks, totalQuizzes } = get().metrics;
        const totalCompleted = updatedProgress.completedLessons.length + updatedProgress.completedTasks.length + updatedProgress.completedQuizzes.length;
        const totalActivities = totalLessons + totalTasks + totalQuizzes;
        updatedProgress.overallProgress = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;

        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });

        // Update database
        await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            completed_lessons: updatedProgress.completedLessons,
            total_xp: updatedProgress.totalXP,
            weekly_xp: updatedProgress.weeklyXP,
            current_streak: updatedProgress.currentStreak,
            last_activity_date: updatedProgress.lastActivityDate,
            overall_progress: updatedProgress.overallProgress,
            daily_goal_progress: updatedProgress.dailyGoalProgress
          });

        // Check for achievements
        get().checkDailyGoal();
      },

      markTaskComplete: async (taskId: string, xpEarned = 100) => {
        const { progress } = get();
        
        if (progress.completedTasks.includes(taskId)) return;
        
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = progress.lastActivityDate !== today;
        
        const updatedProgress = {
          ...progress,
          completedTasks: [...progress.completedTasks, taskId],
          totalXP: progress.totalXP + xpEarned,
          weeklyXP: progress.weeklyXP + xpEarned,
          lastActivityDate: today,
          currentStreak: isNewDay ? progress.currentStreak + 1 : progress.currentStreak,
          dailyGoalProgress: progress.dailyGoalProgress + 2 // Tasks worth more toward daily goal
        };

        // Calculate new overall progress
        const { totalLessons, totalTasks, totalQuizzes } = get().metrics;
        const totalCompleted = updatedProgress.completedLessons.length + updatedProgress.completedTasks.length + updatedProgress.completedQuizzes.length;
        const totalActivities = totalLessons + totalTasks + totalQuizzes;
        updatedProgress.overallProgress = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;

        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });

        // Update database
        await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            completed_tasks: updatedProgress.completedTasks,
            total_xp: updatedProgress.totalXP,
            weekly_xp: updatedProgress.weeklyXP,
            current_streak: updatedProgress.currentStreak,
            last_activity_date: updatedProgress.lastActivityDate,
            overall_progress: updatedProgress.overallProgress,
            daily_goal_progress: updatedProgress.dailyGoalProgress
          });

        get().checkDailyGoal();
      },

      markQuizComplete: async (quizId: string, score: number, xpEarned = 75) => {
        const { progress } = get();
        
        if (progress.completedQuizzes.includes(quizId)) return;
        
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = progress.lastActivityDate !== today;
        
        // Bonus XP for high scores
        const bonusXP = score >= 90 ? 25 : score >= 80 ? 15 : 0;
        const totalXP = xpEarned + bonusXP;
        
        const updatedProgress = {
          ...progress,
          completedQuizzes: [...progress.completedQuizzes, quizId],
          totalXP: progress.totalXP + totalXP,
          weeklyXP: progress.weeklyXP + totalXP,
          lastActivityDate: today,
          currentStreak: isNewDay ? progress.currentStreak + 1 : progress.currentStreak,
          dailyGoalProgress: progress.dailyGoalProgress + 1
        };

        // Calculate new overall progress
        const { totalLessons, totalTasks, totalQuizzes } = get().metrics;
        const totalCompleted = updatedProgress.completedLessons.length + updatedProgress.completedTasks.length + updatedProgress.completedQuizzes.length;
        const totalActivities = totalLessons + totalTasks + totalQuizzes;
        updatedProgress.overallProgress = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;

        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });

        // Update database
        await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            completed_quizzes: updatedProgress.completedQuizzes,
            total_xp: updatedProgress.totalXP,
            weekly_xp: updatedProgress.weeklyXP,
            current_streak: updatedProgress.currentStreak,
            last_activity_date: updatedProgress.lastActivityDate,
            overall_progress: updatedProgress.overallProgress,
            daily_goal_progress: updatedProgress.dailyGoalProgress
          });

        get().checkDailyGoal();
      },

      updateStreak: async () => {
        const { progress } = get();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        let newStreak = progress.currentStreak;
        
        if (progress.lastActivityDate === yesterday) {
          // Continue streak
          newStreak = progress.currentStreak + 1;
        } else if (progress.lastActivityDate !== today) {
          // Streak broken
          newStreak = 1;
        }
        
        const updatedProgress = {
          ...progress,
          currentStreak: newStreak,
          lastActivityDate: today
        };
        
        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });

        await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            current_streak: newStreak,
            last_activity_date: today
          });
      },

      addStudyTime: (minutes: number) => {
        const { progress } = get();
        const updatedProgress = {
          ...progress,
          studyTimeToday: progress.studyTimeToday + minutes
        };
        
        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });
      },

      checkDailyGoal: () => {
        const { progress } = get();
        const dailyGoal = 5; // 5 activities per day
        
        if (progress.dailyGoalProgress >= dailyGoal && !progress.achievements.includes('daily_goal_' + new Date().toISOString().split('T')[0])) {
          get().awardAchievement('daily_goal_' + new Date().toISOString().split('T')[0]);
        }
      },

      awardAchievement: async (achievementId: string) => {
        const { progress } = get();
        
        if (progress.achievements.includes(achievementId)) return;
        
        const updatedProgress = {
          ...progress,
          achievements: [...progress.achievements, achievementId],
          totalXP: progress.totalXP + 200 // Bonus XP for achievements
        };
        
        set({ 
          progress: updatedProgress,
          lastUpdated: new Date().toISOString()
        });

        await supabase
          .from('user_progress')
          .upsert({
            user_id: progress.userId,
            achievements: updatedProgress.achievements,
            total_xp: updatedProgress.totalXP
          });
      },

      // Getters
      getProgressPercentage: () => {
        const { progress } = get();
        return progress.overallProgress;
      },

      getCurrentStreak: () => {
        const { progress } = get();
        return progress.currentStreak;
      },

      getTodayXP: () => {
        const { progress } = get();
        // This would ideally track XP earned today specifically
        return Math.floor(progress.weeklyXP * 0.14); // Rough estimate
      },

      getWeeklyXP: () => {
        const { progress } = get();
        return progress.weeklyXP;
      },

      getCompletionStats: () => {
        const { progress, metrics } = get();
        const completed = progress.completedLessons.length + progress.completedTasks.length + progress.completedQuizzes.length;
        const total = metrics.totalLessons + metrics.totalTasks + metrics.totalQuizzes;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percentage };
      },

      refreshProgress: async () => {
        const { progress } = get();
        if (progress.userId) {
          await get().initializeProgress(progress.userId);
        }
      },

      subscribeToUpdates: () => {
        const { progress } = get();
        if (!progress.userId) return;

        // Subscribe to real-time updates from Supabase
        const subscription = supabase
          .channel('progress_updates')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'user_progress',
              filter: `user_id=eq.${progress.userId}` 
            }, 
            (payload) => {
              console.log('Real-time progress update:', payload);
              get().refreshProgress();
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      }
    }),
    {
      name: 'realtime-progress-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        progress: state.progress,
        metrics: state.metrics,
        lastUpdated: state.lastUpdated
      })
    }
  )
); 