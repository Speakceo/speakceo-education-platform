import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Trophy,
  BrainCircuit,
  MessageSquare,
  TrendingUp,
  X,
  Menu,
  Map,
  HelpCircle,
  CheckSquare,
  Settings,
  Sparkles,
  Video,
  BarChart,
  User,
  Award,
  Calendar,
  Rocket,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useUserStore } from '../../lib/store';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Learning Journey', href: '/dashboard/journey', icon: Map },
  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Live Classes', href: '/dashboard/live-classes', icon: Video },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Business Lab', href: '/dashboard/business-lab', icon: BrainCircuit },
  { name: 'AI Tools', href: '/dashboard/ai-tools', icon: Sparkles },
  { name: 'Community', href: '/dashboard/community', icon: Users },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Ask CEO', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle }
];

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useUserStore();
  
  // State to track sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Notify parent component when sidebar collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Render different sidebar versions based on device and state
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button 
          onClick={handleMobileToggle}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-md"
        >
          <Menu className="h-6 w-6 text-indigo-600" />
        </button>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <aside 
          className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">SS</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Startup School</h2>
                  <p className="text-xs text-gray-500">Learning Platform</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2 px-3">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg mb-1 ${
                      location.pathname === item.href || 
                      (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      location.pathname === item.href || 
                      (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                        ? 'text-indigo-600'
                        : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="border-t p-4">
              <div className="flex items-center px-3 py-2 rounded-lg mb-2 hover:bg-gray-100">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'User'} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 mt-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } flex flex-col z-10`}>
      {/* Logo Area */}
      <div className={`border-b py-5 flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">SS</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">SS</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Startup School</h2>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleCollapse}
          className={`p-1 rounded-full hover:bg-gray-100 ${isCollapsed ? 'ml-auto' : 'ml-auto'}`}
        >
          <ChevronLeft className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`flex items-center w-full ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } px-3 py-3 rounded-lg ${
                location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className={`h-5 w-5 ${
                isCollapsed ? '' : 'mr-3'
              } ${
                location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
                  ? 'text-indigo-600'
                  : 'text-gray-500'
              }`} />
              
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
      
      {/* User profile section */}
      <div className="border-t p-3">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-gray-200">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name || 'User'} 
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center px-3 py-2 rounded-lg mb-2 hover:bg-gray-100">
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.name || 'User'} 
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-center'
          } px-3 py-2 mt-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50`}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}