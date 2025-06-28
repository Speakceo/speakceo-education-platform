import React, { useState } from 'react';
import { initializeDatabase, checkDatabaseHealth } from '../lib/database/init';
import { Database, CheckCircle, AlertCircle, RefreshCw, Play } from 'lucide-react';

export default function DatabaseInit() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [initResult, setInitResult] = useState<any>(null);
  const [healthResult, setHealthResult] = useState<any>(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitResult(null);
    
    try {
      const result = await initializeDatabase();
      setInitResult(result);
    } catch (error) {
      setInitResult({ success: false, message: 'Failed to initialize', error });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleHealthCheck = async () => {
    setIsChecking(true);
    setHealthResult(null);
    
    try {
      const result = await checkDatabaseHealth();
      setHealthResult(result);
    } catch (error) {
      setHealthResult({ success: false, error: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Database className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
            <p className="text-gray-600 mt-2">Initialize and manage the startup school database</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Initialize Database */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Initialize Database</h2>
              <p className="text-gray-600 mb-4">
                Set up the database with all necessary tables and sample data for testing.
              </p>
              <button
                onClick={handleInitialize}
                disabled={isInitializing}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isInitializing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Initialize Database
                  </>
                )}
              </button>
            </div>

            {/* Health Check */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Check</h2>
              <p className="text-gray-600 mb-4">
                Check the status of all database tables and their data.
              </p>
              <button
                onClick={handleHealthCheck}
                disabled={isChecking}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Health Check
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Initialize Result */}
            {initResult && (
              <div className={`rounded-lg p-4 ${initResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-2">
                  {initResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${initResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    Initialization {initResult.success ? 'Successful' : 'Failed'}
                  </h3>
                </div>
                <p className={`${initResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {initResult.message}
                </p>
                {initResult.error && (
                  <pre className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(initResult.error, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Health Check Result */}
            {healthResult && (
              <div className={`rounded-lg p-4 ${healthResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-4">
                  {healthResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${healthResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    Database Health Check
                  </h3>
                </div>
                
                {healthResult.tables && (
                  <div className="space-y-2">
                    {Object.entries(healthResult.tables).map(([table, status]: [string, any]) => (
                      <div key={table} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-medium">{table}</span>
                        <div className="flex items-center">
                          {status.status === 'ok' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-green-700 text-sm">
                                {status.count !== null ? `${status.count} records` : 'OK'}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-red-700 text-sm">{status.error}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {healthResult.error && (
                  <p className="text-red-700 mt-2">{healthResult.error}</p>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>1. Click "Initialize Database" to set up tables and sample data</li>
              <li>2. Run "Health Check" to verify all tables are working</li>
              <li>3. If initialization fails, check your Supabase connection</li>
              <li>4. After successful setup, go to the admin panel to manage data</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <a
              href="/admin"
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 