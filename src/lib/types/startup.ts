export interface StartupData {
  name: string;
  tagline: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  target_audience?: string;
  simulators: {
    businessModel: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
      lastUpdated?: string;
    };
    branding: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
      lastUpdated?: string;
      logo?: string;
      colors?: string[];
    };
    financial: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
      lastUpdated?: string;
      metrics?: {
        revenue?: number;
        expenses?: number;
        profit?: number;
        breakEven?: number;
      };
    };
    marketing: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
      lastUpdated?: string;
    };
    pitch: {
      progress: number;
      status: 'completed' | 'in-progress' | 'locked';
      lastUpdated?: string;
    };
  };
  overallProgress: number;
  createdAt: string;
  updatedAt: string;
}

export interface StartupStore {
  startup: StartupData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeStartup: (userId: string) => void;
  updateStartupInfo: (data: Partial<StartupData>) => void;
  updateSimulatorProgress: (
    simulator: keyof StartupData['simulators'],
    progress: number,
    status: 'completed' | 'in-progress' | 'locked'
  ) => void;
  syncWithBrandCreator: () => void;
  syncWithBusinessModel: () => void;
  syncWithFinancials: () => void;
  generatePitchDeck: () => Promise<string>;
}