import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { updateUserProgress, updateUserPoints } from '../supabase';
import { getModules, getLessons, getLessonContent } from '../api/courses';
import { useUserStore } from './userStore';
import { supabase } from '../supabase';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'ppt';
  duration: string;
  points: number;
  order: number;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  lessons: Lesson[];
}

export interface UserProgress {
  completedLessons: Record<string, boolean>;
  completedTasks: Record<string, 'pending' | 'submitted' | 'completed'>;
  lastActivity: string;
  streak: number;
  totalPoints: number;
  toolUsage?: Record<string, {
    count: number;
    lastUsed: string;
    totalXP: number;
  }>;
}

interface ProgressState {
  userProgress: UserProgress;
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserProgress: (userId: string) => Promise<void>;
  updateLessonProgress: (moduleId: string, lessonId: string, completed: boolean) => Promise<void>;
  updateTaskProgress: (taskId: string, status: 'pending' | 'submitted' | 'completed') => Promise<void>;
  resetProgress: () => void;
  updateStreak: (increment?: boolean) => void;
  refreshModules: () => Promise<void>;
  
  // Getters
  getOverallProgress: () => number;
  getModuleProgress: (moduleId: string) => number;
  getCompletedLessons: () => number;
  getTotalLessons: () => number;
  getCompletedTasks: () => number;
  getTotalTasks: () => number;
  getNextLesson: () => { moduleId: string; lessonId: string; title: string } | null;
  getLearningStreak: () => number;
  
  // AI Tools Integration
  recordToolUsage: (toolId: string, xpEarned: number) => void;
  getToolUsageStats: () => { totalUsage: number; totalXP: number; lastUsed: string | null };
}

