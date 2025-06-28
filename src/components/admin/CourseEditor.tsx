import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  X, 
  Save, 
  Edit, 
  Trash, 
  ChevronUp, 
  ChevronDown, 
  BookOpen,
  Video,
  FileText,
  Image,
  Award
} from 'lucide-react';

// Simplified version of the learning path for admin editing
// In a real app, this would be fetched from the backend
const COURSE_TEMPLATE = {
  weeks: '',
  title: '',
  description: '',
  icon: 'Target',
  color: 'from-blue-500 to-indigo-500',
  modules: []
};

const MODULE_TEMPLATE = {
  title: '',
  icon: 'BookOpen',
  duration: '',
  slides: []
};

const SLIDE_TEMPLATE = {
  id: '',
  title: '',
  type: 'text',
  content: '',
  url: '',
  order: 0
};

interface IconOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const ICON_OPTIONS: IconOption[] = [
  { value: 'BookOpen', label: 'Book', icon: BookOpen },
  { value: 'Video', label: 'Video', icon: Video },
  { value: 'FileText', label: 'Document', icon: FileText },
  { value: 'Image', label: 'Image', icon: Image },
  { value: 'Award', label: 'Award', icon: Award }
];

const COLOR_OPTIONS = [
  { value: 'from-blue-500 to-indigo-500', label: 'Blue' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple' },
  { value: 'from-green-500 to-emerald-500', label: 'Green' },
  { value: 'from-amber-500 to-orange-500', label: 'Orange' },
  { value: 'from-red-500 to-pink-500', label: 'Red' },
  { value: 'from-purple-600 to-indigo-600', label: 'Deep Purple' }
];

const TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'ppt', label: 'Presentation' },
  { value: 'link', label: 'Link' }
];

