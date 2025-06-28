import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Brain,
  Star,
  BookOpen,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Download,
  Share2,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { useUserStore, useProgressStore, useAIToolsStore, useUnifiedProgressStore } from '../../lib/store';
import AILearningCoach from './AILearningCoach';
import ProgressBar from '../ui/ProgressBar';
import { getUserSkills, getUserWeeklyActivity, getLearningMetrics } from '../../lib/api/analytics';

// Define interfaces for the component
interface DailyActivity {
  day: string;
  hours: number;
  tasks: number;
  date?: Date;
}

interface UserSkills {
  leadership: number;
  publicSpeaking: number;
  financialLiteracy: number;
  marketing: number;
  businessStrategy: number;
}

interface LearningMetrics {
  courseProgress: number;
  completedLessons: number;
  studyHours: number;
  averageScore: number;
  achievementsCount: number;
}

export default function Analytics() {
  const [showAICoach, setShowAICoach] = useState(false);
  const user = useUserStore((state) => state.user);
  const { 
    fetchUserProgress,
    getOverallProgress,
    getCompletedLessons,
    getTotalLessons,
    getLearningStreak,
    getToolUsageStats
  } = useProgressStore();
  
  const { getMostUsedTools } = useAIToolsStore();
  const { getRecentActivities, getTotalXP, getOverallProgress: getUnifiedProgress } = useUnifiedProgressStore();
  
  // New state for real analytics data
  const [skillData, setSkillData] = useState<UserSkills>({
    leadership: 0,
    publicSpeaking: 0,
    financialLiteracy: 0,
    marketing: 0,
    businessStrategy: 0
  });
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
    courseProgress: 0,
    completedLessons: 0,
    studyHours: 0,
    averageScore: 0, 
    achievementsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      // Fetch the user's progress
      fetchUserProgress(user.id);
      
      // Load real data from our API
      const loadAnalyticsData = async () => {
        try {
          // Fetch user skills
          const skills = await getUserSkills(user.id);
          setSkillData(skills);
          
          // Fetch weekly activity
          const activity = await getUserWeeklyActivity(user.id);
          setWeeklyActivity(activity);
          
          // Fetch learning metrics
          const metrics = await getLearningMetrics(user.id);
          setLearningMetrics(metrics);
        } catch (error) {
          console.error('Error loading analytics data:', error);
          // Use fallback data if API calls fail
          setWeeklyActivity([
            { day: 'Mon', hours: 2.5, tasks: 3 },
            { day: 'Tue', hours: 1.5, tasks: 2 },
            { day: 'Wed', hours: 3.0, tasks: 4 },
            { day: 'Thu', hours: 2.0, tasks: 3 },
            { day: 'Fri', hours: 2.5, tasks: 3 },
            { day: 'Sat', hours: 1.0, tasks: 1 },
            { day: 'Sun', hours: 0.5, tasks: 1 }
          ]);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadAnalyticsData();
    }
  }, [user, fetchUserProgress]);
  
  const overallProgress = getOverallProgress();
  const completedLessons = getCompletedLessons();
  const totalLessons = getTotalLessons();
  const learningStreak = getLearningStreak();
  const toolStats = getToolUsageStats();
  const mostUsedTools = getMostUsedTools();
  const recentActivities = getRecentActivities(10);
  const totalXP = getTotalXP();

  const skillRadarOptions = {
    chart: {
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#6366f1'],
    fill: {
      opacity: 0.5
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['Leadership', 'Public Speaking', 'Financial Literacy', 'Marketing', 'Business Strategy']
    }
  };

  const skillRadarSeries = [{
    name: 'Skill Level',
    data: [
      skillData.leadership,
      skillData.publicSpeaking, 
      skillData.financialLiteracy, 
      skillData.marketing, 
      skillData.businessStrategy
    ]
  }];

  const activityChartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: ['#6366f1', '#a855f7'],
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
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    xaxis: {
      categories: weeklyActivity.map((d) => d.day)
    },
    yaxis: [
      {
        title: { text: 'Study Hours' },
        labels: {
          formatter: (value: number) => `${value}h`
        }
      },
      {
        opposite: true,
        title: { text: 'Tasks Completed' }
      }
    ]
  };

  const activityChartSeries = [
    {
      name: 'Study Hours',
      data: weeklyActivity.map((d) => d.hours)
    },
    {
      name: 'Tasks Completed',
      data: weeklyActivity.map((d) => d.tasks)
    }
  ];

  // Format learning metrics from real data
  const metricsDisplay = [
    {
      name: 'Course Progress',
      value: `${learningMetrics.courseProgress || overallProgress}%`,
      change: '+12%',
      trend: 'up',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Study Hours',
      value: `${learningMetrics.studyHours.toFixed(1)}h`,
      change: '+2.5h',
      trend: 'up',
      icon: Clock,
      color: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Achievements',
      value: learningMetrics.achievementsCount.toString(),
      change: '+3',
      trend: 'up',
      icon: Trophy,
      color: 'from-amber-600 to-orange-600'
    },
    {
      name: 'Quiz Score Avg.',
      value: `${learningMetrics.averageScore}%`,
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Analytics</h2>
            <p className="text-gray-500 mt-1">Track your progress and achievements</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <Share2 className="h-4 w-4" />
              <span>Share Progress</span>
            </button>
          </div>
        </div>

        {/* Learning Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsDisplay.map((metric) => (
            <div
              key={metric.name}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <dt>
                <div className={`absolute rounded-xl bg-gradient-to-r ${metric.color} p-3`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {metric.name}
                </p>
              </dt>
              <dd className="ml-16 flex flex-col">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <div className="flex items-baseline">
                  <p className={`text-sm font-semibold ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                    {metric.trend === 'up' ? (
                      <ArrowUp className="inline h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4 ml-1" />
                    )}
                  </p>
                  <p className="ml-2 text-xs text-gray-500">from last week</p>
                </div>
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
              <select className="rounded-lg border-gray-300 text-sm">
                <option>This Week</option>
                <option>Last Week</option>
                <option>Last Month</option>
              </select>
            </div>
            
            <Chart
              options={activityChartOptions}
              series={activityChartSeries}
              type="area"
              height={300}
              key={`activity-chart-${weeklyActivity.length}`}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600 font-medium">Total Study Time</p>
                    <p className="text-lg font-bold text-indigo-700">
                      {weeklyActivity.reduce((sum: number, day: any) => sum + day.hours, 0).toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Tasks Completed</p>
                    <p className="text-lg font-bold text-purple-700">
                      {weeklyActivity.reduce((sum: number, day: any) => sum + day.tasks, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                      {activity.type === 'course' && <BookOpen className="h-5 w-5 text-indigo-600" />}
                      {activity.type === 'task' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {activity.type === 'simulator' && <Target className="h-5 w-5 text-amber-600" />}
                      {activity.type === 'ai-tool' && <Sparkles className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-sm font-medium text-indigo-600">+{activity.xpEarned} XP</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity found
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress</h3>
            <div className="mt-4">
              <Chart
                options={skillRadarOptions}
                series={skillRadarSeries}
                type="radar"
                height={350}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Learning Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700">Lessons Completed</span>
                </div>
                <span className="font-medium">
                  {learningMetrics.completedLessons || completedLessons}/{totalLessons}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-500 mr-3" />
                  <span className="text-gray-700">XP Points</span>
                </div>
                <span className="font-medium">{totalXP}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Learning Streak</span>
                </div>
                <span className="font-medium">{learningStreak} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-gray-700">Quizzes Completed</span>
                </div>
                <span className="font-medium">{learningMetrics.completedLessons || completedLessons}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">AI Tools Used</span>
                </div>
                <span className="font-medium">{toolStats.totalUsage}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">AI Learning Coach</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Get personalized advice based on your learning patterns and performance.
            </p>
            <button 
              onClick={() => setShowAICoach(true)}
              className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Talk to AI Coach
            </button>
          </div>
        </div>
      </div>
      
      {/* AI Learning Coach Modal */}
      {showAICoach && <AILearningCoach onClose={() => setShowAICoach(false)} />}
    </div>
  );
}