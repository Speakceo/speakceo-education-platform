import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Star, 
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getTasks, getTaskSubmissions } from '../../lib/api/tasks';
import { useUserStore } from '../../lib/store';
import { useProgressStore } from '../../lib/stores/progressStore';
import { useUnifiedProgressStore } from '../../lib/stores/unifiedProgressStore';
import { useRealTimeProgressStore } from '../../lib/stores/realTimeProgressStore';
import TaskSubmissionModal from './TaskSubmissionModal';
import ProgressBar from '../ui/ProgressBar';
import type { Task, TaskSubmission } from '../../lib/types/tasks';

export default function Tasks() {
  const { user } = useUserStore();
  const { 
    fetchUserProgress, 
    updateTaskProgress, 
    getCompletedTasks, 
    getTotalTasks 
  } = useProgressStore();
  const { recordActivity } = useUnifiedProgressStore();
  const { markTaskComplete } = useRealTimeProgressStore();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await loadTasks();
        await loadSubmissions();
      } catch (error) {
        console.error('Failed to initialize tasks:', error);
        setError('Failed to load tasks. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTasks();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id);
    }
  }, [user, fetchUserProgress]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      throw new Error('Failed to load tasks');
    }
  };

  const loadSubmissions = async () => {
    if (!user) return;
    try {
      const data = await getTaskSubmissions(user.id);
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      // Don't throw here as this is not critical
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSuccess = async () => {
    if (selectedTask) {
      await updateTaskProgress(selectedTask.id, 'submitted');
      
      // Real-time progress update
      await markTaskComplete(selectedTask.id, selectedTask.points);
      
      recordActivity({
        type: 'task',
        title: `Submitted ${selectedTask.title}`,
        xpEarned: selectedTask.points
      });
    }
    
    loadSubmissions();
  };

  const getSubmissionStatus = (taskId: string) => {
    const submission = submissions.find(s => s.task_id === taskId);
    return submission?.status || 'pending';
  };

  const completedTasks = getCompletedTasks();
  const totalTasks = getTotalTasks() || tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tasks & Assignments</h2>
            <p className="text-gray-500 mt-1">Track your progress and submit assignments</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {completedTasks}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {totalTasks}
              </p>
              <p className="text-sm text-gray-500">Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(completionRate)}%
            </span>
          </div>
          <ProgressBar 
            progress={completionRate} 
            size="md"
            showLabel={false}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading && tasks.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Available</h3>
              <p className="text-gray-500">
                There are no tasks assigned to you at the moment. Check back later!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Tasks</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`rounded-lg p-2 ${
                          task.task_type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                          task.task_type === 'quiz' ? 'bg-blue-100 text-blue-600' :
                          task.task_type === 'project' ? 'bg-green-100 text-green-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {task.task_type === 'assignment' ? (
                            <Upload className="h-5 w-5" />
                          ) : task.task_type === 'quiz' ? (
                            <FileText className="h-5 w-5" />
                          ) : task.task_type === 'project' ? (
                            <Star className="h-5 w-5" />
                          ) : (
                            <MessageSquare className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="h-4 w-4 mr-1" />
                              {task.points} points
                            </div>
                            {task.due_date && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-blue-600">
                              <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium">
                                {task.task_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getSubmissionStatus(task.id) === 'graded' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : getSubmissionStatus(task.id) === 'submitted' ? (
                          <Clock className="h-6 w-6 text-amber-500" />
                        ) : (
                          <button
                            onClick={() => handleTaskClick(task)}
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Task Description Preview */}
                    {task.description && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Tasks</span>
                <span className="font-semibold text-orange-600">
                  {tasks.filter(task => getSubmissionStatus(task.id) === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Submitted</span>
                <span className="font-semibold text-blue-600">
                  {tasks.filter(task => getSubmissionStatus(task.id) === 'submitted').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Graded</span>
                <span className="font-semibold text-green-600">
                  {tasks.filter(task => getSubmissionStatus(task.id) === 'graded').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Points</span>
                <span className="font-semibold text-purple-600">
                  {tasks.reduce((sum, task) => sum + task.points, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Task Types */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Types</h3>
            <div className="space-y-3">
              {['assignment', 'quiz', 'project', 'discussion'].map((type) => {
                const count = tasks.filter(task => task.task_type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{type}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {showSubmissionModal && selectedTask && (
        <TaskSubmissionModal
          task={selectedTask}
          onSubmit={handleSubmissionSuccess}
          onClose={() => setShowSubmissionModal(false)}
        />
      )}
    </div>
  );
}