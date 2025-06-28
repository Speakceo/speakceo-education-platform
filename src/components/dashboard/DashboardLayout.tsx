import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../lib/store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Loader2 } from 'lucide-react';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Dashboard Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
              <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = ({ message = "Loading dashboard..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, isHydrated, isInitialized, initializeAuth } = useUserStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar state changes
  const handleSidebarStateChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Initialize authentication
  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        console.log('DashboardLayout: Starting initialization...');
        setIsLoading(true);
        setError(null);

        // Only initialize if not already done
        if (!isInitialized) {
          console.log('DashboardLayout: Initializing auth...');
          await initializeAuth();
        }

        if (mounted) {
          console.log('DashboardLayout: Initialization complete');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize dashboard');
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [initializeAuth, isInitialized]);

  console.log('DashboardLayout render state:', { 
    user: user?.email, 
    isHydrated, 
    isInitialized, 
    isLoading, 
    error 
  });

  // Show loading while auth is initializing
  if (isLoading || !isHydrated || !isInitialized) {
    return <LoadingSpinner message="Initializing dashboard..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('DashboardLayout: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('DashboardLayout: Rendering dashboard for user:', user.email);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading dashboard content..." />}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Sidebar onCollapseChange={handleSidebarStateChange} />
          <div className={`flex-1 flex flex-col min-h-screen ${!isMobile ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : ''}`}>
            <TopBar />
            <main className="py-6 px-4 sm:px-6 lg:px-8 flex-grow overflow-auto">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}