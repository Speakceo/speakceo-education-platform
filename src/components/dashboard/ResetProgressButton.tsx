import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUserStore, useProgressStore, useSimulatorStore, useAIToolsStore, useUnifiedProgressStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

export default function ResetProgressButton() {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { resetProgress: resetUserProgress } = useUserStore();
  const { resetProgress: resetLearningProgress } = useProgressStore();
  const { resetAllSimulators } = useSimulatorStore();
  const { resetToolUsage } = useAIToolsStore();
  const { resetProgress: resetUnifiedProgress } = useUnifiedProgressStore();

  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      // Show a message to the user that we're resetting their progress
      console.log("===== STARTING COMPLETE PROGRESS RESET =====");
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session found");
      }
      
      const userId = session.user.id;
      console.log(`Current user ID: ${userId}`);
      
      // STEP 1: Delete all task submissions directly from the database
      console.log("Deleting all task submissions...");
      await supabase
        .from('task_submissions')
        .delete()
        .eq('user_id', userId);
        
      // STEP 2: Reset user_progress in database
      console.log("Resetting user progress in database...");
      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          completedLessons: {},
          completedTasks: {},
          lastActivity: new Date().toISOString(),
          streak: 0,
          totalPoints: 0,
          toolUsage: {}
        });
      
      // STEP 3: Reset all stores
      console.log("Resetting all local stores...");
      resetUserProgress();
      resetLearningProgress();
      resetAllSimulators();
      resetToolUsage();
      resetUnifiedProgress();
      
      // STEP 4: Clear entire localStorage
      console.log("Clearing localStorage...");
      window.localStorage.clear();
      
      // STEP 5: Alert user and force a complete page reload
      alert('Progress has been reset. The page will now fully reload.');
      
      // STEP 6: Force a hard refresh that bypasses cache
      window.location.href = window.location.href.split('#')[0] + 
                            '?nocache=' + Math.random();
    } catch (error) {
      console.error('Error during reset:', error);
      alert(`Failed to reset progress: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsResetting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        title="Reset all progress"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Reset Progress</span>
      </button>
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reset All Progress?
            </h3>
            <p className="text-gray-600 mb-6">
              This will reset all your progress, points, and simulator data. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Reset All Progress'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}