import React, { useState } from 'react';
import { Bell, Search, Settings, RefreshCw, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

interface AdminHeaderProps {
  syncStatus?: 'synced' | 'syncing' | 'error';
}

export default function AdminHeader({ syncStatus = 'synced' }: AdminHeaderProps) {
  const [showSyncDetails, setShowSyncDetails] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserStore();

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
    <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-4"
          />
          <input
            className="block h-full w-full border-0 py-0 pl-12 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Sync Status Indicator */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowSyncDetails(!showSyncDetails)}
          >
            {syncStatus === 'synced' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Synced</span>
              </div>
            )}
            {syncStatus === 'syncing' && (
              <div className="flex items-center text-blue-600">
                <RefreshCw className="h-5 w-5 mr-1 animate-spin" />
                <span className="text-sm">Syncing...</span>
              </div>
            )}
            {syncStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Sync Error</span>
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Settings</span>
            <Settings className="h-6 w-6" />
          </button>
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
              alt=""
            />
            <span className="text-sm font-semibold leading-6 text-gray-900">
              Admin
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Sync Details Popover */}
      {showSyncDetails && (
        <div className="absolute top-16 right-4 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Sync Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Modules</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lessons</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lesson Content</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Live Classes</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User Profiles</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last synced: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}