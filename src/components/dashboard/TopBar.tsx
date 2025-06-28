import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  User, 
  LogOut, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useUserStore } from '../../lib/store';

export default function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New course available',
      description: 'Check out our new AI in Business course!',
      time: '2 hours ago',
      read: false,
      type: 'course'
    },
    {
      id: 2,
      title: 'Task reminder',
      description: 'Your business model canvas is due tomorrow.',
      time: '5 hours ago',
      read: true,
      type: 'task'
    },
    {
      id: 3,
      title: 'Achievement unlocked',
      description: 'You\'ve completed 10 lessons in a row! 🎉',
      time: '1 day ago',
      read: true,
      type: 'achievement'
    }
  ];

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.notifications-trigger')
      ) {
        setShowNotifications(false);
      }
      
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.user-menu-trigger')
      ) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markAllNotificationsAsRead = () => {
    setHasNewNotifications(false);
    // In a real app, you'd update this in your backend
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Mobile menu button and logo for small screens */}
          <div className="flex items-center">
            {isMobile && (
              <button
                type="button"
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
            
            {/* Logo on mobile - optional */}
            {isMobile && (
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">Startup School</div>
              </div>
            )}
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search for courses, tasks, or content..."
                  className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right section - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="notifications-trigger relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                {hasNewNotifications && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                )}
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div 
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="flex items-center justify-between px-4 pt-2 pb-1 border-b">
                    <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto py-1">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-2 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {notification.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">No notifications</p>
                    )}
                  </div>
                  
                  <div className="border-t px-4 py-2">
                    <button 
                      className="text-xs text-indigo-600 hover:text-indigo-800 w-full text-center"
                      onClick={() => navigate('/dashboard/notifications')}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Help */}
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => navigate('/dashboard/help')}
            >
              <HelpCircle className="h-6 w-6" />
            </button>
            
            {/* Settings */}
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => navigate('/dashboard/settings')}
            >
              <Settings className="h-6 w-6" />
            </button>

            {/* User profile */}
            <div className="relative ml-3">
              <button
                type="button"
                className="user-menu-trigger flex items-center space-x-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'User profile'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-600 font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex sm:items-center">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </div>
              </button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <div 
                  ref={userMenuRef}
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate('/dashboard/profile')}
                  >
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    Your Profile
                  </button>
                  
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate('/dashboard/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    Settings
                  </button>
                  
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-gray-500" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}