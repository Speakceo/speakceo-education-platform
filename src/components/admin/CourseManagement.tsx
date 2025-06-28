import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Download,
  Clock,
  Users,
  Star,
  Mic,
  Video,
  FileText,
  Link as LinkIcon,
  Target,
  DollarSign,
  Rocket,
  Edit,
  Presentation
} from 'lucide-react';
import { 
  getLessons, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  getLessonContent,
  createLessonContent,
  updateLessonContent,
  deleteLessonContent
} from '../../lib/api/courses';
import { useProgressStore } from '../../lib/store';

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  created_at?: string;
  updated_at?: string;
  lessons?: Lesson[];
  expanded?: boolean;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'ppt';
  duration: string;
  order: number;
  created_at?: string;
  updated_at?: string;
  content?: LessonContent[];
  expanded?: boolean;
}

interface LessonContent {
  id: string;
  lesson_id: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'assignment' | 'ppt' | 'link';
  content: string;
  url?: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface CourseManagementProps {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  onCreateModule: (module: Partial<Module>) => Promise<boolean>;
  onUpdateModule: (id: string, module: Partial<Module>) => Promise<boolean>;
  onDeleteModule: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export default function CourseManagement({
  modules,
  isLoading,
  error: propError,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  onRefresh
}: CourseManagementProps) {
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingContent, setEditingContent] = useState<LessonContent | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [showAddContent, setShowAddContent] = useState<string | null>(null);
  const [newModule, setNewModule] = useState<Partial<Module>>({
    title: '',
    description: '',
    order: 0,
    duration: ''
  });
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: '',
    type: 'video',
    duration: '',
    order: 0
  });
  const [newContent, setNewContent] = useState<Partial<LessonContent>>({
    title: '',
    type: 'video',
    content: '',
    url: '',
    order: 0
  });
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { refreshModules } = useProgressStore();

  useEffect(() => {
    setLocalModules(modules);
  }, [modules]);

  const handleAddModule = async () => {
    if (!newModule.title || !newModule.description || !newModule.duration) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLocalLoading(true);
    setError(null);
    
    try {
      // Determine the order for the new module
      const order = localModules.length > 0 
        ? Math.max(...localModules.map(m => m.order)) + 1 
        : 1;
      
      const success = await onCreateModule({
        ...newModule,
        order
      });
      
      if (success) {
        setNewModule({
          title: '',
          description: '',
          order: 0,
          duration: ''
        });
        setShowAddModule(false);
        setSuccess('Module added successfully!');
        
        // Refresh modules in the progress store to keep student dashboard in sync
        await refreshModules();
        
        // Refresh the admin view
        onRefresh();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Failed to add module. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title || !newLesson.type || !newLesson.duration) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLocalLoading(true);
    setError(null);
    
    try {
      // Find module
      const moduleIndex = localModules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        setError('Module not found');
        setIsLocalLoading(false);
        return;
      }
      
      // Determine the order for the new lesson
      const module = localModules[moduleIndex];
      const lessons = module.lessons || [];
      const order = lessons.length > 0 
        ? Math.max(...lessons.map(l => l.order)) + 1 
        : 1;
      
      // Create new lesson
      const lessonData = {
        module_id: moduleId,
        title: newLesson.title,
        type: newLesson.type,
        duration: newLesson.duration,
        order
      };
      
      const createdLesson = await createLesson(lessonData);
      
      if (createdLesson) {
        // Update local state
        const updatedModules = [...localModules];
        if (!updatedModules[moduleIndex].lessons) {
          updatedModules[moduleIndex].lessons = [];
        }
        updatedModules[moduleIndex].lessons.push(createdLesson);
        setLocalModules(updatedModules);
        
        setNewLesson({
          title: '',
          type: 'video',
          duration: '',
          order: 0
        });
        setShowAddLesson(null);
        setSuccess('Lesson added successfully!');
        
        // Refresh modules in the progress store to keep student dashboard in sync
        await refreshModules();
        
        // Refresh the admin view
        onRefresh();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      setError('Failed to add lesson. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleAddContent = async (moduleId: string, lessonId: string) => {
    if (!newContent.title || !newContent.type) {
      setError('Please fill in all required fields');
      return;
    }
    
    if ((newContent.type === 'video' || newContent.type === 'quiz' || 
         newContent.type === 'ppt' || newContent.type === 'link') && !newContent.url) {
      setError('Please provide a URL for this content type');
      return;
    }
    
    if (newContent.type === 'text' && !newContent.content) {
      setError('Please provide content for text type');
      return;
    }
    
    setIsLocalLoading(true);
    setError(null);
    
    try {
      // Find module and lesson
      const moduleIndex = localModules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        setError('Module not found');
        setIsLocalLoading(false);
        return;
      }
      
      const module = localModules[moduleIndex];
      const lessonIndex = module.lessons?.findIndex(l => l.id === lessonId);
      if (lessonIndex === undefined || lessonIndex === -1) {
        setError('Lesson not found');
        setIsLocalLoading(false);
        return;
      }
      
      // Determine the order for the new content
      const lesson = module.lessons[lessonIndex];
      const contents = lesson.content || [];
      const order = contents.length > 0 
        ? Math.max(...contents.map(c => c.order)) + 1 
        : 1;
      
      // Create new content
      const contentData = {
        lesson_id: lessonId,
        title: newContent.title,
        type: newContent.type,
        content: newContent.content || '',
        url: newContent.url,
        order
      };
      
      const createdContent = await createLessonContent(contentData);
      
      if (createdContent) {
        // Update local state
        const updatedModules = [...localModules];
        if (!updatedModules[moduleIndex].lessons[lessonIndex].content) {
          updatedModules[moduleIndex].lessons[lessonIndex].content = [];
        }
        updatedModules[moduleIndex].lessons[lessonIndex].content.push(createdContent);
        setLocalModules(updatedModules);
        
        setNewContent({
          title: '',
          type: 'video',
          content: '',
          url: '',
          order: 0
        });
        setShowAddContent(null);
        setSuccess('Content added successfully!');
        
        // Refresh modules in the progress store to keep student dashboard in sync
        await refreshModules();
        
        // Refresh the admin view
        onRefresh();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error adding content:', error);
      setError('Failed to add content. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons and content within it.')) {
      return;
    }
    
    setIsLocalLoading(true);
    
    try {
      const success = await onDeleteModule(moduleId);
      
      if (success) {
        // Update local state
        setLocalModules(localModules.filter(m => m.id !== moduleId));
        setSuccess('Module deleted successfully!');
        
        // Refresh modules in the progress store to keep student dashboard in sync
        await refreshModules();
        
        // Refresh the admin view
        onRefresh();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('Failed to delete module. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This will also delete all content within it.')) {
      return;
    }
    
    setIsLocalLoading(true);
    
    try {
      // Delete lesson from database
      await deleteLesson(lessonId);
      
      // Update local state
      const moduleIndex = localModules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const updatedModules = [...localModules];
        updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(l => l.id !== lessonId);
        setLocalModules(updatedModules);
      }
      
      setSuccess('Lesson deleted successfully!');
      
      // Refresh modules in the progress store to keep student dashboard in sync
      await refreshModules();
      
      // Refresh the admin view
      onRefresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError('Failed to delete lesson. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleDeleteContent = async (moduleId: string, lessonId: string, contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    setIsLocalLoading(true);
    
    try {
      // Delete content from database
      await deleteLessonContent(contentId);
      
      // Update local state
      const moduleIndex = localModules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        const lessonIndex = localModules[moduleIndex].lessons?.findIndex(l => l.id === lessonId);
        if (lessonIndex !== undefined && lessonIndex !== -1) {
          const updatedModules = [...localModules];
          updatedModules[moduleIndex].lessons[lessonIndex].content = 
            updatedModules[moduleIndex].lessons[lessonIndex].content?.filter(c => c.id !== contentId);
          setLocalModules(updatedModules);
        }
      }
      
      setSuccess('Content deleted successfully!');
      
      // Refresh modules in the progress store to keep student dashboard in sync
      await refreshModules();
      
      // Refresh the admin view
      onRefresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content. Please try again.');
    } finally {
      setIsLocalLoading(false);
    }
  };

  const toggleModuleExpanded = (moduleId: string) => {
    setLocalModules(localModules.map(m => 
      m.id === moduleId ? { ...m, expanded: !m.expanded } : m
    ));
  };

  const toggleLessonExpanded = async (moduleId: string, lessonId: string) => {
    const moduleIndex = localModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const lessonIndex = localModules[moduleIndex].lessons?.findIndex(l => l.id === lessonId);
    if (lessonIndex === undefined || lessonIndex === -1) return;
    
    const lesson = localModules[moduleIndex].lessons[lessonIndex];
    const isExpanding = !lesson.expanded;
    
    // If expanding and no content loaded yet, fetch content
    if (isExpanding && (!lesson.content || lesson.content.length === 0)) {
      try {
        const content = await getLessonContent(lessonId);
        
        // Update local state with content
        const updatedModules = [...localModules];
        updatedModules[moduleIndex].lessons[lessonIndex].content = content;
        updatedModules[moduleIndex].lessons[lessonIndex].expanded = true;
        setLocalModules(updatedModules);
      } catch (error) {
        console.error('Error fetching lesson content:', error);
        setError('Failed to load lesson content. Please try again.');
      }
    } else {
      // Just toggle expanded state
      setLocalModules(localModules.map(m => 
        m.id === moduleId ? {
          ...m,
          lessons: m.lessons?.map(l => 
            l.id === lessonId ? { ...l, expanded: !l.expanded } : l
          )
        } : m
      ));
    }
  };

  const getContentTypeIcon = (type: LessonContent['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'assignment':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'ppt':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'link':
        return <LinkIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLessonTypeIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'quiz':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'assignment':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'ppt':
        return <Presentation className="h-5 w-5 text-purple-500" />;
    }
  };

  const getModuleIcon = (order: number) => {
    const icons = [
      <Target className="h-5 w-5 text-blue-500" />,
      <Star className="h-5 w-5 text-purple-500" />,
      <DollarSign className="h-5 w-5 text-green-500" />,
      <Target className="h-5 w-5 text-amber-500" />,
      <Users className="h-5 w-5 text-red-500" />,
      <Rocket className="h-5 w-5 text-indigo-500" />
    ];
    
    return icons[(order - 1) % icons.length];
  };

  if (isLoading && localModules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
        <button
          onClick={() => setShowAddModule(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Module</span>
        </button>
      </div>

      {/* Error and Success Messages */}
      {(error || propError) && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error || propError}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Add Module Form */}
      {showAddModule && (
        <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-900">Add New Module</h3>
            <button
              onClick={() => setShowAddModule(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module Title*
              </label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter module title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter module description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration*
              </label>
              <input
                type="text"
                value={newModule.duration}
                onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 2 weeks"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddModule(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddModule}
              disabled={isLocalLoading || !newModule.title || !newModule.description || !newModule.duration}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLocalLoading ? 'Adding...' : 'Add Module'}
            </button>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-6">
        {localModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Module Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleModuleExpanded(module.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  {getModuleIcon(module.order)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {module.lessons?.length || 0} lessons
                </div>
                {module.expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {/* Module Content */}
            {module.expanded && (
              <div className="border-t border-gray-200 p-4">
                {/* Lessons List */}
                <div className="space-y-4">
                  {module.lessons?.map((lesson) => (
                    <div key={lesson.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      {/* Lesson Header */}
                      <div 
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleLessonExpanded(module.id, lesson.id)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                            {getLessonTypeIcon(lesson.type)}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <FileText className="h-3 w-3 mr-1" />
                            {lesson.content?.length || 0} items
                          </div>
                          {lesson.expanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Lesson Content */}
                      {lesson.expanded && (
                        <div className="border-t border-gray-200 p-3">
                          {/* Content List */}
                          {lesson.content && lesson.content.length > 0 ? (
                            <div className="space-y-2 mb-3">
                              {lesson.content.map((content) => (
                                <div key={content.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                                      {getContentTypeIcon(content.type)}
                                    </div>
                                    <div className="ml-2">
                                      <h5 className="text-xs font-medium text-gray-900">{content.title || `Content ${content.order}`}</h5>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {content.url && (
                                      <a 
                                        href={content.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-900"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <LinkIcon className="h-3 w-3" />
                                      </a>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteContent(module.id, lesson.id, content.id);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 mb-3">
                              No content items yet
                            </div>
                          )}
                          
                          {/* Add Content Button */}
                          {showAddContent === lesson.id ? (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-xs font-medium text-gray-900">Add Content Item</h5>
                                <button
                                  onClick={() => setShowAddContent(null)}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Title*
                                  </label>
                                  <input
                                    type="text"
                                    value={newContent.title}
                                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter content title"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Type*
                                  </label>
                                  <select
                                    value={newContent.type}
                                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as LessonContent['type'] })}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    <option value="video">Video</option>
                                    <option value="text">Text</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="assignment">Assignment</option>
                                    <option value="ppt">Presentation</option>
                                    <option value="link">Link</option>
                                  
                                  </select>
                                </div>
                                
                                {(newContent.type === 'video' || newContent.type === 'quiz' || 
                                  newContent.type === 'ppt' || newContent.type === 'link') && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      URL*
                                    </label>
                                    <input
                                      type="text"
                                      value={newContent.url}
                                      onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      placeholder="Enter URL"
                                    />
                                  </div>
                                )}
                                
                                {newContent.type === 'text' && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Content*
                                    </label>
                                    <textarea
                                      value={newContent.content}
                                      onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                                      rows={3}
                                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      placeholder="Enter content"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3 flex justify-end space-x-2">
                                <button
                                  onClick={() => setShowAddContent(null)}
                                  className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleAddContent(module.id, lesson.id)}
                                  disabled={isLocalLoading}
                                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                  {isLocalLoading ? 'Adding...' : 'Add Content'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddContent(lesson.id)}
                              className="flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-900"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Content</span>
                            </button>
                          )}
                          
                          {/* Lesson Actions */}
                          <div className="mt-3 flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Edit lesson logic
                                setEditingLesson(lesson);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLesson(module.id, lesson.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Add Lesson Form */}
                {showAddLesson === module.id ? (
                  <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Add New Lesson</h4>
                      <button
                        onClick={() => setShowAddLesson(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lesson Title*
                        </label>
                        <input
                          type="text"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter lesson title"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type*
                          </label>
                          <select
                            value={newLesson.type}
                            onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value as Lesson['type'] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                            <option value="ppt">Presentation</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration*
                          </label>
                          <input
                            type="text"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., 2 hours"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddLesson(null)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddLesson(module.id)}
                        disabled={isLocalLoading || !newLesson.title || !newLesson.type || !newLesson.duration}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isLocalLoading ? 'Adding...' : 'Add Lesson'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddLesson(module.id)}
                    className="mt-4 flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Lesson</span>
                  </button>
                )}
                
                {/* Module Actions */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit module logic
                      setEditingModule(module);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModule(module.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {localModules.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first course module</p>
            <button
              onClick={() => setShowAddModule(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Module
            </button>
          </div>
        )}
      </div>

      {/* Course Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Modules</h3>
              <p className="text-2xl font-bold text-indigo-600">{localModules.length}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {localModules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons total
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enrolled Students</h3>
              <p className="text-2xl font-bold text-purple-600">248</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            32 active in the last 24 hours
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Completion Rate</h3>
              <p className="text-2xl font-bold text-green-600">68%</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            12% increase from last month
          </div>
        </div>
      </div>
    </div>
  );
}