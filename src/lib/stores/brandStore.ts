import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BrandData {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  typography: {
    heading: string;
    body: string;
  };
}

interface BrandState {
  brand: BrandData;
  setBrand: (data: Partial<BrandData>) => void;
  getBrandLogo: () => string;
  resetBrand: () => void;
}

const initialBrand: BrandData = {
  name: 'SpeakCEO',
  tagline: 'Empowering Young Leaders',
  description: 'Transforming young minds into future business leaders through immersive learning experiences.',
  logoUrl: '',
  colors: {
    primary: '#2563EB',    // Modern blue
    secondary: '#4F46E5',  // Deep indigo
    accent: '#0EA5E9',     // Bright blue
    neutral: '#64748B'     // Slate gray
  },
  typography: {
    heading: 'Inter',
    body: 'Inter'
  }
};

export const useBrandStore = create<BrandState>()(
  persist(
    (set, get) => ({
      brand: initialBrand,
      setBrand: (data) => set((state) => ({
        brand: { ...state.brand, ...data }
      })),
      getBrandLogo: () => {
        const { brand } = get();
        return brand.logoUrl;
      },
      resetBrand: () => set({ brand: initialBrand })
    }),
    {
      name: 'brand-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);