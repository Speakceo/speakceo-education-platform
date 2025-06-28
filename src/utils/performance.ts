import React from 'react';

// Performance utilities for better load times

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);
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

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimize animations based on user preference
export const getAnimationProps = (baseProps: any) => {
  if (prefersReducedMotion()) {
    return {
      ...baseProps,
      transition: { duration: 0.01 },
      animate: baseProps.initial
    };
  }
  return baseProps;
};
