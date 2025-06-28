import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp,
  Calendar,
  Users,
  BrainCircuit,
  Sparkles,
  Bell,
  ArrowUp,
  Target,
  CheckCircle,
  Star,
  Play,
  MessageSquare,
  ArrowRight,
  Download,
  Video,
  BarChart,
  Rocket,
  Lightbulb,
  ChevronRight,
  CheckSquare,
  User,
  Plus,
  RefreshCw,
  Award,
  Zap
} from 'lucide-react';
import { useUserStore } from '../../lib/store';
import { useUserProgress } from '../../contexts/UserProgressContext';
import { getStudentDashboardData, getUserBrandData } from '../../lib/supabase';
import { getDashboardOverviewData } from '../../lib/api/analytics';

// Production-ready Overview component with dynamic data and interactive features
export default function Overview() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { 
    progress, 
    getLevelProgress,
    getTotalProgress
  } = useUserProgress();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userBrand, setUserBrand] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);

  // Initialize dashboard data
  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
      loadUserBrand();
      fetchOverviewData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      const data = await getStudentDashboardData(user.id);
      if (data) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchOverviewData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getDashboardOverviewData(user.id);
      setOverviewData(data);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserBrand = async () => {
    if (!user?.id) return;
    
    try {
      const brandData = await getUserBrandData(user.id);
      if (brandData) {
        setUserBrand(brandData);
      }
    } catch (error) {
      console.error('Error loading brand data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name || 'Test';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const handleQuickAction = (href: string) => {
    navigate(href);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, growth, color, onClick, isActive }: any) => (
    <div 
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
        isActive ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setActiveCard(title)}
      onMouseLeave={() => setActiveCard(null)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {growth && (
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">{growth}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${color} rounded-lg ml-4`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  // Use real data or fallback values
  const progressPercentage = overviewData?.stats?.courseProgress || getTotalProgress() || 0;
  const completedLessons = overviewData?.stats?.completedLessons || 0;
  const totalLessons = overviewData?.stats?.totalLessons || 65;
  const currentStreak = overviewData?.stats?.streak || 0;
  const levelProgress = getLevelProgress();
  const communitySize = overviewData?.stats?.communitySize || 0;
  const achievementsCount = overviewData?.stats?.achievementsCount || 0;
  const messagesCount = overviewData?.stats?.messagesCount || 0;
  const userGoals = overviewData?.goals || [];
  const recentAchievements = overviewData?.recentAchievements || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Dynamic Header with Real User Data */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* User's Brand Logo */}
              {userBrand?.logoUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={userBrand.logoUrl}
                    alt="Brand Logo"
                    className="h-16 w-16 rounded-lg object-cover border-2 border-indigo-200 shadow-md"
                  />
                </div>
              )}
              
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {getGreeting()}
                </h1>
                <p className="text-lg text-gray-600">
                  {userBrand?.brandData?.tagline || 
                   `Ready to continue your entrepreneurial journey? You're ${progressPercentage}% of the way there!`}
                </p>
                {userBrand?.brandData?.name && (
                  <p className="text-sm text-indigo-600 font-medium">
                    Building {userBrand.brandData.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Achievement Badge for Streak */}
            {currentStreak >= 5 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center animate-bounce">
                <Trophy className="h-5 w-5 mr-2" />
                <span className="font-semibold">{currentStreak} Day Streak!</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Toggle */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-gray-700">Quick Actions</span>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${showQuickActions ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Real Data Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total XP Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total XP</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{overviewData?.user?.totalXP || 0}</p>
                <div className="flex items-center mt-2">
                  <Zap className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{Math.floor((overviewData?.user?.totalXP || 0) * 0.1)} this week</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+15 today</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg ml-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Course Progress</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{progressPercentage}%</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{completedLessons} completed</span>
                    <span>{totalLessons} total</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg ml-4">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Community Card with Real Data */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Community</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{communitySize}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{achievementsCount} achievements</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{messagesCount} messages</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-lg border border-indigo-200 border-l-4 border-l-indigo-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                <Play className="h-5 w-5 mr-2" />
                Continue Learning
              </button>
              <button className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Video className="h-5 w-5 mr-2" />
                Join Live Class
              </button>
              <button className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <BookOpen className="h-5 w-5 mr-2" />
                View Tasks
              </button>
              <button className="flex items-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                <BrainCircuit className="h-5 w-5 mr-2" />
                AI Tools
              </button>
            </div>
          </div>
        )}

        {/* Current Streak Notification */}
        {currentStreak >= 5 && (
          <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Amazing Streak!</h3>
                  <p className="text-orange-100">You've been consistent for {currentStreak} days straight. Keep it up!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentStreak}</div>
                <div className="text-sm text-orange-100">Day Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                  <span className="text-sm text-indigo-600 font-medium">Module {Math.floor(completedLessons / 3) + 1} of 6</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Building Your Business Model</h3>
                    <p className="text-sm text-gray-600">Learn how to create a scalable business model</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Lesson {(completedLessons % 3) + 1} of 8</span>
                    <span>{Math.min(100, Math.round(((completedLessons % 3) / 8) * 100))}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{ width: `${Math.min(100, Math.round(((completedLessons % 3) / 8) * 100))}%` }}></div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/dashboard/courses')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Continue Lesson
                </button>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Explore Content</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Video, title: 'Live Workshop', subtitle: 'Pitch Perfect: Master Your Elevator Pitch', time: 'Tomorrow 2:00 PM', color: 'bg-red-500', action: () => navigate('/dashboard/live-classes') },
                    { icon: BookOpen, title: 'New Lesson', subtitle: 'Customer Discovery Techniques', time: '15 min read', color: 'bg-green-500', action: () => navigate('/dashboard/courses') },
                    { icon: BrainCircuit, title: 'AI Tool', subtitle: 'Business Plan Generator', time: 'Try now', color: 'bg-purple-500', action: () => navigate('/dashboard/ai-tools') },
                    { icon: Users, title: 'Community', subtitle: 'Weekly Founder Meetup', time: 'Join discussion', color: 'bg-blue-500', action: () => navigate('/dashboard/community') }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
                      onClick={item.action}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 ${item.color} rounded-lg group-hover:scale-110 transition-transform`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{item.title}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                          </div>
                          <h4 className="font-medium text-gray-900 mt-1">{item.subtitle}</h4>
                          <p className="text-sm text-gray-600">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Goals with Real Data */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Today's Goals</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {userGoals.length > 0 ? userGoals.map((goal: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        goal.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {goal.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${
                        goal.completed 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-900'
                      }`}>
                        {goal.task}
                      </span>
                    </div>
                  )) : (
                    // Fallback goals if no data
                    [
                      { task: 'Complete Module 2 Lesson 3', completed: false },
                      { task: 'Review customer interview notes', completed: true },
                      { task: 'Update business model canvas', completed: false },
                      { task: 'Join community discussion', completed: true }
                    ].map((goal, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          goal.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {goal.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${
                          goal.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {goal.task}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Live Classes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
              </div>
              
              <div className="p-6">
                {dashboardData?.upcomingClasses && dashboardData.upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingClasses.slice(0, 3).map((liveClass: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{liveClass.title}</span>
                          <span className="text-xs text-gray-500">{new Date(liveClass.scheduled_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{liveClass.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(liveClass.scheduled_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Pitch Perfect Workshop</span>
                        <span className="text-xs text-green-600 font-medium">Tomorrow</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Master your elevator pitch in 60 seconds</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        2:00 PM - 3:30 PM
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Customer Discovery</span>
                        <span className="text-xs text-gray-500">Friday</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Learn interviewing techniques</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        10:00 AM - 11:30 AM
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Level Progress</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-indigo-600">Level {overviewData?.user?.currentLevel || 1}</span>
                  <span className="text-sm text-gray-500">{Math.round((overviewData?.user?.xpInCurrentLevel || 0))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${overviewData?.user?.xpInCurrentLevel || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {overviewData?.user?.xpInCurrentLevel || 0} / 100 XP to next level
                </p>
              </div>
            </div>

            {/* Achievement Progress with Real Data */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {recentAchievements.length > 0 ? recentAchievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 ${
                        achievement.color === 'yellow' ? 'bg-yellow-100' :
                        achievement.color === 'green' ? 'bg-green-100' :
                        achievement.color === 'purple' ? 'bg-purple-100' :
                        'bg-blue-100'
                      } rounded-lg`}>
                        {achievement.icon === 'star' && <Star className={`h-5 w-5 ${
                          achievement.color === 'yellow' ? 'text-yellow-600' :
                          achievement.color === 'green' ? 'text-green-600' :
                          achievement.color === 'purple' ? 'text-purple-600' :
                          'text-blue-600'
                        }`} />}
                        {achievement.icon === 'trophy' && <Trophy className={`h-5 w-5 ${
                          achievement.color === 'yellow' ? 'text-yellow-600' :
                          achievement.color === 'green' ? 'text-green-600' :
                          achievement.color === 'purple' ? 'text-purple-600' :
                          'text-blue-600'
                        }`} />}
                        {achievement.icon === 'users' && <Users className={`h-5 w-5 ${
                          achievement.color === 'yellow' ? 'text-yellow-600' :
                          achievement.color === 'green' ? 'text-green-600' :
                          achievement.color === 'purple' ? 'text-purple-600' :
                          'text-blue-600'
                        }`} />}
                        {achievement.icon === 'target' && <Target className={`h-5 w-5 ${
                          achievement.color === 'yellow' ? 'text-yellow-600' :
                          achievement.color === 'green' ? 'text-green-600' :
                          achievement.color === 'purple' ? 'text-purple-600' :
                          'text-blue-600'
                        }`} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  )) : (
                    // Fallback achievements
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">First Module Complete!</p>
                          <p className="text-xs text-gray-500">Unlocked: Business Basics Badge</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{currentStreak}-Day Streak</p>
                          <p className="text-xs text-gray-500">Keep the momentum going!</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Community Helper</p>
                          <p className="text-xs text-gray-500">Active in discussions</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 