import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CourseStats {
  id: string;
  title: string;
  total_students: number;
  active_students: number;
  completion_rate: number;
  average_progress: number;
  average_quiz_score: number;
  total_lessons: number;
  total_modules: number;
  enrollment_trend: {
    date: string;
    count: number;
  }[];
  module_completion: {
    module_id: string;
    title: string;
    completion_rate: number;
  }[];
}

export default function CourseAnalytics() {
  const [stats, setStats] = useState<CourseStats[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('course_analytics')
        .select('*')
        .eq('time_range', timeRange);

      if (error) throw error;
      setStats(data || []);
      if (data && data.length > 0) {
        setSelectedCourse(data[0]);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Analytics</h1>
          <p className="text-gray-600 mt-1">Track course performance and student engagement</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === 'week'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeRange === 'year'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
          </div>
          <div className="divide-y">
            {stats.map(course => (
              <div
                key={course.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedCourse?.id === course.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {formatNumber(course.total_students)} students
                    </div>
                    <div className={`text-sm font-medium ${getProgressColor(course.completion_rate)}`}>
                      {course.completion_rate}% completion
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedCourse ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{selectedCourse.title}</h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Total Students</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(selectedCourse.total_students)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Active Students</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(selectedCourse.active_students)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className={`text-lg font-semibold ${getProgressColor(selectedCourse.completion_rate)}`}>
                        {selectedCourse.completion_rate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Avg. Quiz Score</p>
                      <p className={`text-lg font-semibold ${getProgressColor(selectedCourse.average_quiz_score)}`}>
                        {selectedCourse.average_quiz_score}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module Completion */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Completion</h3>
                <div className="space-y-4">
                  {selectedCourse.module_completion.map(module => (
                    <div key={module.module_id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{module.title}</span>
                        <span className={`text-sm font-medium ${getProgressColor(module.completion_rate)}`}>
                          {module.completion_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            module.completion_rate >= 80 ? 'bg-green-500' :
                            module.completion_rate >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${module.completion_rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrollment Trend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trend</h3>
                <div className="h-48">
                  <div className="flex items-end h-32 space-x-2">
                    {selectedCourse.enrollment_trend.map((point, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-indigo-100 rounded-t"
                        style={{
                          height: `${(point.count / Math.max(...selectedCourse.enrollment_trend.map(p => p.count))) * 100}%`
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {selectedCourse.enrollment_trend.map((point, index) => (
                      <span key={index}>{formatDate(point.date)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Select a course to view analytics
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 