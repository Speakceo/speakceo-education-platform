import React, { useEffect, useState } from 'react';
import { useUserStore } from '../lib/store';
import { useProgressStore } from '../lib/store';
import { supabase } from '../lib/supabase';

export default function Debug() {
  const { user, isHydrated, isInitialized, error, updateProfile } = useUserStore();
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [tables, setTables] = useState<Record<string, any>>({});
  const { modules, isLoading: modulesLoading } = useProgressStore();
  const [adminUpdateStatus, setAdminUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [adminError, setAdminError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
          setSupabaseStatus('error');
        } else {
          setSupabaseStatus('connected');
          // Fetch table information
          fetchTableInfo();
        }
      } catch (err) {
        console.error('Connection check failed:', err);
        setSupabaseStatus('error');
      }
    };

    const fetchTableInfo = async () => {
      const tableData: Record<string, any> = {};
      
      // Try to get modules count
      try {
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('count');
        
        tableData.modules = { 
          exists: !modulesError, 
          count: modulesData?.length ? modulesData[0].count : 0,
          error: modulesError ? modulesError.message : null
        };
      } catch (err) {
        tableData.modules = { exists: false, error: String(err) };
      }
      
      // Try to get courses count
      try {
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('count');
        
        tableData.courses = { 
          exists: !coursesError, 
          count: coursesData?.length ? coursesData[0].count : 0,
          error: coursesError ? coursesError.message : null  
        };
      } catch (err) {
        tableData.courses = { exists: false, error: String(err) };
      }
      
      // Try to get lessons count
      try {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('count');
        
        tableData.lessons = { 
          exists: !lessonsError, 
          count: lessonsData?.length ? lessonsData[0].count : 0,
          error: lessonsError ? lessonsError.message : null
        };
      } catch (err) {
        tableData.lessons = { exists: false, error: String(err) };
      }
      
      setTables(tableData);
    };

    checkConnection();
  }, []);

  const makeUserAdmin = async () => {
    if (!user) {
      setAdminError('You must be logged in to perform this action');
      return;
    }
    
    try {
      setAdminUpdateStatus('loading');
      setAdminError(null);
      
      // Update the user's role to admin in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
      
      if (updateError) {
        setAdminError(updateError.message);
        setAdminUpdateStatus('error');
        return;
      }
      
      // Update local state
      await updateProfile({ role: 'admin' });
      
      setAdminUpdateStatus('success');
    } catch (err) {
      setAdminUpdateStatus('error');
      setAdminError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Debug Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Technical details to help troubleshoot connection issues.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Authentication Status</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Auth Initialized</dt>
                <dd className="mt-1 text-sm text-gray-900">{isInitialized ? 'Yes' : 'No'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Auth Hydrated</dt>
                <dd className="mt-1 text-sm text-gray-900">{isHydrated ? 'Yes' : 'No'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">User Authenticated</dt>
                <dd className="mt-1 text-sm text-gray-900">{user ? 'Yes' : 'No'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">User Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.role || 'Not logged in'}</dd>
              </div>
              {error && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Auth Error</dt>
                  <dd className="mt-1 text-sm text-red-600">{error}</dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <button
                  onClick={makeUserAdmin}
                  disabled={!user || adminUpdateStatus === 'loading'}
                  className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !user || adminUpdateStatus === 'loading'
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                  }`}
                >
                  {adminUpdateStatus === 'loading' ? 'Updating...' : 'Make Me Admin'}
                </button>
                {adminUpdateStatus === 'success' && (
                  <p className="mt-2 text-sm text-green-600">Successfully updated to admin role! You may need to refresh the page.</p>
                )}
                {adminError && (
                  <p className="mt-2 text-sm text-red-600">{adminError}</p>
                )}
              </div>
            </dl>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Supabase Connection</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Connection Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {supabaseStatus === 'checking' && 'Checking...'}
                  {supabaseStatus === 'connected' && 'Connected'}
                  {supabaseStatus === 'error' && 'Connection Error'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Supabase URL</dt>
                <dd className="mt-1 text-sm text-gray-900">{import.meta.env.VITE_SUPABASE_URL}</dd>
              </div>
            </dl>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Database Tables</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(tables).map(([tableName, info]: [string, any]) => (
                    <tr key={tableName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tableName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {info.exists ? 'Exists' : 'Does not exist'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{info.count || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{info.error || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Modules Data</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Modules Loading</dt>
                <dd className="mt-1 text-sm text-gray-900">{modulesLoading ? 'Loading...' : 'Loaded'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Modules Count</dt>
                <dd className="mt-1 text-sm text-gray-900">{modules.length}</dd>
              </div>
            </dl>
            {modules.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Module Details</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {modules.map((module) => (
                        <tr key={module.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {module.lessons?.length || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 