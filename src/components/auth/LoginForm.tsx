import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Database, Users, TestTube } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { signIn, ensureDemoUserProfile, ensureAdminUserProfile, createDemoUserAccount, createAdminUserAccount, checkSupabaseConnection, setupProductionEnvironment } from '../../lib/supabase';
import { useUserStore } from '../../lib/store';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('');
  const navigate = useNavigate();
  const { initializeAuth } = useUserStore();

  const fillDemoCredentials = () => {
    setEmail('demo@speakceo.ai');
    setPassword('Demo123!');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@speakceo.ai');
    setPassword('Admin123!');
  };

  const testDatabaseConnection = async () => {
    setDbStatus('Testing database connection...');
    try {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        setDbStatus('✅ Database Connected - Creating accounts...');
        
        // Try to create demo accounts with detailed logging
        let demoStatus = '';
        let adminStatus = '';
        
        try {
          const demoCreated = await createDemoUserAccount();
          demoStatus = demoCreated ? '✅ Demo account ready' : '❌ Demo account failed';
        } catch (demoError: any) {
          demoStatus = `❌ Demo error: ${demoError?.message || 'Unknown error'}`;
        }
        
        try {
          const adminCreated = await createAdminUserAccount();
          adminStatus = adminCreated ? '✅ Admin account ready' : '❌ Admin account failed';
        } catch (adminError: any) {
          adminStatus = `❌ Admin error: ${adminError?.message || 'Unknown error'}`;
        }
        
        setDbStatus(`✅ Database Connected\n${demoStatus}\n${adminStatus}`);
      } else {
        setDbStatus('❌ Database Connection Failed');
      }
    } catch (error: any) {
      setDbStatus(`❌ Error: ${error?.message || 'Unknown error'}`);
    }
  };

  const testDemoLogin = async () => {
    setDbStatus('Testing demo login...');
    try {
      // Try to sign in directly
      await signIn('demo@speakceo.ai', 'Demo123!');
      setDbStatus('✅ Demo login successful! Account exists and working.');
      // Don't redirect, just test
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        setDbStatus('❌ Account does not exist or wrong credentials.\n💡 Try "Create Accounts" button first or check Supabase dashboard.');
      } else if (error.message.includes('Email not confirmed')) {
        setDbStatus('❌ Email confirmation required.\n💡 Go to Supabase → Auth → Settings and disable "Enable email confirmations"\nOR go to Auth → Users and manually confirm the user.');
      } else {
        setDbStatus(`❌ Login failed: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const setupForProduction = async () => {
    setDbStatus('🚀 Setting up production environment...');
    try {
      const results = await setupProductionEnvironment();
      
      let status = '🎉 Production Setup Results:\n';
      status += results.tablesCreated ? '✅ Database tables ready\n' : '❌ Database tables failed\n';
      status += results.rlsPoliciesSet ? '✅ Security policies configured\n' : '❌ Security policies failed\n';
      status += results.demoAccountCreated ? '✅ Demo account ready\n' : '❌ Demo account failed\n';
      status += results.adminAccountCreated ? '✅ Admin account ready\n' : '❌ Admin account failed\n';
      status += results.starterDataCreated ? '✅ Sample data created\n' : '❌ Sample data failed\n';
      
      if (results.errors.length > 0) {
        status += '\n❗ Issues found:\n';
        results.errors.forEach(error => {
          status += `• ${error}\n`;
        });
        
        status += '\n💡 Common solutions:\n';
        status += '• Email confirmation: Supabase → Auth → Settings → Disable "Enable email confirmations"\n';
        status += '• Manual confirm: Supabase → Auth → Users → Click user → Confirm email\n';
        status += '• Check policies: Database → RLS enabled on profiles table\n';
      } else {
        status += '\n🎊 Ready for production!';
      }
      
      setDbStatus(status);
    } catch (error: any) {
      setDbStatus(`❌ Setup failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login attempt with email:', email);
      
      // Auto-detect demo vs admin based on email and create account if needed
      if (email === 'demo@speakceo.ai') {
        console.log('Demo login detected - ensuring demo account exists...');
        try {
          await createDemoUserAccount();
        } catch (createError) {
          console.log('Demo account creation failed, proceeding with login:', createError);
        }
      } else if (email === 'admin@speakceo.ai') {
        console.log('Admin login detected - ensuring admin account exists...');
        try {
          await createAdminUserAccount();
        } catch (createError) {
          console.log('Admin account creation failed, proceeding with login:', createError);
        }
      }
      
      // Sign in with provided credentials
      await signIn(email, password);
      
      // Auto-setup profile FIRST based on email
      if (email === 'demo@speakceo.ai') {
        console.log('Setting up demo user profile...');
        await ensureDemoUserProfile();
      } else if (email === 'admin@speakceo.ai') {
        console.log('Setting up admin user profile...');
        await ensureAdminUserProfile();
      }
      
      // THEN initialize auth to get the updated user profile
      await initializeAuth();
      
      // Finally redirect based on email
      if (email === 'demo@speakceo.ai') {
        navigate('/dashboard', { replace: true });
      } else if (email === 'admin@speakceo.ai') {
        navigate('/admin', { replace: true });
      } else {
        // For any other email, allow login but redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      // Handle specific error cases with helpful messages
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. If this is a new account, it may need email confirmation. Check the debugging tools below.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please confirm your email address. Check Supabase Auth settings or manually confirm the user.');
      } else if (err.message.includes('too many requests')) {
        setError('Too many login attempts. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to continue your learning journey"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Debugging Status */}
        {dbStatus && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 whitespace-pre-line">
            <Database className="h-5 w-5 inline mr-2" />
            {dbStatus}
          </div>
        )}

        {/* Quick Credential Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            Demo Student
          </button>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="flex items-center justify-center px-3 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <Database className="h-4 w-4 mr-2" />
            Admin User
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border-0 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Debugging Tools */}
      <div className="mt-6 space-y-3">
        <div className="text-sm text-gray-600 text-center">
          🔧 Debugging Tools
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={testDatabaseConnection}
            className="flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Database & Create Accounts
          </button>
          <button
            type="button"
            onClick={testDemoLogin}
            className="flex items-center justify-center px-4 py-2 border border-orange-300 rounded-md text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Try Demo Login
          </button>
          <button
            type="button"
            onClick={setupForProduction}
            className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Full Production Setup
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        🔑 Demo: demo@speakceo.ai / Demo123! | Admin: admin@speakceo.ai / Admin123!
      </p>
      
      <div className="mt-4 text-center text-xs text-gray-400">
        <p>💡 If login fails: Check Supabase Auth settings → Disable email confirmation</p>
        <p>Or manually confirm users in Supabase Auth → Users panel</p>
      </div>
    </AuthLayout>
  );
} 