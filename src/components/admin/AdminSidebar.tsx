import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  HelpCircle, 
  Menu, 
  X,
  LogOut,
  BookOpen,
  Layers,
  CheckSquare,
  Shield
} from 'lucide-react';
import { useUserStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Lesson Planner', href: '/admin/lessons', icon: Layers },
  { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
  { name: 'Live Classes', href: '/admin/live-classes', icon: Calendar },
  { name: 'Community', href: '/admin/community', icon: Shield },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpCircle },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUserStore();

  const handleNavigation = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed right-4 top-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className={`
        fixed inset-y-0 z-40 flex w-72 flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center">
            <div 
              onClick={() => handleNavigation('/admin')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Admin Panel
              </span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href || 
                                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleNavigation(item.href)}
                          className={`
                            group flex w-full gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold
                            transition-all duration-300
                            ${isActive
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                              : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                            }
                          `}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              {/* Logout Button */}
              <li className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}