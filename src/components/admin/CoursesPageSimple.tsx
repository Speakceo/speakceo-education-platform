import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Users,
  Star,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  Target,
  Video,
  FileText
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  lessons: number;
  enrolled: number;
  status: 'active' | 'draft' | 'archived';
  completion_rate: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  category: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  duration: string;
  status: 'active' | 'draft';
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  status: 'active' | 'draft';
  order: number;
}

export default function CoursesPageSimple() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'modules'>('courses');
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner' as const,
    category: 'Business Strategy',
    instructor: 'Admin'
  });

  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    course_id: ''
  });

  // Sample data - replace with real data when database is ready
  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Startup Fundamentals',
      description: 'Learn the essential concepts of starting and running a successful business',
      modules: 4,
      lessons: 16,
      enrolled: 45,
      status: 'active',
      completion_rate: 78,
      difficulty: 'Beginner',
      duration: '6 weeks',
      instructor: 'Dr. Sarah Johnson',
      category: 'Business Strategy'
    },
    {
      id: '2',
      title: 'Advanced Business Strategy',
      description: 'Deep dive into strategic planning, competitive analysis, and market positioning',
      modules: 6,
      lessons: 24,
      enrolled: 23,
      status: 'active',
      completion_rate: 65,
      difficulty: 'Advanced',
      duration: '8 weeks',
      instructor: 'Prof. Michael Chen',
      category: 'Strategy'
    },
    {
      id: '3',
      title: 'Financial Management for Entrepreneurs',
      description: 'Master financial planning, budgeting, and investment strategies for startups',
      modules: 5,
      lessons: 20,
      enrolled: 38,
      status: 'active',
      completion_rate: 82,
      difficulty: 'Intermediate',
      duration: '7 weeks',
      instructor: 'Lisa Rodriguez',
      category: 'Finance'
    },
    {
      id: '4',
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing, social media, and customer acquisition',
      modules: 7,
      lessons: 28,
      enrolled: 56,
      status: 'active',
      completion_rate: 71,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      instructor: 'Mark Thompson',
      category: 'Marketing'
    }
  ];

  const sampleModules: Module[] = [
    {
      id: '1',
      course_id: '1',
      title: 'Introduction to Entrepreneurship',
      description: 'Understanding the entrepreneurial mindset and key concepts',
      lessons: [
        { id: '1', module_id: '1', title: 'What is Entrepreneurship?', type: 'video', duration: '15 min', status: 'active', order: 1 },
        { id: '2', module_id: '1', title: 'Types of Entrepreneurs', type: 'text', duration: '10 min', status: 'active', order: 2 },
        { id: '3', module_id: '1', title: 'Entrepreneurial Quiz', type: 'quiz', duration: '20 min', status: 'active', order: 3 }
      ],
      order: 1,
      duration: '1 week',
      status: 'active'
    },
    {
      id: '2',
      course_id: '1',
      title: 'Market Research & Validation',
      description: 'Learn how to research markets and validate business ideas',
      lessons: [
        { id: '4', module_id: '2', title: 'Market Analysis Techniques', type: 'video', duration: '25 min', status: 'active', order: 1 },
        { id: '5', module_id: '2', title: 'Customer Interview Guide', type: 'text', duration: '15 min', status: 'active', order: 2 },
        { id: '6', module_id: '2', title: 'Validation Assignment', type: 'assignment', duration: '2 hours', status: 'active', order: 3 }
      ],
      order: 2,
      duration: '1 week',
      status: 'active'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setCourses(sampleCourses);
      setModules(sampleModules);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) return;
    
    const course: Course = {
      id: Date.now().toString(),
      title: newCourse.title,
      description: newCourse.description,
      modules: 0,
      lessons: 0,
      enrolled: 0,
      status: 'draft',
      completion_rate: 0,
      difficulty: newCourse.difficulty,
      duration: '4 weeks',
      instructor: newCourse.instructor,
      category: newCourse.category
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', difficulty: 'Beginner', category: 'Business Strategy', instructor: 'Admin' });
    setShowAddCourseForm(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
    setModules(modules.filter(m => m.course_id !== courseId));
  };

  const handleAddModule = () => {
    if (!newModule.title || !newModule.course_id) return;
    
    const module: Module = {
      id: Date.now().toString(),
      course_id: newModule.course_id,
      title: newModule.title,
      description: newModule.description,
      lessons: [],
      order: modules.filter(m => m.course_id === newModule.course_id).length + 1,
      duration: '1 week',
      status: 'draft'
    };

    setModules([...modules, module]);
    setNewModule({ title: '', description: '', course_id: '' });
    setShowAddModuleForm(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Create and manage your educational content</p>
        </div>
        <button
          onClick={() => setShowAddCourseForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {/* Add Course Form */}
      {showAddCourseForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={newCourse.difficulty}
                onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter course description"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddCourseForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Course
            </button>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.modules} modules
                </div>
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  {course.lessons} lessons
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course.enrolled}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion Rate</span>
                  <span>{course.completion_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${course.completion_rate}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Duration: {course.duration}</span>
                  <span>By: {course.instructor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
          <p className="text-gray-600">Organize lessons into modules</p>
        </div>
        <button
          onClick={() => setShowAddModuleForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Module
        </button>
      </div>

      {/* Add Module Form */}
      {showAddModuleForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Module</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter module title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
              <select
                value={newModule.course_id}
                onChange={(e) => setNewModule({ ...newModule, course_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newModule.description}
              onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter module description"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddModuleForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Module
            </button>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module) => {
          const course = courses.find(c => c.id === module.course_id);
          return (
            <div key={module.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                  <p className="text-indigo-600 text-sm mt-2">Course: {course?.title || 'Unknown'}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                    {module.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {module.duration}
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Lessons: {module.lessons.length}
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Order: {module.order}
                </div>
              </div>
              
              {module.lessons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Lessons:</h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{lesson.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{lesson.duration}</span>
                          <span className={`px-2 py-1 rounded text-xs ${lesson.type === 'video' ? 'bg-blue-100 text-blue-800' : 
                            lesson.type === 'quiz' ? 'bg-green-100 text-green-800' :
                            lesson.type === 'assignment' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'}`}>
                            {lesson.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'modules'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Modules ({modules.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'courses' ? renderCourses() : renderModules()}
    </div>
  );
} 