const initialUserProgress: UserProgress = {
  completedLessons: {},
  completedTasks: {},
  lastActivity: new Date().toISOString(),
  streak: 0,
  totalPoints: 0,
  toolUsage: {}
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userProgress: initialUserProgress,
      modules: [],
      isLoading: false,
      error: null,
      
      fetchUserProgress: async (userId: string) => {
        if (!userId) {
          console.log('No user ID provided for progress fetch');
          return;
        }

        try {
          set({ isLoading: true, error: null });
          console.log('Fetching user progress for:', userId);

          // Try to fetch from the new custom progress table
          const { data: progress, error: progressError } = await supabase
            .from('user_progress_custom')
            .select('*')
            .eq('user_id', userId)
            .single();

          console.log('User progress fetch response:', {
            hasProgress: !!progress,
            error: progressError ? {
              code: progressError.code,
              message: progressError.message,
              details: progressError.details
            } : null
          });

          // If user progress doesn't exist, create it
          if (progressError && progressError.code === 'PGRST116') {
            console.log('User progress not found, creating new progress...');
            const initialProgress = {
              user_id: userId,
              completed_lessons: {},
              completed_tasks: {},
              last_activity: new Date().toISOString(),
              streak: 0,
              total_points: 0,
              tool_usage: {}
            };

            const { data: newProgress, error: insertError } = await supabase
              .from('user_progress_custom')
              .insert(initialProgress)
              .select()
              .single();

            console.log('Progress creation response:', {
              success: !insertError,
              error: insertError ? {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details
              } : null
            });

            if (insertError) {
              console.error('Error creating user progress:', insertError);
              // Fall back to default progress
              set({ userProgress: initialProgress as UserProgress });
            } else {
              set({ userProgress: newProgress as UserProgress });
            }
          } else if (progressError) {
            console.error('Error fetching user progress:', progressError);
            // Fall back to default progress
            const defaultProgress = {
              completedLessons: {},
              completedTasks: {},
              lastActivity: new Date().toISOString(),
              streak: 0,
              totalPoints: 0,
              toolUsage: {}
            };
            set({ userProgress: defaultProgress as UserProgress });
          } else {
            // Convert database format to frontend format
            const formattedProgress = {
              completedLessons: progress.completed_lessons || {},
              completedTasks: progress.completed_tasks || {},
              lastActivity: progress.last_activity || new Date().toISOString(),
              streak: progress.streak || 0,
              totalPoints: progress.total_points || 0,
              toolUsage: progress.tool_usage || {}
            };
            set({ userProgress: formattedProgress as UserProgress });
          }

          // Fetch modules and lessons
          console.log('Fetching modules and lessons...');
          const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .order('order_index', { ascending: true });

          if (modulesError) {
            console.error('Error fetching modules:', modulesError);
            set({ modules: [], isLoading: false });
            return;
          }

          console.log('Modules fetch response:', {
            count: modules?.length || 0,
            modules: modules?.map(m => ({ id: m.id, title: m.title })) || []
          });

          if (!modules || modules.length === 0) {
            console.log('No modules found, setting empty array');
            set({ modules: [], isLoading: false });
            return;
          }

          // Fetch lessons for each module
          const modulesWithLessons = await Promise.all(
            modules.map(async (module) => {
              const { data: lessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index', { ascending: true });

              if (lessonsError) {
                console.error('Error fetching lessons for module:', module.id, lessonsError);
                return { ...module, lessons: [] };
              }
              return { ...module, lessons: lessons || [] };
            })
          );

          set({ 
            modules: modulesWithLessons,
            isLoading: false 
          });
          console.log('Progress initialization complete');

        } catch (error) {
          console.error('Error in fetchUserProgress:', error);
          set({ 
            error: 'Failed to fetch progress', 
            isLoading: false,
            userProgress: {
              completedLessons: {},
              completedTasks: {},
              lastActivity: new Date().toISOString(),
              streak: 0,
              totalPoints: 0,
              toolUsage: {}
            } as UserProgress
          });
        }
      },

      updateLessonProgress: async (moduleId: string, lessonId: string, completed: boolean) => {
        const { userProgress } = get();
        const user = useUserStore.getState().user;
        if (!user) return;

        try {
          const updatedProgress = {
            ...userProgress,
            completedLessons: {
              ...userProgress.completedLessons,
              [lessonId]: completed
            },
            lastActivity: new Date().toISOString()
          };

          // Update in database
          const { error } = await supabase
            .from('user_progress_custom')
            .upsert({
              user_id: user.id,
              completed_lessons: updatedProgress.completedLessons,
              completed_tasks: updatedProgress.completedTasks,
              last_activity: updatedProgress.lastActivity,
              streak: updatedProgress.streak,
              total_points: updatedProgress.totalPoints,
              tool_usage: updatedProgress.toolUsage || {}
            });

          if (error) {
            console.error('Error updating lesson progress in database:', error);
            // Fall back to localStorage
            localStorage.setItem(`user-progress-${user.id}`, JSON.stringify(updatedProgress));
          }

          set({ userProgress: updatedProgress });
          console.log('Updated lesson progress:', { lessonId, completed });
        } catch (error) {
          console.error('Error updating lesson progress:', error);
        }
      },

      updateTaskProgress: async (taskId: string, status: 'pending' | 'submitted' | 'completed') => {
        const { userProgress } = get();
        const user = useUserStore.getState().user;
        if (!user) return;

        try {
          const updatedProgress = {
            ...userProgress,
            completedTasks: {
              ...userProgress.completedTasks,
              [taskId]: status
            },
            lastActivity: new Date().toISOString()
          };

          // Update in database
          const { error } = await supabase
            .from('user_progress_custom')
            .upsert({
              user_id: user.id,
              completed_lessons: updatedProgress.completedLessons,
              completed_tasks: updatedProgress.completedTasks,
              last_activity: updatedProgress.lastActivity,
              streak: updatedProgress.streak,
              total_points: updatedProgress.totalPoints,
              tool_usage: updatedProgress.toolUsage || {}
            });

          if (error) {
            console.error('Error updating task progress in database:', error);
            // Fall back to localStorage
            localStorage.setItem(`user-progress-${user.id}`, JSON.stringify(updatedProgress));
          }

          set({ userProgress: updatedProgress });
          console.log('Updated task progress:', { taskId, status });
        } catch (error) {
          console.error('Error updating task progress:', error);
        }
      },

      resetProgress: () => {
        const user = useUserStore.getState().user;
        
        // Reset local state
        set({ userProgress: initialUserProgress });
        
        // If user exists, also reset in database
        if (user) {
          try {
            supabase
              .from('user_progress')
              .upsert({
                user_id: user.id,
                completedLessons: {},
                completedTasks: {},
                lastActivity: new Date().toISOString(),
                streak: 0,
                totalPoints: 0,
                toolUsage: {}
              })
              .then(({ error }) => {
                if (error) console.error('Error resetting progress in database:', error);
                else console.log('Progress successfully reset in database');
              });
          } catch (error) {
            console.error('Error attempting to reset progress:', error);
          }
        }
      },

      updateStreak: async (increment = true) => {
        const { userProgress } = get();
        const user = useUserStore.getState().user;
        if (!user) return;

        const newStreak = increment ? userProgress.streak + 1 : 0;
        const updatedProgress = {
          ...userProgress,
          streak: newStreak,
          lastActivity: new Date().toISOString()
        };

        set({ userProgress: updatedProgress });

        try {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              ...updatedProgress
            });
        } catch (error) {
          console.error('Error updating streak:', error);
        }
      },

      refreshModules: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log("Starting to refresh modules...");
          const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .order('order_index', { ascending: true });

          if (modulesError) {
            console.error("Error fetching modules:", modulesError);
            throw modulesError;
          }

          console.log(`Found ${modules?.length || 0} modules, now fetching lessons...`);

          const modulesWithLessons = await Promise.all(
            modules.map(async (module) => {
              console.log(`Fetching lessons for module: ${module.title} (${module.id})`);
              const { data: lessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index', { ascending: true });

              if (lessonsError) {
                console.error(`Error fetching lessons for module ${module.id}:`, lessonsError);
                throw lessonsError;
              }
              
              console.log(`Found ${lessons?.length || 0} lessons for module: ${module.title}`);
              return { ...module, lessons };
            })
          );

          console.log("Successfully loaded all modules and lessons");
          set({ modules: modulesWithLessons, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('Error refreshing modules:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          set({ error: `Failed to refresh modules: ${errorMessage}`, isLoading: false });
        }
      },

      // Getters
      getOverallProgress: () => {
        const { userProgress, modules } = get();
        if (!userProgress || !userProgress.completedLessons) return 0;
        
        const totalLessons = modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
        const completedLessons = Object.values(userProgress.completedLessons || {}).filter(Boolean).length;
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      },

      getModuleProgress: (moduleId: string) => {
        const { userProgress, modules } = get();
        if (!userProgress || !userProgress.completedLessons) return 0;
        
        const module = modules.find(m => m.id === moduleId);
        if (!module) return 0;

        const totalLessons = module.lessons?.length || 0;
        const completedLessons = module.lessons?.filter(lesson => userProgress.completedLessons[lesson.id]).length || 0;
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      },

      getCompletedLessons: () => {
        const { userProgress } = get();
        if (!userProgress || !userProgress.completedLessons) return 0;
        return Object.values(userProgress.completedLessons || {}).filter(Boolean).length;
      },

      getTotalLessons: () => {
        const { modules } = get();
        return modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
      },

      getCompletedTasks: () => {
        const { userProgress } = get();
        if (!userProgress || !userProgress.completedTasks) return 0;
        return Object.values(userProgress.completedTasks || {}).filter(status => status === 'completed').length;
      },

      getTotalTasks: () => {
        const { userProgress } = get();
        if (!userProgress || !userProgress.completedTasks) return 0;
        return Object.keys(userProgress.completedTasks || {}).length;
      },

      getNextLesson: () => {
        const { userProgress, modules } = get();
        if (!userProgress || !userProgress.completedLessons) return null;
        
        for (const module of modules) {
          for (const lesson of module.lessons || []) {
            if (!userProgress.completedLessons[lesson.id]) {
              return {
                moduleId: module.id,
                lessonId: lesson.id,
                title: lesson.title
              };
            }
          }
        }
        return null;
      },

      getLearningStreak: () => {
        const { userProgress } = get();
        if (!userProgress) return 0;
        return userProgress.streak || 0;
      },

      // AI Tools Integration
      recordToolUsage: async (toolId: string, xpEarned: number) => {
        const { userProgress } = get();
        const user = useUserStore.getState().user;
        if (!user) return;

        const updatedToolUsage = {
          ...userProgress.toolUsage,
          [toolId]: {
            count: (userProgress.toolUsage?.[toolId]?.count || 0) + 1,
            lastUsed: new Date().toISOString(),
            totalXP: (userProgress.toolUsage?.[toolId]?.totalXP || 0) + xpEarned
          }
        };

        const updatedProgress = {
          ...userProgress,
          toolUsage: updatedToolUsage,
          lastActivity: new Date().toISOString()
        };

        set({ userProgress: updatedProgress });

        try {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              ...updatedProgress
            });
        } catch (error) {
          console.error('Error updating tool usage:', error);
        }
      },

      getToolUsageStats: () => {
        const { userProgress } = get();
        const toolUsage = userProgress.toolUsage || {};
        
        const totalUsage = Object.values(toolUsage).reduce((sum, tool) => sum + tool.count, 0);
        const totalXP = Object.values(toolUsage).reduce((sum, tool) => sum + tool.totalXP, 0);
        const lastUsed = Object.values(toolUsage).reduce((latest, tool) => {
          return !latest || new Date(tool.lastUsed) > new Date(latest) ? tool.lastUsed : latest;
        }, null as string | null);

        return { totalUsage, totalXP, lastUsed };
      }
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProgress: state.userProgress,
        modules: state.modules
      })
    }
  )
);

