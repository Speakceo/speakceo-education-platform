import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { useProgressStore } from './progressStore';

interface AIToolUsage {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: string | null;
  xpEarned: number;
}

interface AIToolsState {
  tools: Record<string, AIToolUsage>;
  recordToolUsage: (toolId: string, name: string, xpEarned: number) => void;
  getTotalXPEarned: () => number;
  getMostUsedTools: () => AIToolUsage[];
  resetToolUsage: () => void;
}

const initialAITools = {
  'speak-smart': { 
    id: 'speak-smart', 
    name: 'SpeakSmart', 
    usageCount: 0, 
    lastUsed: null, 
    xpEarned: 0 
  },
  'math-mentor': { 
    id: 'math-mentor', 
    name: 'MathMentor', 
    usageCount: 0, 
    lastUsed: null, 
    xpEarned: 0 
  },
  'write-right': { 
    id: 'write-right', 
    name: 'WriteRight', 
    usageCount: 0, 
    lastUsed: null, 
    xpEarned: 0 
  },
  'mind-maze': { 
    id: 'mind-maze', 
    name: 'MindMaze', 
    usageCount: 0, 
    lastUsed: null, 
    xpEarned: 0 
  },
  'pitch-deck': { 
    id: 'pitch-deck', 
    name: 'PitchDeck Creator', 
    usageCount: 0, 
    lastUsed: null, 
    xpEarned: 0 
  }
};

export const useAIToolsStore = create<AIToolsState>()(
  persist(
    (set, get) => ({
      tools: initialAITools,
      
      recordToolUsage: (toolId, name, xpEarned) => {
        set(state => {
          const currentTool = state.tools[toolId] || { 
            id: toolId, 
            name, 
            usageCount: 0, 
            lastUsed: null, 
            xpEarned: 0 
          };
          
          const updatedTool = {
            ...currentTool,
            usageCount: currentTool.usageCount + 1,
            lastUsed: new Date().toISOString(),
            xpEarned: currentTool.xpEarned + xpEarned
          };
          
          return {
            tools: {
              ...state.tools,
              [toolId]: updatedTool
            }
          };
        });
        
        // Update user XP in the user store
        useUserStore.getState().updateUserXP(xpEarned);
        
        // Record in progress store for unified tracking
        useProgressStore.getState().recordToolUsage(toolId, xpEarned);
        
        // Update streak
        useProgressStore.getState().updateStreak();
      },
      
      getTotalXPEarned: () => {
        const { tools } = get();
        return Object.values(tools).reduce((total, tool) => total + tool.xpEarned, 0);
      },
      
      getMostUsedTools: () => {
        const { tools } = get();
        return Object.values(tools)
          .filter(tool => tool.usageCount > 0)
          .sort((a, b) => b.usageCount - a.usageCount);
      },
      
      resetToolUsage: () => {
        set({ tools: initialAITools });
      }
    }),
    {
      name: 'ai-tools-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);