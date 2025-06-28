import React, { useState, useEffect } from 'react';
import { 
  initializeAdminEnvironment, 
  performHealthCheck, 
  getDashboardStats,
  getAllCourses,
  getAllTasks,
  getAllUsers,
  subscribeToTableChanges,
  addCourse,
  addTask,
  createStarterData,
  createAllTables
} from '../lib/supabase';
import { AlertCircle, CheckCircle, RefreshCw, Database, Users, BookOpen, FileText, Calendar, Play, Zap, Activity } from 'lucide-react';

const AdminTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    // Set up real-time subscriptions
    const coursesSub = subscribeToTableChanges('courses', (payload) => {
      console.log('🔔 Courses changed:', payload);
      fetchData();
    });

    const tasksSub = subscribeToTableChanges('tasks', (payload) => {
      console.log('🔔 Tasks changed:', payload);
      fetchData();
    });

    const usersSub = subscribeToTableChanges('profiles', (payload) => {
      console.log('🔔 Profiles changed:', payload);
      fetchData();
    });

    setSubscriptions([coursesSub, tasksSub, usersSub]);

    // Initial data fetch
    fetchData();

    return () => {
      // Cleanup subscriptions
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, tasksData, usersData, statsData, healthData] = await Promise.all([
        getAllCourses(),
        getAllTasks(),
        getAllUsers(),
        getDashboardStats(),
        performHealthCheck()
      ]);

      setCourses(coursesData);
      setTasks(tasksData);
      setUsers(usersData);
      setStats(statsData);
      setHealthCheck(healthData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInitializeEnvironment = async () => {
    setLoading(true);
    setStatus('🚀 Initializing admin environment...');

    try {
      await initializeAdminEnvironment();
      setStatus('✅ Admin environment initialized successfully!');
      await fetchData();
    } catch (error) {
      console.error('Error initializing environment:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAddCourse = async () => {
    setLoading(true);
    setStatus('➕ Adding test course...');

    try {
      const testCourse = {
        title: `Test Course ${Date.now()}`,
        description: 'This is a test course created for demonstration purposes',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration_weeks: 6,
        difficulty_level: 'beginner',
        price: 99,
        is_featured: false,
        total_lessons: 12
      };

      const result = await addCourse(testCourse);
      setStatus(`✅ Test course added: ${result.title}`);
      await fetchData();
    } catch (error) {
      console.error('Error adding test course:', error);
      setStatus(`❌ Error adding course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAddTask = async () => {
    if (courses.length === 0) {
      setStatus('❌ No courses available. Please create a course first.');
      return;
    }

    setLoading(true);
    setStatus('➕ Adding test task...');

    try {
      // Get first course's first lesson
      const firstCourse = courses[0];
      const firstModule = firstCourse.modules?.[0];
      const firstLesson = firstModule?.lessons?.[0];

      if (!firstLesson) {
        setStatus('❌ No lessons available. Please initialize environment first.');
        return;
      }

      const testTask = {
        lesson_id: firstLesson.id,
        title: `Test Task ${Date.now()}`,
        description: 'This is a test task created for demonstration purposes',
        task_type: 'assignment',
        points: 25
      };

      const result = await addTask(testTask);
      setStatus(`✅ Test task added: ${result.title}`);
      await fetchData();
    } catch (error) {
      console.error('Error adding test task:', error);
      setStatus(`❌ Error adding task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Admin Environment Test Console
          </h1>

          {/* Status Display */}
          <div className="mb-8">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Status:</h3>
              <p className="text-sm font-mono">{status || 'Ready to initialize...'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={handleInitializeEnvironment}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? '⏳ Initializing...' : '🚀 Initialize Environment'}
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Refresh Data
            </button>

            <button
              onClick={handleTestAddCourse}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ Test Add Course
            </button>

            <button
              onClick={handleTestAddTask}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ Test Add Task
            </button>
          </div>

          {/* Health Check Display */}
          {healthCheck && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🏥 System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${healthCheck.database ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{healthCheck.database ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-semibold">Database</p>
                      <p className="text-sm text-gray-600">Connection</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${healthCheck.tables ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{healthCheck.tables ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-semibold">Tables</p>
                      <p className="text-sm text-gray-600">Structure</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${healthCheck.data ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{healthCheck.data ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-semibold">Data</p>
                      <p className="text-sm text-gray-600">Populated</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${healthCheck.realtime ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{healthCheck.realtime ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-semibold">Real-time</p>
                      <p className="text-sm text-gray-600">Connected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Stats */}
          {stats && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Dashboard Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.totalLiveClasses}</div>
                  <div className="text-sm text-gray-600">Live Classes</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.activeUsers}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Courses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Courses ({courses.length})</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div key={course.id} className="bg-white p-3 rounded mb-2 border-l-4 border-blue-500">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.difficulty_level} • ${course.price}</p>
                      <p className="text-xs text-gray-500">
                        {course.modules?.length || 0} modules • {course.total_lessons} lessons
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No courses found</p>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Tasks ({tasks.length})</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <div key={task.id} className="bg-white p-3 rounded mb-2 border-l-4 border-green-500">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.task_type} • {task.points} points</p>
                      <p className="text-xs text-gray-500">
                        {task.lessons?.modules?.courses?.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No tasks found</p>
                )}
              </div>
            </div>

            {/* Users */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Users ({users.length})</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {users.length > 0 ? (
                  users.map(user => (
                    <div key={user.id} className="bg-white p-3 rounded mb-2 border-l-4 border-purple-500">
                      <h4 className="font-medium text-gray-900">{user.name || user.email}</h4>
                      <p className="text-sm text-gray-600">{user.role} • Level {user.level}</p>
                      <p className="text-xs text-gray-500">
                        {user.xp_points} XP • {user.streak_count} day streak
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No users found</p>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Activity Log */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔔 Real-time Activity (Subscriptions Active: {subscriptions.length})
            </h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <p>✅ Real-time subscriptions active for courses, tasks, and profiles</p>
              <p>🔄 Data will automatically refresh when changes occur</p>
              <p>📡 Check browser console for real-time event logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 