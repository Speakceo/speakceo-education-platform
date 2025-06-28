import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Calendar,
  Star,
  MessageSquare,
  Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Task, TaskSubmission } from '../../lib/types/tasks';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'file_upload',
    week_number: 1,
    points: 50,
    due_date: new Date().toISOString().split('T')[0],
    live_discussion: false
  });

  // Load tasks and submissions on component mount
  useEffect(() => {
    fetchTasks();
    fetchAllSubmissions();
  }, []);

  // Apply filters and search when tasks or filters change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply week filter
    if (filterWeek !== 'all') {
      result = result.filter(task => task.week_number === filterWeek);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filterWeek, searchQuery]);

  // Fetch all tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('week_number', { ascending: true });
      
      if (error) throw error;
      
      setTasks(data || []);
      setFilteredTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all student submissions
  const fetchAllSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*');
      
      if (error) throw error;
      
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  // Handle task creation
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description,
            type: newTask.type,
            task_type: newTask.type,
            week_number: newTask.week_number,
            points: newTask.points,
            due_date: newTask.due_date,
            live_discussion: newTask.live_discussion,
            status: 'active'
          }
        ])
        .select();
      
      if (error) throw error;
      
      setShowAddTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        type: 'file_upload',
        week_number: 1,
        points: 50,
        due_date: new Date().toISOString().split('T')[0],
        live_discussion: false
      });
      
      setSuccess('Task added successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get available weeks for filtering
  const getAvailableWeeks = () => {
    const weeks = [...new Set(tasks.map(task => task.week_number))];
    return weeks.sort((a, b) => a - b);
  };

  // Get submission count for a task
  const getSubmissionCount = (taskId: string) => {
    return submissions.filter(s => s.task_id === taskId).length;
  };

  // Get pending review count for a task
  const getPendingReviewCount = (taskId: string) => {
    return submissions.filter(s => s.task_id === taskId && s.status === 'submitted').length;
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      setSuccess('Task deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
      
      if (error) throw error;
      
      setSuccess('Task updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
        <button
          onClick={() => setShowAddTaskForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={filterWeek === 'all' ? 'all' : filterWeek.toString()}
              onChange={(e) => setFilterWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">All Weeks</option>
              {getAvailableWeeks().map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks list */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterWeek !== 'all' 
                ? 'Try changing your search or filters'
                : 'Get started by adding your first task'}
            </p>
            {searchQuery || filterWeek !== 'all' ? (
              <button
                onClick={() => { setSearchQuery(''); setFilterWeek('all'); }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowAddTaskForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                          task.type === 'file_upload' ? 'bg-purple-100 text-purple-600' :
                          task.type === 'text' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {task.type === 'file_upload' ? (
                            <Upload className="h-5 w-5" />
                          ) : task.type === 'text' ? (
                            <FileText className="h-5 w-5" />
                          ) : (
                            <MessageSquare className="h-5 w-5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {task.description?.substring(0, 50)}
                            {task.description && task.description.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Week {task.week_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.type === 'file_upload' ? 'bg-purple-100 text-purple-800' :
                        task.type === 'text' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.type === 'file_upload' ? 'File Upload' :
                         task.type === 'text' ? 'Text Response' : 'Multiple Choice'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.due_date 
                        ? new Date(task.due_date).toLocaleDateString() 
                        : 'No deadline'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-1" />
                        {task.points}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getSubmissionCount(task.id)} submissions
                      </div>
                      {getPendingReviewCount(task.id) > 0 && (
                        <div className="text-xs text-amber-600 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {getPendingReviewCount(task.id)} pending review
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setShowEditTaskForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Task Form Modal */}
      {showAddTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Add New Task</h2>
            
            <div className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title"
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the task requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="file_upload">File Upload</option>
                    <option value="text">Text Response</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="essay">Essay</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>

                {/* Week Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Number
                  </label>
                  <select
                    value={newTask.week_number}
                    onChange={(e) => setNewTask({ ...newTask, week_number: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={newTask.points}
                    onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Live Discussion */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="live_discussion"
                  checked={newTask.live_discussion}
                  onChange={(e) => setNewTask({ ...newTask, live_discussion: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="live_discussion" className="ml-2 text-sm text-gray-700">
                  Include live discussion session
                </label>
              </div>

              {/* File Upload Instructions (if file upload type) */}
              {newTask.type === 'file_upload' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">File Upload Instructions</h4>
                  <p className="text-sm text-blue-700">
                    Students will be able to upload files for this task. Supported formats: PDF, DOC, DOCX, PNG, JPG, MP4 (max 50MB)
                  </p>
                </div>
              )}

              {/* Multiple Choice Options (if multiple choice type) */}
              {newTask.type === 'multiple_choice' && (
                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-green-900 mb-2">Multiple Choice Setup</h4>
                  <p className="text-sm text-green-700">
                    After creating this task, you can add questions and options in the task details page.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowAddTaskForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.description}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 