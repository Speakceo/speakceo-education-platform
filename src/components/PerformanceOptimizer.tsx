import React, { Suspense, lazy, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Performance utilities
const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
  fontLink.as = 'style';
  fontLink.onload = () => {
    fontLink.rel = 'stylesheet';
  };
  document.head.appendChild(fontLink);

  // Preload critical images
  const criticalImages = [
    'https://i.postimg.cc/tR1StD70/Chat-GPT-Image-Jun-19-2025-10-21-56-PM.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Optimize images with better parameters
export const getOptimizedImageUrl = (url: string, width?: number, height?: number) => {
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('auto', 'format');
    params.append('fit', 'crop');
    params.append('q', '80');
    
    return `${url}?${params.toString()}`;
  }
  return url;
};

// Lazy load components for better performance
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyCourses = lazy(() => import('../components/Courses'));
export const LazyAnalytics = lazy(() => import('../pages/AdminDashboard'));
export const LazySimulators = lazy(() => import('../components/simulators/BrandCreator'));

// Loading fallback component
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
));

// Error fallback component
const ErrorFallback = memo(({ error, resetErrorBoundary }: any) => (
  <div className="flex flex-col items-center justify-center h-64 p-4">
    <h2 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h2>
    <p className="text-gray-600 mb-4 text-center">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      Try again
    </button>
  </div>
));

// Performance wrapper component
interface PerformanceWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PerformanceWrapper = memo(({ children, fallback = <LoadingFallback /> }: PerformanceWrapperProps) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
));

// Initialize performance optimizations
export const initializePerformance = () => {
  // Preload critical resources
  if (typeof window !== 'undefined') {
    preloadCriticalResources();
    
    // Enable passive event listeners for better scroll performance
    if ('addEventListener' in window) {
      const options = { passive: true };
      window.addEventListener('scroll', () => {}, options);
      window.addEventListener('touchstart', () => {}, options);
    }
    
    // Optimize animations based on user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
    
    // Add performance observer for monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any;
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }
  }
};

export default PerformanceWrapper; 