// Set up real-time subscriptions for course content updates
export function setupCourseContentSubscriptions() {
  // Subscribe to changes in modules
  const moduleSubscription = supabase
    .channel('modules-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'modules'
    }, () => {
      // Refresh modules when changes occur
      useProgressStore.getState().refreshModules();
    })
    .subscribe();

  // Subscribe to changes in lessons
  const lessonSubscription = supabase
    .channel('lessons-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'lessons'
    }, () => {
      // Refresh modules when changes occur
      useProgressStore.getState().refreshModules();
    })
    .subscribe();

  // Subscribe to changes in lesson content
  const contentSubscription = supabase
    .channel('lesson-content-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'lesson_content'
    }, () => {
      // Refresh modules when changes occur
      useProgressStore.getState().refreshModules();
    })
    .subscribe();

  // Subscribe to changes in live classes
  const liveClassesSubscription = supabase
    .channel('live-classes-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'live_classes'
    }, () => {
      // Refresh modules when changes occur
      useProgressStore.getState().refreshModules();
    })
    .subscribe();

  // Return a cleanup function
  return () => {
    supabase.removeChannel(moduleSubscription);
    supabase.removeChannel(lessonSubscription);
    supabase.removeChannel(contentSubscription);
    supabase.removeChannel(liveClassesSubscription);
  };
}