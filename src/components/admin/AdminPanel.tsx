import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Video, 
  BarChart3,
  Upload,
  LogOut,
  Bell,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  User,
  Mail,
  Award,
  Target,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useUserStore } from '../../lib/store';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'student',
    course_type: 'Premium',
    progress: 85,
    status: 'active',
    created_at: '2024-01-15',
    last_active: '2024-06-08'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'student',
    course_type: 'Basic',
    progress: 62,
    status: 'active',
    created_at: '2024-02-10',
    last_active: '2024-06-07'
  },
  {
    id: '3',
    name: 'Carol Martinez',
    email: 'carol@example.com',
    role: 'student',
    course_type: 'Premium',
    progress: 93,
    status: 'active',
    created_at: '2024-01-25',
    last_active: '2024-06-08'
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Business Plan Draft',
    description: 'Create a comprehensive business plan for your startup idea',
    type: 'file_upload',
    week_number: 1,
    points: 100,
    due_date: '2024-06-15',
    live_discussion: true,
    submissions: 12,
    pending_review: 3
  },
  {
    id: '2',
    title: 'Market Research Analysis',
    description: 'Conduct thorough market research and present findings',
    type: 'presentation',
    week_number: 2,
    points: 150,
    due_date: '2024-06-22',
    live_discussion: false,
    submissions: 8,
    pending_review: 5
  },
  {
    id: '3',
    title: 'Financial Projections',
    description: 'Create 3-year financial projections for your business',
    type: 'text',
    week_number: 3,
    points: 120,
    due_date: '2024-06-29',
    live_discussion: true,
    submissions: 5,
    pending_review: 2
  }
];

const mockCourses = [
  {
    id: '1',
    title: 'Startup Fundamentals',
    description: 'Learn the basics of starting a successful business',
    modules: 8,
    lessons: 32,
    enrolled: 45,
    status: 'active',
    completion_rate: 78
  },
  {
    id: '2',
    title: 'Advanced Business Strategy',
    description: 'Deep dive into strategic planning and execution',
    modules: 12,
    lessons: 48,
    enrolled: 23,
    status: 'active',
    completion_rate: 65
  },
  {
    id: '3',
    title: 'Financial Management',
    description: 'Master financial planning and management for entrepreneurs',
    modules: 6,
    lessons: 24,
    enrolled: 38,
    status: 'active',
    completion_rate: 82
  }
];

const mockLiveClasses = [
  {
    id: '1',
    title: 'Weekly Business Mentorship',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-06-12',
    time: '14:00-15:30',
    attendees: 18,
    max_attendees: 30,
    status: 'scheduled',
    category: 'Mentorship'
  },
  {
    id: '2',
    title: 'Financial Planning Workshop',
    instructor: 'Prof. Michael Chen',
    date: '2024-06-14',
    time: '10:00-12:00',
    attendees: 25,
    max_attendees: 40,
    status: 'scheduled',
    category: 'Finance'
  }
];

export default function AdminPanel() {
  const { user, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dashboard metrics
  const dashboardStats = {
    totalUsers: mockUsers.length,
    activeCourses: mockCourses.length,
    totalTasks: mockTasks.length,
    liveClasses: mockLiveClasses.length,
    avgProgress: Math.round(mockUsers.reduce((sum, user) => sum + user.progress, 0) / mockUsers.length),
    completionRate: 78,
    activeToday: Math.floor(mockUsers.length * 0.6)
  };

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'live-classes', label: 'Live Classes', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">+{change}% from last month</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={dashboardStats.totalUsers}
            icon={Users}
            color="bg-blue-500"
            change={12}
          />
          <StatCard
            title="Active Courses"
            value={dashboardStats.activeCourses}
            icon={BookOpen}
            color="bg-green-500"
            change={8}
          />
          <StatCard
            title="Total Tasks"
            value={dashboardStats.totalTasks}
            icon={CheckSquare}
            color="bg-purple-500"
            change={15}
          />
          <StatCard
            title="Live Classes"
            value={dashboardStats.liveClasses}
            icon={Video}
            color="bg-orange-500"
            change={5}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Alice completed Business Plan task</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New student registered</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Video className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Live class scheduled</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{user.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.course_type === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.course_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  task.type === 'file_upload' ? 'bg-purple-100 text-purple-600' :
                  task.type === 'presentation' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {task.type === 'file_upload' ? <Upload className="h-5 w-5" /> :
                   task.type === 'presentation' ? <Video className="h-5 w-5" /> :
                   <FileText className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">Week {task.week_number}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {task.points} pts
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(task.due_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{task.submissions}</span>
                <span className="text-gray-500"> submissions</span>
              </div>
              {task.pending_review > 0 && (
                <div className="flex items-center text-sm text-amber-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {task.pending_review} pending
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiveClasses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Schedule Class
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockLiveClasses.map((liveClass) => (
          <div key={liveClass.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{liveClass.title}</h3>
                <p className="text-sm text-gray-500">with {liveClass.instructor}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {liveClass.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(liveClass.date).toLocaleDateString()} at {liveClass.time}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {liveClass.attendees}/{liveClass.max_attendees} attendees
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-2" />
                {liveClass.category}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <button className="text-green-600 hover:text-green-900 flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Modules:</span>
                <span className="font-medium">{course.modules}</span>
              </div>
              <div className="flex justify-between">
                <span>Lessons:</span>
                <span className="font-medium">{course.lessons}</span>
              </div>
              <div className="flex justify-between">
                <span>Enrolled:</span>
                <span className="font-medium">{course.enrolled} students</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">{course.completion_rate}%</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${course.completion_rate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">{dashboardStats.avgProgress}%</div>
          <p className="text-gray-600">Average completion rate</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">{dashboardStats.activeToday}</div>
          <p className="text-gray-600">Active users today</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Quality</h3>
          <div className="text-3xl font-bold text-yellow-600 mb-2">4.8</div>
          <p className="text-gray-600">Average rating</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'courses':
        return renderCourses();
      case 'tasks':
        return renderTasks();
      case 'live-classes':
        return renderLiveClasses();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <div className="ml-4 text-sm text-gray-500">
                Complete platform management
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.name || 'Admin'}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  ADMIN
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium">{dashboardStats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Courses</span>
                  <span className="text-sm font-medium">{dashboardStats.activeCourses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Live Classes</span>
                  <span className="text-sm font-medium">{dashboardStats.liveClasses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Progress</span>
                  <span className="text-sm font-medium">{dashboardStats.avgProgress}%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm min-h-[600px] p-6">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 