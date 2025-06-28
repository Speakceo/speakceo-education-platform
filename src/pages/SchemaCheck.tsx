import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SchemaCheckResult {
  table: string;
  exists: boolean;
  recordCount: number;
  hasData: boolean;
  columns?: string[];
  error?: string;
}

export default function SchemaCheck() {
  const [results, setResults] = useState<SchemaCheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const expectedTables = [
    'profiles',
    'modules', 
    'lessons',
    'tasks',
    'live_classes',
    'user_progress',
    'task_submissions',
    'courses',
    'announcements',
    'user_enrollments'
  ];

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      setConnectionStatus('online');
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('offline');
      return false;
    }
  };

  const checkTableSchema = async (tableName: string): Promise<SchemaCheckResult> => {
    try {
      // First check if table exists by trying to select from it
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        return {
          table: tableName,
          exists: false,
          recordCount: 0,
          hasData: false,
          error: error.message
        };
      }

      // Get column information by fetching one record
      let columns: string[] = [];
      if (data && data.length > 0) {
        columns = Object.keys(data[0]);
      } else {
        // If no data, try to get schema info another way
        const { data: schemaData } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
        // This won't return data but will show us the structure
      }

      return {
        table: tableName,
        exists: true,
        recordCount: count || 0,
        hasData: (count || 0) > 0,
        columns
      };
         } catch (error) {
       return {
         table: tableName,
         exists: false,
         recordCount: 0,
         hasData: false,
         error: error instanceof Error ? error.message : 'Unknown error'
       };
     }
  };

  const runSchemaCheck = async () => {
    setIsLoading(true);
    setResults([]);

    // First check connection
    const isConnected = await checkConnection();
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    // Check each table
    const checkResults: SchemaCheckResult[] = [];
    for (const table of expectedTables) {
      const result = await checkTableSchema(table);
      checkResults.push(result);
    }

    setResults(checkResults);
    setIsLoading(false);
  };

  const testCRUDOperations = async () => {
    try {
      // Test creating a task
      const { data: createData, error: createError } = await supabase
        .from('tasks')
        .insert([{
          title: 'Schema Test Task',
          description: 'Testing CRUD operations',
          type: 'assignment',
          task_type: 'assignment',
          week_number: 1,
          points: 10,
          status: 'active'
        }])
        .select();

      if (createError) throw createError;

      // Test reading
      const { data: readData, error: readError } = await supabase
        .from('tasks')
        .select('*')
        .eq('title', 'Schema Test Task')
        .limit(1);

      if (readError) throw readError;

      // Test updating
      if (readData && readData.length > 0) {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ description: 'Updated test description' })
          .eq('id', readData[0].id);

        if (updateError) throw updateError;

        // Test deleting
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', readData[0].id);

        if (deleteError) throw deleteError;
      }

             return { success: true, message: 'All CRUD operations successful' };
     } catch (error) {
       return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
     }
  };

  useEffect(() => {
    runSchemaCheck();
  }, []);

  const getStatusColor = (result: SchemaCheckResult) => {
    if (!result.exists) return 'bg-red-50 border-red-200 text-red-800';
    if (!result.hasData) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-green-50 border-green-200 text-green-800';
  };

  const getStatusIcon = (result: SchemaCheckResult) => {
    if (!result.exists) return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (!result.hasData) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  };

  const overallStatus = results.length > 0 ? {
    tablesExist: results.filter(r => r.exists).length,
    tablesWithData: results.filter(r => r.hasData).length,
    totalTables: results.length,
    allGood: results.every(r => r.exists && r.hasData)
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🔍 Database Schema Check</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive verification of your online Supabase database schema and data
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Database Connection</h2>
            <button
              onClick={runSchemaCheck}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              {isLoading ? 'Checking...' : 'Recheck Schema'}
            </button>
          </div>

          <div className={`p-4 rounded-lg flex items-center ${
            connectionStatus === 'online' ? 'bg-green-50 border border-green-200' :
            connectionStatus === 'offline' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            {connectionStatus === 'online' ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">✅ Connected to Online Database</p>
                  <p className="text-green-600 text-sm">https://xgvtduyizhaiqguuskfu.supabase.co</p>
                </div>
              </>
            ) : connectionStatus === 'offline' ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-red-800 font-medium">❌ Database Connection Failed</p>
                  <p className="text-red-600 text-sm">Cannot connect to Supabase database</p>
                </div>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 text-yellow-600 mr-2 animate-spin" />
                <p className="text-yellow-800">Checking connection...</p>
              </>
            )}
          </div>
        </div>

        {/* Overall Status */}
        {overallStatus && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schema Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-900">{overallStatus.totalTables}</div>
                <div className="text-blue-700 text-sm">Total Tables</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-900">{overallStatus.tablesExist}</div>
                <div className="text-green-700 text-sm">Tables Exist</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-900">{overallStatus.tablesWithData}</div>
                <div className="text-purple-700 text-sm">With Data</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className={`text-2xl font-bold ${overallStatus.allGood ? 'text-green-900' : 'text-red-900'}`}>
                  {overallStatus.allGood ? '✅' : '⚠️'}
                </div>
                <div className="text-orange-700 text-sm">Status</div>
              </div>
            </div>

            {overallStatus.allGood ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🎉 All tables exist and have data! Your database schema is perfect.</p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">⚠️ Some tables are missing or empty. See details below.</p>
              </div>
            )}
          </div>
        )}

        {/* Individual Table Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table Details</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
              <span className="text-gray-600">Checking database schema...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results yet. Click "Recheck Schema" to verify your database.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(result)}
                      <div className="ml-3">
                        <h3 className="font-medium">{result.table}</h3>
                        <div className="text-sm opacity-80">
                          {result.exists ? (
                            <>
                              Records: {result.recordCount} | 
                              Status: {result.hasData ? 'Has Data' : 'Empty'} |
                              Columns: {result.columns?.length || 0}
                            </>
                          ) : (
                            `Error: ${result.error}`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {result.exists && result.columns && (
                        <div className="text-xs opacity-60">
                          {result.columns.slice(0, 3).join(', ')}
                          {result.columns.length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link 
            to="/database-fix" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Database className="h-4 w-4 mr-2" />
            Test CRUD Operations
          </Link>
          <Link 
            to="/admin" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Admin Panel
          </Link>
          <Link 
            to="/supabase-config" 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Database Config
          </Link>
        </div>
      </div>
    </div>
  );
} 