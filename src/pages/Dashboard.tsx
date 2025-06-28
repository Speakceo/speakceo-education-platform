import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Award,
  Rocket,
  Zap,
  Timer,
  TrendingDown,
  ChevronRight,
  Plus,
  BookmarkPlus,
  Globe,
  Lightbulb,
  PieChart,
  User
} from 'lucide-react';
import { useUserStore } from '../lib/store';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get personalized greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = user?.name || 'Student';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Mock data - in real app this would come from APIs
  const stats = [
    {
      title: "Learning Progress",
      value: "78%",
      change: "+12%",
      trending: "up",
      icon: TrendingUp,
      color: "bg-blue-500",
      description: "This week"
    },
    {
      title: "Courses Completed",
      value: "12",
      change: "+3",
      trending: "up", 
      icon: BookOpen,
      color: "bg-green-500",
      description: "This month"
    },
    {
      title: "Learning Streak",
      value: "7",
      change: "+1",
      trending: "up",
      icon: Zap,
      color: "bg-orange-500",
      description: "Days"
    },
    {
      title: "Total XP Earned",
      value: "2,450",
      change: "+340",
      trending: "up",
      icon: Star,
      color: "bg-purple-500",
      description: "Points"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "course",
      title: "Completed: Market Research Fundamentals",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "task",
      title: "Submitted: Business Model Canvas",
      time: "5 hours ago", 
      icon: Target,
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "achievement",
      title: "Earned: First Pitch Badge",
      time: "1 day ago",
      icon: Award,
      color: "text-purple-600"
    },
    {
      id: 4,
      type: "community",
      title: "Joined discussion on Startup Funding",
      time: "2 days ago",
      icon: MessageSquare,
      color: "text-orange-600"
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: "Financial Planning for Startups",
      instructor: "Sarah Johnson",
      time: "2:00 PM",
      duration: "60 min",
      participants: 24,
      isLive: false
    },
    {
      id: 2,
      title: "Pitch Deck Essentials",
      instructor: "Mike Chen",
      time: "4:30 PM",
      duration: "90 min",
      participants: 18,
      isLive: false
    }
  ];

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      icon: Play,
      action: () => navigate('/dashboard/courses'),
      color: "bg-blue-500"
    },
    {
      title: "Join Live Class",
      description: "Active sessions available",
      icon: Video,
      action: () => navigate('/dashboard/live-classes'),
      color: "bg-green-500"
    },
    {
      title: "View Tasks",
      description: "3 tasks due this week",
      icon: CheckCircle,
      action: () => navigate('/dashboard/tasks'),
      color: "bg-orange-500"
    },
    {
      title: "AI Tools",
      description: "Get personalized help",
      icon: Sparkles,
      action: () => navigate('/dashboard/ai-tools'),
      color: "bg-purple-500"
    }
  ];

  const learningPaths = [
    {
      title: "Startup Fundamentals",
      progress: 85,
      totalModules: 8,
      completedModules: 7,
      estimatedTime: "2 hours left",
      difficulty: "Beginner"
    },
    {
      title: "Business Strategy",
      progress: 45,
      totalModules: 12,
      completedModules: 5,
      estimatedTime: "8 hours left",
      difficulty: "Intermediate"
    },
    {
      title: "Fundraising & Investment",
      progress: 20,
      totalModules: 15,
      completedModules: 3,
      estimatedTime: "15 hours left", 
      difficulty: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-white border-b border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {getGreeting()}
                </h1>
                <p className="text-gray-600 text-lg">
                  Ready to continue your entrepreneurial journey? Let's make today count!
                </p>
              </motion.div>
              
              <motion.div 
                className="mt-6 lg:mt-0 flex items-center space-x-4"
                variants={fadeInUp}
              >
                <div className="text-right">
                  <div className="text-sm text-gray-500">Today's Date</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Grid */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    variants={scaleOnHover}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className={`flex items-center text-sm ${
                        stat.trending === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trending === 'up' ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    onClick={action.action}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                    variants={scaleOnHover}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-2 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Learning Paths */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Learning Paths</h2>
                <button 
                  onClick={() => navigate('/dashboard/courses')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={path.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{path.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {path.completedModules}/{path.totalModules} modules
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{path.estimatedTime}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            path.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            path.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {path.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{path.progress}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Upcoming Classes */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Classes</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {upcomingClasses.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {upcomingClasses.map((class_, index) => (
                      <motion.div
                        key={class_.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm">{class_.title}</h3>
                          {class_.isLive && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center mb-1">
                            <Clock className="h-4 w-4 mr-2" />
                            {class_.time} • {class_.duration}
                          </div>
                          <div className="flex items-center mb-1">
                            <User className="h-4 w-4 mr-2" />
                            {class_.instructor}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {class_.participants} students
                          </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          {class_.isLive ? 'Join Now' : 'Set Reminder'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No classes scheduled for today</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => navigate('/dashboard/live-classes')}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center"
                  >
                    View All Classes <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100`}>
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => navigate('/dashboard/analytics')}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center"
                  >
                    View All Activity <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Achievement Spotlight */}
            <motion.div variants={fadeInUp}>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="h-8 w-8 text-yellow-300" />
                  <span className="text-sm opacity-90">Latest Achievement</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Startup Fundamentals</h3>
                <p className="text-sm opacity-90 mb-4">
                  Congratulations! You've completed the Startup Fundamentals course and earned 500 XP.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/achievements')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View All Achievements
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;