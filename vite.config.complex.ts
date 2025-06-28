import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for better development experience
      fastRefresh: true
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Enhanced caching strategies
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'SpeakCEO - Young Entrepreneurship Program',
        short_name: 'SpeakCEO',
        description: 'Transform your child into a future business leader with our comprehensive 90-Day Young CEO Program.',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      timeout: 5000
    },
    middlewareMode: false,
    proxy: {}
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'zustand',
      'date-fns'
    ],
    exclude: ['@lottiefiles/react-lottie-player']
  },
  envPrefix: 'VITE_',
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          
          // UI and Animation libraries
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['@lottiefiles/react-lottie-player', 'lucide-react'],
          
          // Chart and visualization libraries
          'chart-vendor': ['apexcharts', 'react-apexcharts'],
          
          // Utility libraries
          'utils-vendor': ['date-fns', 'zod', 'zustand', 'clsx', 'tailwind-merge'],
          
          // Form and interaction libraries
          'form-vendor': ['react-beautiful-dnd', 'react-dnd', 'react-dnd-html5-backend', 'react-dropzone'],
          
          // Document and export libraries
          'document-vendor': ['html2canvas', 'jspdf', 'react-to-pdf'],
          
          // Math and content libraries
          'content-vendor': ['katex', 'react-katex'],
          
          // Supabase and API libraries
          'api-vendor': ['@supabase/supabase-js'],
          
          // Split large components into separate chunks
          'dashboard': [
            './src/components/dashboard/Overview.tsx',
            './src/components/dashboard/MyStartup.tsx'
          ],
          'simulators': [
            './src/components/simulators/BrandCreator.tsx',
            './src/components/simulators/MarketingCampaign.tsx'
          ],
          'courses': [
            './src/components/Courses.tsx',
            './src/components/course/CourseContent.tsx'
          ]
        },
        // Optimize chunk naming for better caching
        chunkFileNames: () => {
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `media/[name]-[hash].${extType}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `images/[name]-[hash].${extType}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${extType}`;
          }
          return `assets/[name]-[hash].${extType}`;
        }
      },
      // Optimize external dependencies
      external: () => {
        // Keep large external libraries as external if they're loaded via CDN
        return false;
      }
    },
    chunkSizeWarningLimit: 500, // Reduced from 1000 to encourage smaller chunks
    // Enable experimental features for better performance
    target: 'esnext',
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets as base64
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        // Add CSS optimization plugins
      ]
    }
  },
  // Enable experimental features
  esbuild: {
    target: 'esnext',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
});