import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';

interface UnifiedProgressState {
  overallProgress: number;
  xpBreakdown: {
    courses: number;
    tasks: number;
    simulators: number;
    aiTools: number;
    community: number;
  };
  recentActivities: {
    id: string;
    type: 'course' | 'task' | 'simulator' | 'ai-tool' | 'community';
    title: string;
    xpEarned: number;
    timestamp: string;
  }[];
  streak: {
    current: number;
    lastUpdated: string;
    history: { date: string; completed: boolean }[];
  };
  
  recordActivity: (activity: { 
    type: 'course' | 'task' | 'simulator' | 'ai-tool' | 'community';
    title: string;
    xpEarned: number;
  }) => void;
  
  updateStreak: () => void;
  getOverallProgress: () => number;
  getTotalXP: () => number;
  getRecentActivities: (limit?: number) => any[];
  getStreakData: () => { 
    current: number; 
    lastUpdated: string; 
    history: { date: string; completed: boolean }[];
  };
  resetProgress: () => void;
}

export const useUnifiedProgressStore = create<UnifiedProgressState>()(
  persist(
    (set, get) => ({
      overallProgress: 0,
      xpBreakdown: {
        courses: 0,
        tasks: 0,
        simulators: 0,
        aiTools: 0,
        community: 0
      },
      recentActivities: [],
      streak: {
        current: 0,
        lastUpdated: new Date().toISOString(),
        history: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toISOString().split('T')[0],
            completed: i > 3 ? false : true
          };
        }).reverse()
      },
      
      recordActivity: (activity) => {
        set(state => {
          // Add to recent activities
          const newActivity = {
            id: Date.now().toString(),
            ...activity,
            timestamp: new Date().toISOString()
          };
          
          // Keep only the 50 most recent activities
          const updatedActivities = [newActivity, ...state.recentActivities].slice(0, 50);
          
          // Update XP breakdown
          const updatedXpBreakdown = {
            ...state.xpBreakdown,
            [activity.type === 'ai-tool' ? 'aiTools' : activity.type]: 
              state.xpBreakdown[activity.type === 'ai-tool' ? 'aiTools' : activity.type] + activity.xpEarned
          };
          
          // Calculate new overall progress
          // This is a simplified calculation - in a real app, this would be more complex
          const totalXP = Object.values(updatedXpBreakdown).reduce((sum, xp) => sum + xp, 0);
          const maxXP = 10000; // Example max XP for 100% progress
          const calculatedProgress = Math.min(100, Math.round((totalXP / maxXP) * 100));
          
          // Update streak
          const updatedStreak = { ...state.streak };
          const today = new Date().toISOString().split('T')[0];
          
          // Check if we already updated the streak today
          const lastUpdatedDate = new Date(state.streak.lastUpdated).toISOString().split('T')[0];
          if (lastUpdatedDate !== today) {
            // Update today's entry in history
            const todayIndex = updatedStreak.history.findIndex(day => day.date === today);
            if (todayIndex >= 0) {
              updatedStreak.history[todayIndex].completed = true;
            } else {
              // Add today if not in history
              updatedStreak.history.push({ date: today, completed: true });
              // Remove oldest day if we have more than 7 days
              if (updatedStreak.history.length > 7) {
                updatedStreak.history.shift();
              }
            }
            
            // Check if yesterday was completed to maintain streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const yesterdayCompleted = updatedStreak.history.some(
              day => day.date === yesterdayStr && day.completed
            );
            
            if (yesterdayCompleted) {
              updatedStreak.current += 1;
            } else {
              // Reset streak if yesterday was missed
              updatedStreak.current = 1;
            }
            
            updatedStreak.lastUpdated = new Date().toISOString();
          }
          
          return {
            recentActivities: updatedActivities,
            xpBreakdown: updatedXpBreakdown,
            overallProgress: calculatedProgress,
            streak: updatedStreak
          };
        });
        
        // Update user XP in the user store
        useUserStore.getState().updateUserXP(activity.xpEarned);
        
        // Update progress store streak
        useProgressStore.getState().updateStreak();
      },
      
      updateStreak: () => {
        set(state => {
          const today = new Date().toISOString().split('T')[0];
          const lastUpdatedDate = new Date(state.streak.lastUpdated).toISOString().split('T')[0];
          
          // If already updated today, don't update again
          if (lastUpdatedDate === today) return state;
          
          const updatedStreak = { ...state.streak };
          
          // Update today's entry in history
          const todayIndex = updatedStreak.history.findIndex(day => day.date === today);
          if (todayIndex >= 0) {
            updatedStreak.history[todayIndex].completed = true;
          } else {
            // Add today if not in history
            updatedStreak.history.push({ date: today, completed: true });
            // Remove oldest day if we have more than 7 days
            if (updatedStreak.history.length > 7) {
              updatedStreak.history.shift();
            }
          }
          
          // Check if yesterday was completed to maintain streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const yesterdayCompleted = updatedStreak.history.some(
            day => day.date === yesterdayStr && day.completed
          );
          
          if (yesterdayCompleted) {
            updatedStreak.current += 1;
          } else {
            // Reset streak if yesterday was missed
            updatedStreak.current = 1;
          }
          
          updatedStreak.lastUpdated = new Date().toISOString();
          
          return {
            ...state,
            streak: updatedStreak
          };
        });
        
        // Sync with progress store
        const { userProgress } = useProgressStore.getState();
        const { streak } = get();
        
        if (userProgress.streak !== streak.current) {
          useProgressStore.setState({
            userProgress: {
              ...userProgress,
              streak: streak.current
            }
          });
        }
      },
      
      getOverallProgress: () => {
        // Sync with user progress for consistency
        return useUserStore.getState().user?.progress || get().overallProgress;
      },
      
      getTotalXP: () => {
        const { xpBreakdown } = get();
        return Object.values(xpBreakdown).reduce((sum, xp) => sum + xp, 0);
      },
      
      getRecentActivities: (limit = 10) => {
        const { recentActivities } = get();
        return recentActivities.slice(0, limit);
      },
      
      getStreakData: () => {
        return get().streak;
      },
      
      resetProgress: () => {
        set({
          overallProgress: 0,
          xpBreakdown: {
            courses: 0,
            tasks: 0,
            simulators: 0,
            aiTools: 0,
            community: 0
          },
          recentActivities: [],
          streak: {
            current: 0,
            lastUpdated: new Date().toISOString(),
            history: Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              return {
                date: date.toISOString().split('T')[0],
                completed: false
              };
            }).reverse()
          }
        });
      }
    }),
    {
      name: 'unified-progress-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);