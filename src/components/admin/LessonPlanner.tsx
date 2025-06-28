import React, { useState, useEffect } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from 'react-beautiful-dnd';
import { 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Plus, 
  Save, 
  Trash2,
  Video,
  FileText,
  Brain,
  CheckCircle,
  PenTool,
  Clock,
  Lock
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: string;
  module_id: string;
  duration?: string;
  points?: number;
  order?: number;
  order_index?: number;
  [key: string]: any; // Allow additional properties
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration?: string;
  order?: number;
  order_index?: number;
  [key: string]: any; // Allow additional properties
}

interface LessonPlannerProps {
  modules: Module[];
  onSaveOrder: (modules: Module[]) => Promise<void>;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (moduleId: string, lessonId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onAddModule: () => void;
  onEditModule: (moduleId: string) => void;
  onDeleteModule: (moduleId: string) => void;
}

export default function LessonPlanner({
  modules,
  onSaveOrder,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onAddModule,
  onEditModule,
  onDeleteModule
}: LessonPlannerProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [localModules, setLocalModules] = useState<Module[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  useEffect(() => {
    setLocalModules(modules);
    
    // Expand first module by default
    if (modules.length > 0 && Object.keys(expandedModules).length === 0) {
      setExpandedModules({ [modules[0].id]: true });
    }
  }, [modules]);
  
  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  const handleReorderModules = async (sourceIndex: number, destinationIndex: number) => {
    // Skip if same position
    if (sourceIndex === destinationIndex) return;
    
    const reorderedModules = Array.from(localModules);
    const [removed] = reorderedModules.splice(sourceIndex, 1);
    reorderedModules.splice(destinationIndex, 0, removed);
    
    // Update order property
    const updatedModules = reorderedModules.map((module, index) => ({
      ...module,
      order: index + 1,
      order_index: index + 1
    }));
    
    setLocalModules(updatedModules);
    
    // Save new order to backend
    try {
      setIsSaving(true);
      await onSaveOrder(updatedModules);
      setSaveMessage('Module order saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving module order:', error);
      setSaveMessage('Error saving module order');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReorderLessons = async (moduleId: string, sourceIndex: number, destinationIndex: number) => {
    // Skip if same position
    if (sourceIndex === destinationIndex) return;
    
    const moduleIndex = localModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const moduleToUpdate = { ...localModules[moduleIndex] };
    const lessons = Array.from(moduleToUpdate.lessons || []);
    const [removed] = lessons.splice(sourceIndex, 1);
    lessons.splice(destinationIndex, 0, removed);
    
    // Update order property
    const updatedLessons = lessons.map((lesson: Lesson, index: number) => ({
      ...lesson,
      order: index + 1,
      order_index: index + 1
    }));
    
    moduleToUpdate.lessons = updatedLessons;
    
    const updatedModules = [...localModules];
    updatedModules[moduleIndex] = moduleToUpdate;
    
    setLocalModules(updatedModules);
    
    // Save new order to backend
    try {
      setIsSaving(true);
      await onSaveOrder(updatedModules);
      setSaveMessage('Lesson order saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving lesson order:', error);
      setSaveMessage('Error saving lesson order');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMoveLessonBetweenModules = async (sourceModuleId: string, destinationModuleId: string, 
                                             sourceIndex: number, destinationIndex: number, lessonId: string) => {
    const sourceModuleIndex = localModules.findIndex(m => m.id === sourceModuleId);
    const destModuleIndex = localModules.findIndex(m => m.id === destinationModuleId);
    
    if (sourceModuleIndex === -1 || destModuleIndex === -1) return;
    
    const updatedModules = [...localModules];
    
    // Get source and destination modules
    const sourceModule = { ...updatedModules[sourceModuleIndex] };
    const destModule = { ...updatedModules[destModuleIndex] };
    
    // Get lessons arrays
    const sourceLessons = Array.from(sourceModule.lessons || []);
    const destLessons = Array.from(destModule.lessons || []);
    
    // Find the lesson to move
    const lessonToMove = sourceLessons.find((l: Lesson) => l.id === lessonId);
    if (!lessonToMove) return;
    
    // Remove lesson from source
    const filteredSourceLessons = sourceLessons.filter((l: Lesson) => l.id !== lessonId);
    
    // Update the module_id of the moved lesson
    lessonToMove.module_id = destinationModuleId;
    
    // Add to destination
    destLessons.splice(destinationIndex, 0, lessonToMove);
    
    // Update order property for both modules
    const updatedSourceLessons = filteredSourceLessons.map((lesson: Lesson, index: number) => ({
      ...lesson,
      order: index + 1,
      order_index: index + 1
    }));
    
    const updatedDestLessons = destLessons.map((lesson: Lesson, index: number) => ({
      ...lesson,
      order: index + 1,
      order_index: index + 1
    }));
    
    sourceModule.lessons = updatedSourceLessons;
    destModule.lessons = updatedDestLessons;
    
    updatedModules[sourceModuleIndex] = sourceModule;
    updatedModules[destModuleIndex] = destModule;
    
    setLocalModules(updatedModules);
    
    // Save new order to backend
    try {
      setIsSaving(true);
      await onSaveOrder(updatedModules);
      setSaveMessage('Lesson moved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error moving lesson:', error);
      setSaveMessage('Error moving lesson');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'ppt':
        return <PenTool className="h-4 w-4 text-purple-500" />;
      case 'quiz':
        return <Brain className="h-4 w-4 text-green-500" />;
      case 'assignment':
        return <CheckCircle className="h-4 w-4 text-pink-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getWeekAndDay = (moduleIndex: number, lessonIndex: number) => {
    // Calculate the week (1-12) and day (1-90) based on module and lesson position
    const week = Math.floor(moduleIndex / 3) + 1;
    
    // Calculate absolute day position (1-90)
    let dayCounter = 0;
    for (let i = 0; i < moduleIndex; i++) {
      dayCounter += localModules[i].lessons?.length || 0;
    }
    dayCounter += lessonIndex + 1;
    
    return { week, day: dayCounter };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">90-Day Startup Journey Planner</h2>
        <div className="flex items-center space-x-3">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={onAddModule}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Module
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Course Modules</h3>
          <p className="text-sm text-gray-500">Plan your 90-day journey modules and lessons</p>
        </div>
        
        <div className="space-y-2 p-4">
          {localModules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="rounded-lg border border-gray-200 overflow-hidden"
            >
              <div 
                className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleModuleExpanded(module.id)}
              >
                <div className="flex items-center">
                  <div
                    className="p-2 mr-2 rounded-md hover:bg-gray-200 cursor-move"
                    onMouseDown={() => {/* Handle drag start */}}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                        {moduleIndex + 1}
                      </span>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Week {Math.floor(moduleIndex / 3) + 1}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{module.duration || 'N/A'}</span>
                      <span className="mx-2">•</span>
                      <span>{module.lessons?.length || 0} lessons</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditModule(module.id);
                    }}
                    className="p-1 text-gray-500 hover:text-indigo-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModule(module.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedModules[module.id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedModules[module.id] && (
                <div className="p-4 border-t border-gray-200">
                  <div className="mb-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Lessons</p>
                    <button
                      onClick={() => onAddLesson(module.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Lesson
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {module.lessons?.length > 0 ? (
                      module.lessons.map((lesson: Lesson, lessonIndex: number) => {
                        const { day } = getWeekAndDay(moduleIndex, lessonIndex);
                        
                        return (
                          <div
                            key={lesson.id}
                            className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 cursor-move"
                          >
                            <div className="flex items-center">
                              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 text-sm">{lesson.title}</h5>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Day {day}
                                  </span>
                                  <span className="mx-1">•</span>
                                  <span className="capitalize">{lesson.type}</span>
                                  {lesson.duration && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <Clock className="h-3 w-3 mr-0.5" />
                                      <span>{lesson.duration}</span>
                                    </>
                                  )}
                                  {lesson.points && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span className="text-indigo-600 font-medium">+{lesson.points} XP</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => onEditLesson(module.id, lesson.id)}
                                className="p-1 text-gray-500 hover:text-indigo-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onDeleteLesson(module.id, lesson.id)}
                                className="p-1 text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        <Lock className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p>No lessons in this module</p>
                        <button
                          onClick={() => onAddLesson(module.id)}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Add your first lesson
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {localModules.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No modules yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first module</p>
              <button
                onClick={onAddModule}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Module
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 