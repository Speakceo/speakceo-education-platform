import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Performance Optimizations
import { initializePerformance, PerformanceWrapper } from './components/PerformanceOptimizer'

// Context Providers
import { LanguageProvider } from './lib/contexts/LanguageContext'
import { UserProgressProvider } from './contexts/UserProgressContext'

// Store
import { useUserStore } from './lib/store'

// Pages - Lazy loaded for better performance
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Courses from './pages/Courses'
import Tools from './pages/Tools'
import Community from './pages/Community'
import LiveClasses from './pages/LiveClasses'
import Blog from './pages/Blog'
import Events from './pages/Events'
import FAQ from './pages/FAQ'
import Testimonials from './pages/Testimonials'
import Resources from './pages/Resources'
import Partnerships from './pages/Partnerships'

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'

// Auth Components
import LoginForm from './components/auth/LoginForm'
import ForgotPassword from './components/auth/ForgotPassword'

// Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout'
import Overview from './components/dashboard/Overview'
import LearningJourney from './components/dashboard/LearningJourney'
import MyCourses from './components/dashboard/MyCourses'
import DashboardLiveClasses from './components/dashboard/LiveClasses'
import TasksAssignments from './components/dashboard/TasksAssignments'
import BusinessSimulation from './components/dashboard/BusinessSimulation'
import AITools from './components/dashboard/AITools'
import Achievements from './components/dashboard/Achievements'
import Analytics from './components/dashboard/Analytics'
import Messages from './components/dashboard/Messages'
import Quiz from './components/dashboard/Quiz'
import UserProfile from './components/dashboard/UserProfile'
import BusinessInsights from './components/dashboard/BusinessInsights'
import Help from './components/dashboard/Help'

// Admin Components
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import UsersPage from './components/admin/UsersPage'
import CoursesPage from './components/admin/CoursesPage'
import LessonPlannerDashboard from './components/admin/LessonPlannerDashboard'
import TasksPage from './components/admin/TasksPage'
import AdminLiveClassesPage from './components/admin/LiveClassesPage'
import CommunityModeration from './components/admin/CommunityModeration'
import AnalyticsPage from './components/admin/AnalyticsPage'
import PaymentsPage from './components/admin/PaymentsPage'
import SupportPage from './components/admin/SupportPage'
import SettingsPage from './components/admin/SettingsPage'

// Common Components
import Navbar from './components/Navbar'
import Footer from './components/common/Footer'
import Breadcrumb from './components/Breadcrumb'
import SEO from './components/SEO'
import LoadingFallback from './components/common/LoadingFallback'

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Footer conditional component
const ConditionalFooter = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Hide footer on dashboard and admin pages, or when user is logged in
  if (isDashboardPage || isAdminPage || user) {
    return null;
  }
  
  return <Footer />;
}

// Navbar conditional component
const ConditionalNavbar = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Hide navbar on dashboard and admin pages
  if (isDashboardPage || isAdminPage) {
    return null;
  }
  
  return <Navbar />;
}

// Scroll to Top Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top on route change with a small delay to ensure content is rendered
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { initializeAuth, isInitialized } = useUserStore()

  useEffect(() => {
    // Initialize authentication
    initializeAuth()
    
    // Initialize performance optimizations
    initializePerformance()
  }, [initializeAuth])

  // Show loading while initializing
  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ConditionalNavbar />
      <Breadcrumb />
      <main className="flex-grow">
        <PerformanceWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/community" element={<Community />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/partnerships" element={<Partnerships />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="learning-journey" element={<LearningJourney />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="live-classes" element={<DashboardLiveClasses />} />
              <Route path="tasks-assignments" element={<TasksAssignments />} />
              <Route path="business-simulation" element={<BusinessSimulation />} />
              <Route path="ai-tools" element={<AITools />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="messages" element={<Messages />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="business-insights" element={<BusinessInsights />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="lesson-planner" element={<LessonPlannerDashboard />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="live-classes" element={<AdminLiveClassesPage />} />
              <Route path="community" element={<CommunityModeration />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </PerformanceWrapper>
      </main>
      <ConditionalFooter />
      <ScrollToTop />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <UserProgressProvider>
            <Router>
              <SEO />
              <AppContent />
            </Router>
          </UserProgressProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}