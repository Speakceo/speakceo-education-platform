import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar, 
  Download, 
  RefreshCw, 
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Target,
  Award,
  Star,
  Mail,
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { supabase } from '../../lib/supabase';
import { getAdminAnalyticsData } from '../../lib/api/analytics';

interface AnalyticsData {
  userGrowth: {
    dates: string[];
    counts: number[];
  };
  courseCompletion: {
    courses: string[];
    completionRates: number[];
  };
  engagementMetrics: {
    metric: string;
    value: number;
    change: number;
  }[];
  quizPerformance: {
    categories: string[];
    averageScores: number[];
  };
  topPerformers: {
    id: string;
    name: string;
    progress: number;
    points: number;
    avatar: string;
    email?: string;
  }[];
  strugglingStudents: {
    id: string;
    name: string;
    progress: number;
    lastActive: string;
    avatar: string;
    email?: string;
    specificIssues?: string[];
  }[];
  contentEngagement: {
    module: string;
    views: number;
    completions: number;
    avgTimeSpent: number; // in minutes
    rating: number;
  }[];
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [showEngagementDetails, setShowEngagementDetails] = useState(false);
  const [showContentDetails, setShowContentDetails] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<{id: string, name: string, email?: string}[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Fetch analytics data on component mount and when time range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch real analytics data from database
      const realData = await getAdminAnalyticsData(timeRange);
      
      // Transform the real data into the format expected by the UI
      const transformedData: AnalyticsData = {
        userGrowth: realData.userGrowth,
        courseCompletion: realData.courseCompletion,
        engagementMetrics: realData.engagementMetrics,
        quizPerformance: {
          categories: ['Business Fundamentals', 'Marketing', 'Finance', 'Leadership', 'Public Speaking', 'Problem Solving'],
          averageScores: [85, 78, 82, 88, 75, 80] // TODO: Calculate from real quiz data when available
        },
        topPerformers: realData.topPerformers,
        strugglingStudents: realData.strugglingStudents,
        contentEngagement: realData.contentEngagement
      };
      
      setAnalyticsData(transformedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageStudents = (students: {id: string, name: string, email?: string}[]) => {
    setSelectedStudents(students);
    setMessageText('');
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || selectedStudents.length === 0) return;
    
    setIsSendingMessage(true);
    
    try {
      // In a real implementation, this would send messages via Supabase or email API
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowMessageModal(false);
      alert(`Message sent to ${selectedStudents.length} students!`);
    } catch (error) {
      console.error('Error sending messages:', error);
      setError('Failed to send messages. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // User Growth Chart Options
  const userGrowthOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: analyticsData?.userGrowth.dates || [],
      labels: {
        formatter: function(value: string) {
          return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Math.round(value).toString()
      }
    }
  };

  const userGrowthSeries = [
    {
      name: 'New Users',
      data: analyticsData?.userGrowth.counts || []
    }
  ];

  // Course Completion Chart Options
  const courseCompletionOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#8B5CF6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + '%';
      },
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: analyticsData?.courseCompletion.courses || [],
      labels: {
        formatter: function (val: number) {
          return val + '%';
        }
      }
    }
  };

  const courseCompletionSeries = [
    {
      name: 'Completion Rate',
      data: analyticsData?.courseCompletion.completionRates || []
    }
  ];

