import React, { useState } from 'react';
import { Database, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupabaseConfig() {
  const [copied, setCopied] = useState(false);

  const currentUrl = import.meta.env.VITE_SUPABASE_URL;
  const currentKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isOnline = currentUrl && !currentUrl.includes('127.0.0.1');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const envFileContent = `# Add these to your .env file in the project root
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">🌐 Connect to Online Supabase</h1>
          <p className="mt-2 text-gray-600">
            Configure your application to use your online Supabase database
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Database className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Current Database Connection</h2>
          </div>
          
          <div className={`p-4 rounded-lg flex items-center ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            {isOnline ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">✅ Connected to Online Database</p>
                  <p className="text-green-600 text-sm">{currentUrl}</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-yellow-800 font-medium">⚠️ Using Local Database</p>
                  <p className="text-yellow-600 text-sm">Currently connected to local Supabase instance</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Steps to Connect */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Steps to Connect to Online Database</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">1. Get Your Supabase Credentials</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                  supabase.com/dashboard <ExternalLink className="h-3 w-3 ml-1" />
                </a></p>
                <p>• Select your project</p>
                <p>• Go to Settings → API</p>
                <p>• Copy your Project URL and anon/public key</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">2. Update Your .env File</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative">
                <pre>{envFileContent}</pre>
                <button
                  onClick={() => copyToClipboard(envFileContent)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Replace the placeholder values with your actual Supabase credentials
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-2">3. Restart Your Development Server</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <code>npm run dev</code>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The application will automatically connect to your online database
              </p>
            </div>
          </div>
        </div>

        {/* Migration Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Important Notes</h2>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p><strong>Database Schema:</strong> Your online database needs to have the same schema as the local one. You may need to run migrations.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p><strong>Data Migration:</strong> If you want to keep local data, you'll need to export it from local and import to online.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p><strong>Authentication:</strong> User accounts are separate between local and online databases.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p><strong>Permissions:</strong> Make sure your RLS policies are properly configured in the online database.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Link 
            to="/database-fix" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Database Connection
          </Link>
          <Link 
            to="/admin" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Open Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
} 