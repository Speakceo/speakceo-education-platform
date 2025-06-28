// Main store file that re-exports all store modules
// This file maintains backward compatibility with existing code

// Import all store modules
import { useUserStore } from './stores/userStore';
import { useProgressStore } from './stores/progressStore';
import { useBrandStore } from './stores/brandStore';
import { useSimulatorStore } from './stores/simulatorStore';
import { useAIToolsStore } from './stores/aiToolsStore';
import { useUnifiedProgressStore } from './stores/unifiedProgressStore';
import { useRealTimeProgressStore } from './stores/realTimeProgressStore';

// Re-export all stores
export {
  useUserStore,
  useProgressStore,
  useBrandStore,
  useSimulatorStore,
  useAIToolsStore,
  useUnifiedProgressStore,
  useRealTimeProgressStore
};

// Export types from progress store for easier access
export type { Module, Lesson, UserProgress } from './stores/progressStore';