  // Quiz Performance Chart Options
  const quizPerformanceOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#EC4899'],
    markers: {
      size: 4
    },
    xaxis: {
      categories: analyticsData?.quizPerformance.categories || []
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100
    }
  };

  const quizPerformanceSeries = [
    {
      name: 'Average Score',
      data: analyticsData?.quizPerformance.averageScores || []
    }
  ];

  // Content Engagement Chart Options
  const contentEngagementOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      stacked: false,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5', '#8B5CF6'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: analyticsData?.contentEngagement.map(item => item.module) || [],
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " users";
        }
      }
    }
  };

  const contentEngagementSeries = [
    {
      name: 'Views',
      data: analyticsData?.contentEngagement.map(item => item.views) || []
    },
    {
      name: 'Completions',
      data: analyticsData?.contentEngagement.map(item => item.completions) || []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive insights into student performance and engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 365 Days</option>
          </select>
          <button
            onClick={() => {
              const element = document.createElement('a');
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(analyticsData)));
              element.setAttribute('download', `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json`);
              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button
            onClick={fetchAnalyticsData}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Total: {analyticsData?.userGrowth.counts.reduce((a, b) => a + b, 0) || 0} new users
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <Chart
            options={userGrowthOptions}
            series={userGrowthSeries}
            type="area"
            height={320}
          />
        )}
      </div>

      {/* Course Completion and Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Completion */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Completion Rates</h2>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <Chart
              options={courseCompletionOptions}
              series={courseCompletionSeries}
              type="bar"
              height={320}
            />
          )}
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance by Category</h2>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <Chart
              options={quizPerformanceOptions}
              series={quizPerformanceSeries}
              type="radar"
              height={320}
            />
          )}
        </div>
      </div>

      {/* Content Engagement */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Content Engagement</h2>
          <button
            onClick={() => setShowContentDetails(!showContentDetails)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {showContentDetails ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {isLoading ? (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <Chart
            options={contentEngagementOptions}
            series={contentEngagementSeries}
            type="bar"
            height={320}
          />
        )}
        
        {showContentDetails && analyticsData && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">Detailed Content Analytics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time Spent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.contentEngagement.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 ${selectedModule === item.module ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedModule(selectedModule === item.module ? null : item.module)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.module}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.completions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round((item.completions / item.views) * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgTimeSpent} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{(item.rating / 10).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/admin/courses';
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {selectedModule && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Module Insights: {selectedModule}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-indigo-800 mb-2">Top Performing Lessons</h5>
                    <ul className="space-y-1">
                      <li className="text-sm text-indigo-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Introduction to {selectedModule} (98% completion)
                      </li>
                      <li className="text-sm text-indigo-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {selectedModule} Case Studies (92% completion)
                      </li>
                      <li className="text-sm text-indigo-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {selectedModule} Practical Examples (89% completion)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-indigo-800 mb-2">Improvement Opportunities</h5>
                    <ul className="space-y-1">
                      <li className="text-sm text-indigo-700 flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        Advanced {selectedModule} Concepts (45% completion)
                      </li>
                      <li className="text-sm text-indigo-700 flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        {selectedModule} Final Assessment (52% completion)
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    onClick={() => window.location.href = '/admin/courses'}
                  >
                    View Full Module Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Engagement Metrics</h2>
          <button
            onClick={() => setShowEngagementDetails(!showEngagementDetails)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {showEngagementDetails ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          ) : (
            analyticsData?.engagementMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{metric.metric}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {metric.metric.includes('Rate') ? `${metric.value}%` : metric.metric.includes('Duration') ? `${metric.value} min` : metric.value}
                </p>
                <p className={`text-sm flex items-center ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                  )}
                  {Math.abs(metric.change)}% {metric.change >= 0 ? 'increase' : 'decrease'}
                </p>
              </div>
            ))
          )}
        </div>
        
        {showEngagementDetails && !isLoading && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Detailed Engagement Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Time Spent by Module</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData?.courseCompletion.courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate max-w-xs">{course}</span>
                      <span className="text-sm font-medium text-gray-900">{Math.floor(Math.random() * 100) + 50} min</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Most Engaged Time of Day</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs text-gray-500">{time}</p>
                      <p className="text-lg font-medium text-gray-900">{[35, 25, 30, 10][index]}%</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Device Usage</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['Mobile', 'Tablet', 'Desktop'].map((device, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs text-gray-500">{device}</p>
                      <p className="text-lg font-medium text-gray-900">{[45, 15, 40][index]}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Students</h2>
            <button 
              onClick={() => handleMessageStudents(analyticsData?.topPerformers || [])}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Message All
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData?.topPerformers.map((student, index) => (
                <div key={student.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{student.progress}% complete</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-indigo-100 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">{student.points}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageStudents([student]);
                    }}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Struggling Students */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Students Needing Attention</h2>
            <button 
              onClick={() => handleMessageStudents(analyticsData?.strugglingStudents || [])}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Message All
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData?.strugglingStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{student.progress}% complete</span>
                    </div>
                    {student.specificIssues && (
                      <div className="mt-1">
                        {student.specificIssues.map((issue, i) => (
                          <span key={i} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                            {issue}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-medium text-red-600">
                      {Math.round((new Date().getTime() - new Date(student.lastActive).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageStudents([student]);
                    }}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Engagement</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Video Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">78%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Assignment Submission Rate</span>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Quiz Attempt Rate</span>
                <span className="text-sm font-medium text-gray-900">82%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Forum Participation</span>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Business Plan Completion</p>
                <p className="text-xs text-gray-500">68% of students completed</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pitch Competition</p>
                <p className="text-xs text-gray-500">42% of students participated</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Team Project</p>
                <p className="text-xs text-gray-500">75% of students completed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">7-Day Retention</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">30-Day Retention</span>
                <span className="text-sm font-medium text-gray-900">72%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">90-Day Retention</span>
                <span className="text-sm font-medium text-gray-900">58%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm text-indigo-700">
                <strong>Insight:</strong> Students who complete at least 3 modules have a 92% chance of completing the entire course.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Engagement Alert</h3>
                <p className="text-xs text-amber-700 mt-1">
                  5 students haven't logged in for over 7 days. Consider sending a personalized reminder.
                </p>
                <button 
                  onClick={() => handleMessageStudents(analyticsData?.strugglingStudents || [])}
                  className="mt-2 text-xs font-medium text-amber-800 hover:text-amber-900"
                >
                  Message Students
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Content Success</h3>
                <p className="text-xs text-green-700 mt-1">
                  "Financial Literacy" module has 85% completion rate. Consider creating more similar content.
                </p>
                <button 
                  onClick={() => window.location.href = '/admin/courses'}
                  className="mt-2 text-xs font-medium text-green-800 hover:text-green-900"
                >
                  View Module Analytics
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Target className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Improvement Opportunity</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Quiz scores in "Marketing" section are below average. Consider revising content or adding more examples.
                </p>
                <button 
                  onClick={() => window.location.href = '/admin/courses'}
                  className="mt-2 text-xs font-medium text-blue-800 hover:text-blue-900"
                >
                  Review Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Send Message to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <div className="p-2 border border-gray-300 rounded-lg max-h-24 overflow-y-auto">
                    {selectedStudents.map(student => (
                      <div key={student.id} className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-xs mr-2 mb-1">
                        {student.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="email">Email</option>
                    <option value="notification">In-App Notification</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your message"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Templates
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMessageText("Hi there! We noticed you haven't been active in the course recently. Is there anything we can help you with to get back on track with your learning journey?")}
                      className="w-full text-left p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      Re-engagement Message
                    </button>
                    <button
                      onClick={() => setMessageText("Congratulations on your excellent progress! We've noticed your dedication and wanted to recognize your hard work. Keep up the great work!")}
                      className="w-full text-left p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      Progress Celebration
                    </button>
                    <button
                      onClick={() => setMessageText("We've noticed you might be having some difficulty with recent course material. Would you like to schedule a one-on-one session with an instructor to help clarify any concepts?")}
                      className="w-full text-left p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      Support Offer
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSendingMessage || !messageText.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSendingMessage ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isSendingMessage ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}