import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCurrentUser, initializeSession, updateUserProgress, updateUserPoints, cleanUserLocalStorage } from '../supabase';
import { supabase } from '../supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courseType: 'Basic' | 'Premium';
  progress: number;
  points: number;
  role: 'student' | 'admin';
}

interface UserState {
  user: AppUser | null;
  profile: any | null;
  isHydrated: boolean;
  isInitialized: boolean;
  error: string | null;
  setUser: (user: AppUser | null) => void;
  setHydrated: (state: boolean) => void;
  initializeAuth: () => Promise<void>;
  logout: () => void;
  resetProgress: () => void;
  updateUserXP: (xpToAdd: number) => void;
  updateUserProgressValue: (newProgress: number) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isHydrated: false,
      isInitialized: false,
      error: null,
      setUser: (user) => set({ user }),
      setHydrated: (state) => set({ isHydrated: state }),
      initializeAuth: async () => {
        try {
          console.log('Initializing auth state...');
          
          // Set as initialized immediately to prevent blocking
          set({ 
            isInitialized: true,
            isHydrated: true,
            error: null 
          });
          
          // Get current session without blocking
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.error('Session error:', sessionError);
            return; // Don't throw, just return
          }
          
          if (session?.user) {
            const user = session.user;
            console.log('User session found:', user.email);
            
            // Clean localStorage for fresh users (not demo accounts)
            if (user.email) {
              cleanUserLocalStorage(user.email);
            }
            
            // Try to get profile but don't block if it fails
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              
              if (profile && !profileError) {
                console.log('User profile loaded:', profile);
                
                // Convert Supabase user to app user format
                const appUser: AppUser = {
                  id: profile.id,
                  name: profile.name || 'User',
                  email: user.email || '',
                  avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80',
                  courseType: profile.course_type as 'Basic' | 'Premium',
                  progress: profile.progress || 0,
                  points: profile.points || 0,
                  role: profile.role as 'student' | 'admin'
                };
                
                set({
                  user: appUser,
                  profile,
                  error: null
                });
                
                console.log('Auth initialization completed successfully');
              } else {
                console.log('Profile not found or error:', profileError);
                // Create a basic user from session data
                const basicUser: AppUser = {
                  id: user.id,
                  name: user.email?.split('@')[0] || 'User',
                  email: user.email || '',
                  avatar: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80',
                  courseType: 'Basic',
                  progress: 0,
                  points: 0,
                  role: 'student'
                };
                
                set({
                  user: basicUser,
                  profile: null,
                  error: null
                });
              }
            } catch (profileError) {
              console.error('Profile fetch error:', profileError);
              // Don't block, just set basic user
              const basicUser: AppUser = {
                id: user.id,
                name: user.email?.split('@')[0] || 'User',
                email: user.email || '',
                avatar: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80',
                courseType: 'Basic',
                progress: 0,
                points: 0,
                role: 'student'
              };
              
              set({
                user: basicUser,
                profile: null,
                error: null
              });
            }
          } else {
            console.log('No active session found');
            set({
              user: null,
              profile: null,
              error: null
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Always ensure app can continue
          set({
            user: null,
            profile: null,
            isHydrated: true,
            isInitialized: true,
            error: null // Don't show errors that might break the UI
          });
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },
      resetProgress: () => {
        const { user } = get();
        if (!user) return;
        
        // Reset progress in local state
        set({
          user: {
            ...user,
            progress: 0,
            points: 0
          }
        });
        
        // Reset progress in database
        updateUserProgress(user.id, 0);
        updateUserPoints(user.id, 0);
        
        // Clear local storage for simulators
        localStorage.removeItem('simulator-storage');
        localStorage.removeItem('progress-storage');
        localStorage.removeItem('myStartup');
        localStorage.removeItem('brandCreator');
        localStorage.removeItem('speakSmartHistory');
        localStorage.removeItem('mathMentorHistory');
        localStorage.removeItem('writeRightHistory');
        localStorage.removeItem('mindMazeHistory');
        localStorage.removeItem('pitchDeckHistory');
        localStorage.removeItem('unified-progress-storage');
        localStorage.removeItem('ai-tools-storage');
      },
      updateUserXP: (xpToAdd) => {
        const { user } = get();
        if (!user) return;
        
        const newPoints = user.points + xpToAdd;
        
        // Update local state
        set({
          user: {
            ...user,
            points: newPoints
          }
        });
        
        // Update database
        updateUserPoints(user.id, newPoints);
      },
      updateUserProgressValue: (newProgress) => {
        const { user } = get();
        if (!user) return;
        
        // Update local state
        set({
          user: {
            ...user,
            progress: newProgress
          }
        });
        
        // Update database
        updateUserProgress(user.id, newProgress);
      },
      signOut: async () => {
        try {
          console.log('Signing out...');
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({
            user: null,
            profile: null,
            error: null
          });
          
          console.log('Sign out successful');
        } catch (error) {
          console.error('Sign out error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to sign out'
          });
        }
      },
      updateProfile: async (updates) => {
        try {
          const { user } = get();
          if (!user) throw new Error('No user logged in');
          
          console.log('Updating profile:', updates);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();
            
          if (error) throw error;
          
          // Update user state with new profile data
          const updatedUser: AppUser = {
            ...user,
            name: profile.name || user.name,
            avatar: profile.avatar_url || user.avatar,
            courseType: profile.course_type as 'Basic' | 'Premium',
            progress: profile.progress || user.progress,
            points: profile.points || user.points,
            role: profile.role as 'student' | 'admin'
          };
          
          set({ 
            user: updatedUser,
            profile, 
            error: null 
          });
          
          console.log('Profile updated successfully');
        } catch (error) {
          console.error('Profile update error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to update profile'
          });
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);