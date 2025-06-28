import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkAndCreateAdminTables, createSampleAdminData } from '../lib/supabase';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Database, 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  ArrowRight,
  ExternalLink,
  Shield
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'error';
  action?: () => Promise<void>;
  buttonText?: string;
}

export default function AdminRecovery() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [adminStats, setAdminStats] = useState({
    users: 0,
    modules: 0,
    lessons: 0,
    tasks: 0,
    liveClasses: 0
  });
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'check-database',
      title: 'Check Database Connection',
      description: 'Verify that we can connect to Supabase and check table status',
      status: 'pending',
      buttonText: 'Check Connection'
    },
    {
      id: 'create-tables',
      title: 'Initialize Admin Tables',
      description: 'Create missing database tables required for admin functionality',
      status: 'pending',
      buttonText: 'Create Tables'
    },
    {
      id: 'add-sample-data',
      title: 'Add Sample Data',
      description: 'Populate tables with sample data to test functionality',
      status: 'pending',
      buttonText: 'Add Sample Data'
    },
    {
      id: 'test-functionality',
      title: 'Test Admin Features',
      description: 'Verify that admin features are working correctly',
      status: 'pending',
      buttonText: 'Run Tests'
    }
  ]);

  const updateStepStatus = (stepId: string, status: Step['status']) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const checkDatabaseConnection = async () => {
    updateStepStatus('check-database', 'running');
    try {
      // Check each table and get counts
      const stats = { users: 0, modules: 0, lessons: 0, tasks: 0, liveClasses: 0 };
      
      // Check profiles table
      try {
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        stats.users = usersCount || 0;
      } catch (e) {
        console.warn('Profiles table check failed:', e);
      }
      
      // Check modules table
      try {
        const { count: modulesCount } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true });
        stats.modules = modulesCount || 0;
      } catch (e) {
        console.warn('Modules table check failed:', e);
      }
      
      // Check lessons table
      try {
        const { count: lessonsCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true });
        stats.lessons = lessonsCount || 0;
      } catch (e) {
        console.warn('Lessons table check failed:', e);
      }
      
      // Check tasks table
      try {
        const { count: tasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });
        stats.tasks = tasksCount || 0;
      } catch (e) {
        console.warn('Tasks table check failed:', e);
      }
      
      // Check live_classes table
      try {
        const { count: liveClassesCount } = await supabase
          .from('live_classes')
          .select('*', { count: 'exact', head: true });
        stats.liveClasses = liveClassesCount || 0;
      } catch (e) {
        console.warn('Live classes table check failed:', e);
      }
      
      setAdminStats(stats);
      updateStepStatus('check-database', 'success');
      setCurrentStep(1);
    } catch (error) {
      console.error('Database connection failed:', error);
      updateStepStatus('check-database', 'error');
    }
  };

  const initializeTables = async () => {
    updateStepStatus('create-tables', 'running');
    try {
      const success = await checkAndCreateAdminTables();
      if (success) {
        updateStepStatus('create-tables', 'success');
        setCurrentStep(2);
        // Refresh stats
        await checkDatabaseConnection();
      } else {
        updateStepStatus('create-tables', 'error');
      }
    } catch (error) {
      console.error('Table creation failed:', error);
      updateStepStatus('create-tables', 'error');
    }
  };

  const addSampleData = async () => {
    updateStepStatus('add-sample-data', 'running');
    try {
      const success = await createSampleAdminData();
      if (success) {
        updateStepStatus('add-sample-data', 'success');
        setCurrentStep(3);
        // Refresh stats
        await checkDatabaseConnection();
      } else {
        updateStepStatus('add-sample-data', 'error');
      }
    } catch (error) {
      console.error('Sample data creation failed:', error);
      updateStepStatus('add-sample-data', 'error');
    }
  };

  const testFunctionality = async () => {
    updateStepStatus('test-functionality', 'running');
    try {
      // Test module creation
      const testModule = {
        id: `test_recovery_${Date.now()}`,
        title: 'Recovery Test Module',
        description: 'This module was created during admin recovery',
        order: 999,
        status: 'draft',
        duration: '1 week'
      };
      
      const { error: moduleError } = await supabase
        .from('modules')
        .insert(testModule);
      
      if (moduleError) throw moduleError;
      
      // Test task creation
      const testTask = {
        id: `test_task_recovery_${Date.now()}`,
        title: 'Recovery Test Task',
        description: 'This task was created during admin recovery',
        type: 'file_upload',
        week_number: 1,
        points: 10,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        created_at: new Date().toISOString()
      };
      
      const { error: taskError } = await supabase
        .from('tasks')
        .insert(testTask);
      
      if (taskError) throw taskError;
      
      updateStepStatus('test-functionality', 'success');
      // Refresh stats
      await checkDatabaseConnection();
    } catch (error) {
      console.error('Functionality test failed:', error);
      updateStepStatus('test-functionality', 'error');
    }
  };

  const runStep = async (stepIndex: number) => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    try {
      switch (stepIndex) {
        case 0:
          await checkDatabaseConnection();
          break;
        case 1:
          await initializeTables();
          break;
        case 2:
          await addSampleData();
          break;
        case 3:
          await testFunctionality();
          break;
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel Recovery</h1>
            <p className="text-gray-600">
              Follow these steps to fix admin panel issues and restore functionality
            </p>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900">{adminStats.users}</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900">{adminStats.modules}</div>
              <div className="text-xs text-gray-500">Modules</div>
            </div>
            <div className="text-center">
              <FileText className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900">{adminStats.lessons}</div>
              <div className="text-xs text-gray-500">Lessons</div>
            </div>
            <div className="text-center">
              <FileText className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900">{adminStats.tasks}</div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-gray-900">{adminStats.liveClasses}</div>
              <div className="text-xs text-gray-500">Live Classes</div>
            </div>
          </div>

          {/* Recovery Steps */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`border rounded-lg p-4 ${
                  index === currentStep ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {index <= currentStep && step.status !== 'success' && (
                      <button
                        onClick={() => runStep(index)}
                        disabled={isRunning || step.status === 'running'}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          step.status === 'error'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } disabled:opacity-50`}
                      >
                        {step.status === 'running' ? 'Running...' : 
                         step.status === 'error' ? 'Retry' : 
                         step.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
            >
              <Shield className="h-5 w-5 mr-2" />
              Go to Admin Panel
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            
            <button
              onClick={() => navigate('/admin-test')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Database className="h-5 w-5 mr-2" />
              Open Admin Test
              <ExternalLink className="h-5 w-5 ml-2" />
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Recovery Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li><strong>Check Database Connection:</strong> Verifies Supabase connectivity and table status</li>
              <li><strong>Initialize Admin Tables:</strong> Creates any missing database tables</li>
              <li><strong>Add Sample Data:</strong> Populates empty tables with test data</li>
              <li><strong>Test Functionality:</strong> Creates test records to verify everything works</li>
              <li><strong>Access Admin Panel:</strong> Use the admin panel with restored functionality</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If you continue experiencing issues, check the browser console for detailed error logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 