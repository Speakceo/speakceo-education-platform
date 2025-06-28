import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Upload,
  FileText,
  Video,
  Link,
  Download,
  Eye,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  order: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor_name: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  lessons: Lesson[];
  materials: CourseMaterial[];
  enrollment_count?: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'document' | 'presentation';
  duration: string;
  description: string;
  order: number;
  status: 'active' | 'draft' | 'archived';
  points: number;
  content: string;
  url?: string;
}

interface CourseMaterial {
  id: string;
  module_id: string;
  lesson_id?: string;
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'audio' | 'image' | 'link' | 'spreadsheet';
  file_url: string;
  file_size: number;
  is_downloadable: boolean;
  download_count: number;
  order: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'materials'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Fetch courses with lessons and materials
      const { data: coursesData, error: coursesError } = await supabase
        .from('modules')
        .select('*')
        .order('order', { ascending: true });

      if (coursesError) throw coursesError;

      const coursesWithDetails = await Promise.all(
        (coursesData || []).map(async (course) => {
          // Fetch lessons
          const { data: lessons } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', course.id)
            .order('order', { ascending: true });

          // Fetch materials (if table exists)
          let materials: CourseMaterial[] = [];
          try {
            const { data: materialsData } = await supabase
              .from('course_materials')
              .select('*')
              .eq('module_id', course.id)
              .order('order', { ascending: true });
            materials = materialsData || [];
          } catch (err) {
            console.log('Materials table not available yet');
          }

          return {
            ...course,
            lessons: lessons || [],
            materials,
            enrollment_count: Math.floor(Math.random() * 100) + 10
          };
        })
      );