export default function CourseEditor() {
  const [courses, setCourses] = useState(() => {
    // Initialize with data from localStorage if available
    const savedCourses = localStorage.getItem('90dayJourneyCourses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [expandedModule, setExpandedModule] = useState<{courseIndex: number, moduleIndex: number} | null>(null);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [editingModule, setEditingModule] = useState<{courseIndex: number, moduleIndex: number} | null>(null);
  const [editingSlide, setEditingSlide] = useState<{courseIndex: number, moduleIndex: number, slideIndex: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('90dayJourneyCourses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = () => {
    setCourses([...courses, {...COURSE_TEMPLATE, weeks: `${courses.length + 1}-${courses.length + 2}`}]);
    setExpandedCourse(courses.length);
    setEditingCourse(courses.length);
  };

  const updateCourse = (index: number, field: string, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value
    };
    setCourses(updatedCourses);
  };

  const deleteCourse = (index: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = [...courses];
      updatedCourses.splice(index, 1);
      setCourses(updatedCourses);
      setExpandedCourse(null);
      setEditingCourse(null);
    }
  };

  const addModule = (courseIndex: number) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].modules.push({...MODULE_TEMPLATE});
    setCourses(updatedCourses);
    setExpandedModule({courseIndex, moduleIndex: updatedCourses[courseIndex].modules.length - 1});
    setEditingModule({courseIndex, moduleIndex: updatedCourses[courseIndex].modules.length - 1});
  };

  const updateModule = (courseIndex: number, moduleIndex: number, field: string, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].modules[moduleIndex] = {
      ...updatedCourses[courseIndex].modules[moduleIndex],
      [field]: value
    };
    setCourses(updatedCourses);
  };

  const deleteModule = (courseIndex: number, moduleIndex: number) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].modules.splice(moduleIndex, 1);
      setCourses(updatedCourses);
      setExpandedModule(null);
      setEditingModule(null);
    }
  };

  const addSlide = (courseIndex: number, moduleIndex: number) => {
    const updatedCourses = [...courses];
    const slideId = `${courseIndex + 1}.${moduleIndex + 1}.${updatedCourses[courseIndex].modules[moduleIndex].slides.length + 1}`;
    updatedCourses[courseIndex].modules[moduleIndex].slides.push({
      ...SLIDE_TEMPLATE,
      id: slideId,
      order: updatedCourses[courseIndex].modules[moduleIndex].slides.length + 1
    });
    setCourses(updatedCourses);
    setEditingSlide({
      courseIndex, 
      moduleIndex, 
      slideIndex: updatedCourses[courseIndex].modules[moduleIndex].slides.length - 1
    });
  };

  const updateSlide = (courseIndex: number, moduleIndex: number, slideIndex: number, field: string, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].modules[moduleIndex].slides[slideIndex] = {
      ...updatedCourses[courseIndex].modules[moduleIndex].slides[slideIndex],
      [field]: value
    };
    setCourses(updatedCourses);
  };

  const deleteSlide = (courseIndex: number, moduleIndex: number, slideIndex: number) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].modules[moduleIndex].slides.splice(slideIndex, 1);
      
      // Re-number the remaining slides
      updatedCourses[courseIndex].modules[moduleIndex].slides.forEach((slide, idx) => {
        slide.order = idx + 1;
      });
      
      setCourses(updatedCourses);
      setEditingSlide(null);
    }
  };

  const saveCourses = () => {
    setIsSaving(true);
    
    try {
      // Save to localStorage for demo purposes
      localStorage.setItem('90dayJourneyCourses', JSON.stringify(courses));
      
      // In a real app, this would be an API call
      // await api.saveCourses(courses);
      
      setSaveMessage('Course data saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving courses:', error);
      setSaveMessage('Error saving course data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const option = ICON_OPTIONS.find(opt => opt.value === iconName);
    if (option) {
      const IconComponent = option.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">90-Day Journey Course Editor</h1>
        <div className="flex space-x-4">
          <button
            onClick={addCourse}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Section
          </button>
          <button
            onClick={saveCourses}
            disabled={isSaving}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
      
      {saveMessage && (
        <div className={`p-3 mb-4 rounded-md ${saveMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-6">
        {courses.map((course, courseIndex) => (
          <div key={courseIndex} className="border border-gray-200 rounded-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => setExpandedCourse(expandedCourse === courseIndex ? null : courseIndex)}
            >
              <div className="flex items-center">
                {expandedCourse === courseIndex ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 mr-2" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <h2 className="text-lg font-medium">
                  {course.title || `Week ${course.weeks} (Untitled Section)`}
                </h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourse(editingCourse === courseIndex ? null : courseIndex);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCourse(courseIndex);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Course Editing Form */}
            {editingCourse === courseIndex && (
              <div className="p-4 bg-gray-100 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weeks</label>
                    <input
                      type="text"
                      value={course.weeks}
                      onChange={(e) => updateCourse(courseIndex, 'weeks', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g. 1-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => updateCourse(courseIndex, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Section Title"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={course.description}
                      onChange={(e) => updateCourse(courseIndex, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Section Description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={course.icon}
                      onChange={(e) => updateCourse(courseIndex, 'icon', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      value={course.color}
                      onChange={(e) => updateCourse(courseIndex, 'color', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {COLOR_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Course Modules */}
            {expandedCourse === courseIndex && (
              <div className="p-4">
                {course.modules.length === 0 ? (
                  <p className="text-gray-500 italic">No modules added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-gray-200 rounded-md">
                        <div 
                          className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                          onClick={() => setExpandedModule(
                            expandedModule?.courseIndex === courseIndex && expandedModule?.moduleIndex === moduleIndex 
                              ? null 
                              : {courseIndex, moduleIndex}
                          )}
                        >
                          <div className="flex items-center">
                            {expandedModule?.courseIndex === courseIndex && expandedModule?.moduleIndex === moduleIndex ? (
                              <ChevronUp className="h-4 w-4 text-gray-500 mr-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                            )}
                            <div className="flex items-center">
                              <div className="mr-2 flex items-center justify-center h-6 w-6 bg-indigo-100 text-indigo-600 rounded-md">
                                {getIconComponent(module.icon)}
                              </div>
                              <h3 className="font-medium">
                                {module.title || "Untitled Module"}
                              </h3>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingModule(
                                  editingModule?.courseIndex === courseIndex && editingModule?.moduleIndex === moduleIndex 
                                    ? null 
                                    : {courseIndex, moduleIndex}
                                );
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModule(courseIndex, moduleIndex);
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Module Editing Form */}
                        {editingModule?.courseIndex === courseIndex && editingModule?.moduleIndex === moduleIndex && (
                          <div className="p-3 bg-gray-100 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                  type="text"
                                  value={module.title}
                                  onChange={(e) => updateModule(courseIndex, moduleIndex, 'title', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  placeholder="Module Title"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                  type="text"
                                  value={module.duration}
                                  onChange={(e) => updateModule(courseIndex, moduleIndex, 'duration', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  placeholder="e.g. 2h"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                <select
                                  value={module.icon}
                                  onChange={(e) => updateModule(courseIndex, moduleIndex, 'icon', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                  {ICON_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Module Slides */}
                        {expandedModule?.courseIndex === courseIndex && expandedModule?.moduleIndex === moduleIndex && (
                          <div className="p-3 border-t border-gray-200">
                            {module.slides.length === 0 ? (
                              <p className="text-gray-500 italic">No slides added yet.</p>
                            ) : (
                              <ul className="space-y-2">
                                {module.slides.map((slide, slideIndex) => (
                                  <li key={slideIndex} className="border border-gray-200 rounded-md">
                                    <div className="flex justify-between items-center p-2 bg-gray-50">
                                      <div className="flex items-center">
                                        <span className="inline-flex items-center justify-center h-5 w-5 bg-gray-200 text-gray-800 rounded-full text-xs font-medium mr-2">
                                          {slide.order}
                                        </span>
                                        <span className="font-medium">{slide.title || "Untitled Slide"}</span>
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">
                                          {slide.type}
                                        </span>
                                      </div>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => setEditingSlide(
                                            editingSlide?.courseIndex === courseIndex && 
                                            editingSlide?.moduleIndex === moduleIndex && 
                                            editingSlide?.slideIndex === slideIndex
                                              ? null 
                                              : {courseIndex, moduleIndex, slideIndex}
                                          )}
                                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => deleteSlide(courseIndex, moduleIndex, slideIndex)}
                                          className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Slide Editing Form */}
                                    {editingSlide?.courseIndex === courseIndex && 
                                     editingSlide?.moduleIndex === moduleIndex && 
                                     editingSlide?.slideIndex === slideIndex && (
                                      <div className="p-3 bg-gray-100 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                              type="text"
                                              value={slide.title}
                                              onChange={(e) => updateSlide(courseIndex, moduleIndex, slideIndex, 'title', e.target.value)}
                                              className="w-full p-2 border border-gray-300 rounded-md"
                                              placeholder="Slide Title"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                              value={slide.type}
                                              onChange={(e) => updateSlide(courseIndex, moduleIndex, slideIndex, 'type', e.target.value)}
                                              className="w-full p-2 border border-gray-300 rounded-md"
                                            >
                                              {TYPE_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                  {option.label}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          
                                          {slide.type === 'text' ? (
                                            <div className="md:col-span-2">
                                              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                              <textarea
                                                value={slide.content}
                                                onChange={(e) => updateSlide(courseIndex, moduleIndex, slideIndex, 'content', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                rows={6}
                                                placeholder="Enter markdown content here"
                                              />
                                            </div>
                                          ) : (
                                            <div className="md:col-span-2">
                                              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                              <input
                                                type="text"
                                                value={slide.url}
                                                onChange={(e) => updateSlide(courseIndex, moduleIndex, slideIndex, 'url', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="Enter resource URL"
                                              />
                                            </div>
                                          )}
                                          
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                            <input
                                              type="number"
                                              value={slide.order}
                                              onChange={(e) => updateSlide(courseIndex, moduleIndex, slideIndex, 'order', parseInt(e.target.value))}
                                              className="w-full p-2 border border-gray-300 rounded-md"
                                              min="1"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                            
                            <button
                              onClick={() => addSlide(courseIndex, moduleIndex)}
                              className="mt-3 flex items-center px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Add Slide
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={() => addModule(courseIndex)}
                  className="mt-4 flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Module
                </button>
              </div>
            )}
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No course sections added yet.</p>
            <button
              onClick={addCourse}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mx-auto"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Your First Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 