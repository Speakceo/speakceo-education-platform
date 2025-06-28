import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Brain, 
  PenTool, 
  Upload, 
  Edit, 
  Save, 
  Plus, 
  Trash2,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { Week, Lesson, Quiz, Task } from '../../types';
import youngCEOProgram from '../../lib/courseProgramData';

export default function CourseContentManager() {
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'quiz' | 'task'>('lessons');

  const handleSaveLesson = (lesson: Lesson) => {
    // In a real implementation, this would save to the database
    console.log('Saving lesson:', lesson);
    setEditingLesson(null);
  };

  const handleSaveQuiz = (quiz: Quiz) => {
    // In a real implementation, this would save to the database
    console.log('Saving quiz:', quiz);
    setEditingQuiz(null);
  };

  const handleSaveTask = (task: Task) => {
    // In a real implementation, this would save to the database
    console.log('Saving task:', task);
    setEditingTask(null);
  };

  const handleFileUpload = (file: File, type: 'video' | 'pdf' | 'ppt', lessonId: string) => {
    // In a real implementation, this would upload to cloud storage
    console.log('Uploading file:', file.name, 'for lesson:', lessonId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Course Content Manager</h1>
        </div>
        <p className="text-xl text-gray-600">
          Manage the 90-Day Young CEO Program content, lessons, quizzes, and tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Week Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Program Weeks</h2>
            <div className="space-y-2">
              {youngCEOProgram.weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedWeek?.id === week.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">Week {week.weekNumber}</div>
                  <div className="text-sm text-gray-500 truncate">{week.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          {selectedWeek ? (
            <div className="bg-white rounded-xl shadow-sm">
              {/* Week Header */}
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Week {selectedWeek.weekNumber}: {selectedWeek.title}
                </h2>
                <p className="text-gray-600 mt-2">{selectedWeek.description}</p>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('lessons')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'lessons'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Lessons ({selectedWeek.lessons.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'quiz'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Quiz
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('task')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'task'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Task
                    </div>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'lessons' && (
                  <LessonsManager
                    lessons={selectedWeek.lessons}
                    onEdit={setEditingLesson}
                    onFileUpload={handleFileUpload}
                  />
                )}
                
                {activeTab === 'quiz' && (
                  <QuizManager
                    quiz={selectedWeek.quiz}
                    onEdit={setEditingQuiz}
                  />
                )}
                
                {activeTab === 'task' && (
                  <TaskManager
                    task={selectedWeek.task}
                    onEdit={setEditingTask}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Week</h3>
              <p className="text-gray-500">Choose a week from the sidebar to manage its content</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson}
          onSave={handleSaveLesson}
          onClose={() => setEditingLesson(null)}
        />
      )}

      {editingQuiz && (
        <QuizEditModal
          quiz={editingQuiz}
          onSave={handleSaveQuiz}
          onClose={() => setEditingQuiz(null)}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

// Lessons Manager Component
interface LessonsManagerProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onFileUpload: (file: File, type: 'video' | 'pdf' | 'ppt', lessonId: string) => void;
}

function LessonsManager({ lessons, onEdit, onFileUpload }: LessonsManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Add Lesson
        </button>
      </div>

      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Duration: {lesson.duration} min</span>
                <span>Order: {lesson.order}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(lesson)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* File Management */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUploadCard
              title="Video"
              icon={<Video className="h-5 w-5" />}
              currentFile={lesson.videoUrl}
              onUpload={(file) => onFileUpload(file, 'video', lesson.id)}
              accept="video/*"
            />
            <FileUploadCard
              title="PDF"
              icon={<FileText className="h-5 w-5" />}
              currentFile={lesson.pdfUrl}
              onUpload={(file) => onFileUpload(file, 'pdf', lesson.id)}
              accept=".pdf"
            />
            <FileUploadCard
              title="PPT"
              icon={<FileText className="h-5 w-5" />}
              currentFile={lesson.pptUrl}
              onUpload={(file) => onFileUpload(file, 'ppt', lesson.id)}
              accept=".ppt,.pptx"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// File Upload Card Component
interface FileUploadCardProps {
  title: string;
  icon: React.ReactNode;
  currentFile?: string;
  onUpload: (file: File) => void;
  accept: string;
}

function FileUploadCard({ title, icon, currentFile, onUpload, accept }: FileUploadCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      
      {currentFile ? (
        <div className="space-y-2">
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
            File uploaded
          </div>
          <div className="flex gap-2">
            <button className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded flex items-center justify-center gap-1">
              <Eye className="h-3 w-3" />
              View
            </button>
            <label className="flex-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded flex items-center justify-center gap-1 cursor-pointer">
              <Upload className="h-3 w-3" />
              Replace
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="block w-full text-xs bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 p-4 rounded text-center cursor-pointer">
          <Upload className="h-4 w-4 mx-auto mb-1 text-gray-400" />
          Upload {title}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}

// Quiz Manager Component
interface QuizManagerProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
}

function QuizManager({ quiz, onEdit }: QuizManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Quiz</h3>
        <button
          onClick={() => onEdit(quiz)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          Edit Quiz
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">{quiz.title}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>Questions: {quiz.questions.length}</div>
          <div>XP Reward: {quiz.xpReward}</div>
        </div>
        
        <div className="space-y-3">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-sm mb-2">
                {index + 1}. {question.question}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2 rounded ${
                      optIndex === question.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-white'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Task Manager Component
interface TaskManagerProps {
  task: Task;
  onEdit: (task: Task) => void;
}

function TaskManager({ task, onEdit }: TaskManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Task</h3>
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Edit className="h-4 w-4" />
          Edit Task
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
        <p className="text-gray-600 mb-3">{task.description}</p>
        
        <div className="bg-blue-50 p-3 rounded mb-3">
          <h5 className="font-medium text-blue-900 mb-1">Instructions:</h5>
          <p className="text-blue-800 text-sm">{task.instructions}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Type:</span>
            <div className="font-medium capitalize">{task.type}</div>
          </div>
          <div>
            <span className="text-gray-500">XP Reward:</span>
            <div className="font-medium">{task.xpReward}</div>
          </div>
          <div>
            <span className="text-gray-500">Due Date:</span>
            <div className="font-medium">{task.dueDate || 'No deadline'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal Components (simplified for brevity)
interface LessonEditModalProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onClose: () => void;
}

function LessonEditModal({ lesson, onSave, onClose }: LessonEditModalProps) {
  const [editedLesson, setEditedLesson] = useState(lesson);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editedLesson.title}
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editedLesson.description}
              onChange={(e) => setEditedLesson({...editedLesson, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={editedLesson.duration}
                onChange={(e) => setEditedLesson({...editedLesson, duration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={editedLesson.order}
                onChange={(e) => setEditedLesson({...editedLesson, order: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedLesson)}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Simplified Quiz and Task edit modals
function QuizEditModal({ quiz, onSave, onClose }: { quiz: Quiz; onSave: (quiz: Quiz) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>
        <p className="text-gray-600 mb-4">Quiz editing interface would go here...</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onSave(quiz)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

function TaskEditModal({ task, onSave, onClose }: { task: Task; onSave: (task: Task) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <p className="text-gray-600 mb-4">Task editing interface would go here...</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
          <button onClick={() => onSave(task)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
} 