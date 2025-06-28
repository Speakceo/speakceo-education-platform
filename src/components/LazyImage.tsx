import React, { useState, useRef, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  quality?: number;
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = memo(({ 
  src, 
  alt, 
  className = '',
  width,
  height,
  placeholder,
  quality = 80,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority); // If priority, load immediately
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate optimized image URL
  const getOptimizedUrl = (url: string) => {
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('auto', 'format');
      params.append('fit', 'crop');
      params.append('q', quality.toString());
      return `${url}?${params.toString()}`;
    }
    return url;
  };

  // Generate WebP version if supported
  const getWebPUrl = (url: string) => {
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('auto', 'format');
      params.append('fit', 'crop');
      params.append('q', quality.toString());
      params.append('fm', 'webp');
      return `${url}?${params.toString()}`;
    }
    return url;
  };

  // Generate blur placeholder
  const getBlurPlaceholder = (url: string) => {
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      params.append('w', '20');
      params.append('h', '20');
      params.append('auto', 'format');
      params.append('fit', 'crop');
      params.append('q', '10');
      params.append('blur', '10');
      return `${url}?${params.toString()}`;
    }
    return placeholder;
  };

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = getOptimizedUrl(src);
      img.onload = () => setLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [priority, src, quality, width, height]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  const blurPlaceholder = getBlurPlaceholder(src);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {blurPlaceholder && !loaded && !error && (
        <img
          src={blurPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          loading="eager"
        />
      )}

      {/* Main image */}
      {inView && !error && (
        <picture>
          {/* WebP version for modern browsers */}
          <source 
            srcSet={getWebPUrl(src)} 
            type="image/webp" 
          />
          {/* Fallback image */}
          <img
            src={getOptimizedUrl(src)}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            width={width}
            height={height}
            decoding="async"
          />
        </picture>
      )}

      {/* Loading skeleton */}
      {!loaded && !error && inView && !blurPlaceholder && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Failed to load image</div>
        </div>
      )}

      {/* Loading indicator for priority images */}
      {priority && !loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
