import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Component, BusinessModel, FinancialProjection, Pitch } from '../types/simulators';
import { validateComponentPosition } from '../types/simulators';
import { useBrandStore } from './brandStore';
import { useProgressStore } from './progressStore';

const initialBusinessModel: BusinessModel = {
  components: [],
  suggestions: [],
  isDirty: false,
  version: 1
};

const initialFinancial: FinancialProjection = {
  revenues: [],
  expenses: [],
  metrics: {
    revenueGrowth: 0,
    profitMargin: 0,
    breakEvenPoint: 0,
    cashFlow: 0
  },
  assumptions: {
    growthRate: 10,
    taxRate: 20,
    inflationRate: 5
  },
  isDirty: false,
  version: 1
};

const initialPitch: Pitch = {
  content: '',
  duration: 0
};

interface SimulatorState {
  businessModel: BusinessModel;
  financial: FinancialProjection;
  pitch: Pitch;
  updateBusinessModel: (components: Component[], suggestions?: string[]) => void;
  updateFinancials: (data: Partial<FinancialProjection>) => void;
  updatePitch: (data: Partial<Pitch>) => void;
  resetBusinessModel: () => void;
  resetPitch: () => void;
  setDirty: (isDirty: boolean) => void;
  saveBusinessModel: () => void;
  resetAllSimulators: () => void;
  
  // Startup integration
  getStartupData: () => {
    name: string;
    tagline: string;
    businessModel: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
    };
    branding: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
    };
    financial: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
    };
    marketing: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
    };
    pitch: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
    };
    overallProgress: number;
  };
}

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get) => ({
      businessModel: initialBusinessModel,
      financial: initialFinancial,
      pitch: initialPitch,
      updateBusinessModel: (components, suggestions) => {
        set((state) => ({
          businessModel: {
            ...state.businessModel,
            components: components.map(validateComponentPosition),
            suggestions: suggestions || state.businessModel.suggestions,
            isDirty: true,
            version: state.businessModel.version + 1
          }
        }));
        
        // Record progress in the progress store
        const { recordToolUsage } = useProgressStore.getState();
        recordToolUsage('business-model', 10);
      },
      updateFinancials: (data) => {
        set((state) => ({
          financial: {
            ...state.financial,
            ...data,
            isDirty: true,
            version: state.financial.version + 1
          }
        }));
        
        // Record progress in the progress store
        const { recordToolUsage } = useProgressStore.getState();
        recordToolUsage('financial', 10);
      },
      updatePitch: (data) => {
        set((state) => ({
          pitch: {
            ...state.pitch,
            ...data
          }
        }));
        
        // Record progress in the progress store
        const { recordToolUsage } = useProgressStore.getState();
        recordToolUsage('pitch-deck', 10);
      },
      resetBusinessModel: () => {
        set(() => ({
          businessModel: initialBusinessModel
        }));
      },
      resetPitch: () => {
        set(() => ({
          pitch: initialPitch
        }));
      },
      setDirty: (isDirty) => {
        set((state) => ({
          businessModel: {
            ...state.businessModel,
            isDirty
          }
        }));
      },
      saveBusinessModel: () => {
        set((state) => ({
          businessModel: {
            ...state.businessModel,
            isDirty: false,
            version: state.businessModel.version + 1
          }
        }));
      },
      resetAllSimulators: () => {
        set(() => ({
          businessModel: initialBusinessModel,
          financial: initialFinancial,
          pitch: initialPitch
        }));
      },
      
      // Startup integration
      getStartupData: () => {
        const { businessModel, financial, pitch } = get();
        const { brand } = useBrandStore.getState();
        
        // Calculate progress for each simulator
        const businessModelProgress = Math.min(100, businessModel.components.length * 10);
        const brandingProgress = brand.logoUrl ? 100 : brand.name !== initialBrand.name ? 50 : 0;
        const financialProgress = Math.min(100, (financial.revenues.length + financial.expenses.length) * 10);
        const pitchProgress = pitch.content ? 50 : 0;
        
        // Determine status for each simulator
        const getStatus = (progress: number) => {
          if (progress >= 100) return 'completed' as const;
          if (progress > 0) return 'in-progress' as const;
          return 'locked' as const;
        };
        
        // Calculate overall progress
        const overallProgress = Math.round(
          (businessModelProgress + brandingProgress + financialProgress + pitchProgress) / 4
        );
        
        return {
          name: brand.name,
          tagline: brand.tagline,
          businessModel: {
            progress: businessModelProgress,
            status: getStatus(businessModelProgress)
          },
          branding: {
            progress: brandingProgress,
            status: getStatus(brandingProgress)
          },
          financial: {
            progress: financialProgress,
            status: getStatus(financialProgress)
          },
          marketing: {
            progress: 0,
            status: 'locked' as const
          },
          pitch: {
            progress: pitchProgress,
            status: getStatus(pitchProgress)
          },
          overallProgress
        };
      }
    }),
    {
      name: 'simulator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        businessModel: state.businessModel,
        financial: state.financial,
        pitch: state.pitch
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        
        // Validate state after rehydration
        if (state.businessModel?.components) {
          state.businessModel.components = state.businessModel.components
            .map(validateComponentPosition)
            .filter(component => {
              // Additional validation to ensure all required fields exist
              return component && 
                     component.id && 
                     component.type && 
                     component.position && 
                     component.gridPosition;
            });
        }
      }
    }
  )
);

// For backward compatibility with the original code
const initialBrand = {
  name: 'My Startup',
  tagline: 'Revolutionizing the future'
};