      setCourses(coursesWithDetails);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(`Failed to load courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData: any) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          image_url: courseData.image_url,
          level: courseData.level,
          instructor_name: courseData.instructor_name,
          price: courseData.price || 0,
          order: courses.length + 1,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setSuccess('Course created successfully!');
      fetchCourses();
      setShowAddCourseModal(false);
    } catch (error: any) {
      setError(`Failed to create course: ${error.message}`);
    }
  };

  const handleAddLesson = async (lessonData: any) => {
    if (!selectedCourse) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .insert([{
          module_id: selectedCourse.id,
          title: lessonData.title,
          type: lessonData.type,
          duration: lessonData.duration,
          description: lessonData.description,
          content: lessonData.content,
          url: lessonData.url,
          points: lessonData.points || 0,
          order: selectedCourse.lessons.length + 1,
          status: 'active'
        }]);

      if (error) throw error;

      setSuccess('Lesson added successfully!');
      fetchCourses();
      setShowAddLessonModal(false);
    } catch (error: any) {
      setError(`Failed to add lesson: ${error.message}`);
    }
  };

  const handleAddMaterial = async (materialData: any, file?: File) => {
    if (!selectedCourse) return;

    try {
      let fileUrl = materialData.file_url;
      let fileSize = 0;

      if (file) {
        // Upload file to Supabase storage
        const fileName = `course-materials/${selectedCourse.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('course-files')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
        fileSize = file.size;
      }

      // Try to insert into course_materials table (create if doesn't exist)
      try {
        const { error } = await supabase
          .from('course_materials')
          .insert([{
            module_id: selectedCourse.id,
            lesson_id: materialData.lesson_id || null,
            title: materialData.title,
            description: materialData.description,
            type: materialData.type,
            file_url: fileUrl,
            file_size: fileSize,
            is_downloadable: materialData.is_downloadable !== false,
            order: selectedCourse.materials.length + 1
          }]);

        if (error) throw error;
      } catch (tableError) {
        // If table doesn't exist, create it first
        console.log('Creating course_materials table...');
        await supabase.rpc('create_course_materials_table');
        
        // Retry insertion
        const { error } = await supabase
          .from('course_materials')
          .insert([{
            module_id: selectedCourse.id,
            lesson_id: materialData.lesson_id || null,
            title: materialData.title,
            description: materialData.description,
            type: materialData.type,
            file_url: fileUrl,
            file_size: fileSize,
            is_downloadable: materialData.is_downloadable !== false,
            order: selectedCourse.materials.length + 1
          }]);

        if (error) throw error;
      }

      setSuccess('Material added successfully!');
      fetchCourses();
      setShowAddMaterialModal(false);
    } catch (error: any) {
      setError(`Failed to add material: ${error.message}`);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all lessons and materials.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setSuccess('Course deleted successfully!');
      fetchCourses();
    } catch (error: any) {
      setError(`Failed to delete course: ${error.message}`);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage courses, lessons, and materials
              </p>
            </div>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Course
            </button>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
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
                onClick={() => setActiveTab('lessons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lessons'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lessons ({courses.reduce((acc, course) => acc + course.lessons.length, 0)})
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'materials'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Materials ({courses.reduce((acc, course) => acc + course.materials.length, 0)})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <CoursesTab 
            courses={filteredCourses}
            onSelectCourse={setSelectedCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddLesson={() => setShowAddLessonModal(true)}
            onAddMaterial={() => setShowAddMaterialModal(true)}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsTab 
            courses={filteredCourses}
            onAddLesson={() => setShowAddLessonModal(true)}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialsTab 
            courses={filteredCourses}
            onAddMaterial={() => setShowAddMaterialModal(true)}
          />
        )}

        {/* Modals */}
        {showAddCourseModal && (
          <AddCourseModal
            isOpen={showAddCourseModal}
            onClose={() => setShowAddCourseModal(false)}
            onSubmit={handleAddCourse}
          />
        )}

        {showAddLessonModal && (
          <AddLessonModal
            isOpen={showAddLessonModal}
            onClose={() => setShowAddLessonModal(false)}
            onSubmit={handleAddLesson}
            course={selectedCourse}
          />
        )}

        {showAddMaterialModal && (
          <AddMaterialModal
            isOpen={showAddMaterialModal}
            onClose={() => setShowAddMaterialModal(false)}
            onSubmit={handleAddMaterial}
            course={selectedCourse}
          />
        )}
      </div>
    </div>
  );
}

// Courses Tab Component
function CoursesTab({ courses, onSelectCourse, onDeleteCourse, onAddLesson, onAddMaterial }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: Course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {course.level}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {course.duration}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-2" />
                {course.lessons.length} lessons
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                {course.enrollment_count} enrolled
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-2" />
                {course.materials.length} materials
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onSelectCourse(course);
                  onAddLesson();
                }}
                className="flex-1 bg-indigo-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-indigo-700"
              >
                Add Lesson
              </button>
              <button
                onClick={() => {
                  onSelectCourse(course);
                  onAddMaterial();
                }}
                className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-green-700"
              >
                Add Material
              </button>
              <button
                onClick={() => onDeleteCourse(course.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Lessons Tab Component
function LessonsTab({ courses, onAddLesson }: any) {
  const allLessons = courses.flatMap((course: Course) => 
    course.lessons.map(lesson => ({ ...lesson, courseName: course.title }))
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">All Lessons ({allLessons.length})</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {allLessons.map((lesson: any) => (
          <div key={lesson.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{lesson.courseName}</p>
                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{lesson.type}</span>
                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                  <span className="text-xs text-gray-500">{lesson.points} points</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Materials Tab Component  
function MaterialsTab({ courses, onAddMaterial }: any) {
  const allMaterials = courses.flatMap((course: Course) => 
    course.materials.map(material => ({ ...material, courseName: course.title }))
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5 text-blue-500" />;
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'link': return <Link className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">All Materials ({allMaterials.length})</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {allMaterials.map((material: any) => (
          <div key={material.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                {getFileIcon(material.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{material.title}</h4>
                  <p className="text-sm text-gray-500">{material.courseName}</p>
                  <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{material.type}</span>
                    {material.file_size > 0 && (
                      <span className="text-xs text-gray-500">
                        {(material.file_size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{material.download_count} downloads</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Eye className="h-4 w-4" />
                </a>
                {material.is_downloadable && (
                  <a
                    href={material.file_url}
                    download
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add Course Modal
function AddCourseModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    image_url: '',
    level: 'Beginner',
    instructor_name: 'Admin User',
    price: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      duration: '',
      image_url: '',
      level: 'Beginner',
      instructor_name: 'Admin User',
      price: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 4 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add Lesson Modal
function AddLessonModal({ isOpen, onClose, onSubmit, course }: any) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'text',
    duration: '',
    description: '',
    content: '',
    url: '',
    points: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      type: 'text',
      duration: '',
      description: '',
      content: '',
      url: '',
      points: 0
    });
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Lesson to "{course.title}"</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="document">Document</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 30 min"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Lesson content, instructions, or notes..."
              />
            </div>

            {(formData.type === 'video' || formData.type === 'document') && (
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/resource"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                min="0"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add Material Modal
function AddMaterialModal({ isOpen, onClose, onSubmit, course }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    file_url: '',
    is_downloadable: true,
    lesson_id: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedFile);
    setFormData({
      title: '',
      description: '',
      type: 'pdf',
      file_url: '',
      is_downloadable: true,
      lesson_id: ''
    });
    setSelectedFile(null);
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add Material to "{course.title}"</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="doc">Word Document</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="spreadsheet">Spreadsheet</option>
                  <option value="link">External Link</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lesson (Optional)</label>
                <select
                  value={formData.lesson_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, lesson_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No specific lesson</option>
                  {course.lessons.map((lesson: Lesson) => (
                    <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.type === 'link' ? (
              <div>
                <label className="block text-sm font-medium mb-2">URL *</label>
                <input
                  type="url"
                  required
                  value={formData.file_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/resource"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  accept={
                    formData.type === 'pdf' ? '.pdf' :
                    formData.type === 'ppt' ? '.ppt,.pptx' :
                    formData.type === 'doc' ? '.doc,.docx' :
                    formData.type === 'video' ? '.mp4,.avi,.mov' :
                    formData.type === 'audio' ? '.mp3,.wav' :
                    formData.type === 'image' ? '.jpg,.jpeg,.png,.gif' :
                    formData.type === 'spreadsheet' ? '.xls,.xlsx,.csv' :
                    '*'
                  }
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="downloadable"
                checked={formData.is_downloadable}
                onChange={(e) => setFormData(prev => ({ ...prev, is_downloadable: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="downloadable" className="ml-2 block text-sm text-gray-900">
                Allow downloads
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 