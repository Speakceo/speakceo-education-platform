import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Video, 
  Users, 
  Clock, 
  Star, 
  BookOpen, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Play, 
  FileText, 
  Download, 
  Bell,
  Target,
  Brain,
  Mic,
  Zap,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { format, differenceInMinutes, differenceInHours, differenceInDays, parseISO } from 'date-fns';
import { useUserStore, useProgressStore, useUnifiedProgressStore } from '../../lib/store';
import Chart from 'react-apexcharts';
import { getUpcomingLiveClasses, getLiveNowClasses, getPastLiveClasses, registerForLiveClass } from '../../lib/api/classes';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar_url: string;
  };
  date: string;
  duration: string;
  durationMinutes: number;
  category: string;
  level: string;
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  joinUrl?: string;
  recordingUrl?: string;
  materials?: {
    id: string;
    name: string;
    type: 'pdf' | 'video' | 'quiz';
    url: string;
  }[];
}

const features = [
  {
    icon: Video,
    title: 'HD Video Quality',
    description: 'Crystal clear video streaming for the best learning experience'
  },
  {
    icon: Users,
    title: 'Interactive Sessions',
    description: 'Engage directly with instructors and fellow students'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat Support',
    description: '24/7 technical support during live sessions'
  },
  {
    icon: BookOpen,
    title: 'Session Recordings',
    description: 'Access recorded sessions for revision anytime'
  }
];

export default function LiveClasses() {
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'materials'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [liveNowClasses, setLiveNowClasses] = useState<LiveClass[]>([]);
  const [pastClasses, setPastClasses] = useState<LiveClass[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  
  const { user } = useUserStore();
  const { getOverallProgress } = useProgressStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  const overallProgress = getOverallProgress();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [upcoming, liveNow, past] = await Promise.all([
        getUpcomingLiveClasses(),
        getLiveNowClasses(),
        getPastLiveClasses()
      ]);
      
      setUpcomingClasses(upcoming);
      setLiveNowClasses(liveNow);
      setPastClasses(past);
    } catch (error) {
      console.error('Error fetching live classes:', error);
      setError('Failed to load live classes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter classes based on search query and level filter
  const getFilteredClasses = () => {
    let classesToFilter = [];
    
    if (activeTab === 'upcoming') {
      classesToFilter = [...liveNowClasses, ...upcomingClasses];
    } else if (activeTab === 'past') {
      classesToFilter = pastClasses;
    } else {
      // Materials tab would show classes with materials
      classesToFilter = [...upcomingClasses, ...pastClasses].filter(cls => 
        cls.materials && cls.materials.length > 0
      );
    }
    
    return classesToFilter.filter(cls => {
      const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filterLevel === 'All' || cls.level === filterLevel;
      
      return matchesSearch && matchesLevel;
    });
  };

  const handleJoinClass = (cls: LiveClass) => {
    setIsJoining(true);
    
    // Record activity
    recordActivity({
      type: 'course',
      title: `Joined ${cls.title} class`,
      xpEarned: 25
    });
    
    // Simulate joining the class
    setTimeout(() => {
      if (cls.joinUrl) {
        window.open(cls.joinUrl, '_blank');
      }
      setIsJoining(false);
    }, 1500);
  };

  const handleRegisterForClass = async (cls: LiveClass) => {
    if (!user) return;
    
    setIsRegistering(true);
    
    try {
      const result = await registerForLiveClass(cls.id, user.id);
      setRegistrationSuccess(result.message);
      
      // Record activity
      recordActivity({
        type: 'course',
        title: `Registered for ${cls.title} class`,
        xpEarned: 10
      });
      
      // Refetch classes to update attendee count
      fetchClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setRegistrationSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error registering for class:', error);
      setError('Failed to register for the class. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const getTimeUntilClass = (classDate: string) => {
    const now = new Date();
    const date = parseISO(classDate);
    const diffMinutes = differenceInMinutes(date, now);
    const diffHours = differenceInHours(date, now);
    const diffDays = differenceInDays(date, now);
    
    if (diffMinutes < 0) {
      return 'Live now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} until start`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} until start`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} until start`;
    }
  };

  const canJoinClass = (cls: LiveClass) => {
    if (cls.status === 'completed' || cls.status === 'cancelled') {
      return false;
    }
    
    const now = new Date();
    const classTime = parseISO(cls.date);
    const minutesUntilClass = differenceInMinutes(classTime, now);
    
    // Can join 10 minutes before and during the class
    return minutesUntilClass <= 10 && minutesUntilClass >= -(cls.durationMinutes);
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business Strategy':
        return <Target className="h-5 w-5 text-indigo-600" />;
      case 'Finance':
        return <Zap className="h-5 w-5 text-green-600" />;
      case 'Marketing':
        return <Sparkles className="h-5 w-5 text-pink-600" />;
      case 'Leadership':
        return <Users className="h-5 w-5 text-amber-600" />;
      case 'Communication':
        return <Mic className="h-5 w-5 text-purple-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  // Weekly progress chart data
  const weeklyProgressOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#6366f1'],
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
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}h`
      }
    }
  };

  const weeklyProgressSeries = [{
    name: 'Study Hours',
    data: [2.5, 1.5, 3.0, 2.0, 2.5, 1.0, 0.5]
  }];

  const filteredClasses = getFilteredClasses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
            <p className="text-gray-500 mt-1">Interactive sessions with expert mentors</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <Calendar className="h-4 w-4" />
              <span>Add to Calendar</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Course Completion</span>
            <span className="text-sm font-medium text-indigo-600">{overallProgress}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Video className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Classes Attended</p>
              <p className="text-lg font-bold text-indigo-700">{pastClasses.length}</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Hours Learned</p>
              <p className="text-lg font-bold text-indigo-700">
                {pastClasses.reduce((sum, cls) => sum + (cls.durationMinutes / 60), 0).toFixed(1)}
              </p>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Star className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Engagement Score</p>
              <p className="text-lg font-bold text-indigo-700">4.8</p>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Award className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">XP Earned</p>
              <p className="text-lg font-bold text-indigo-700">
                {pastClasses.length * 25 + upcomingClasses.length * 10}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value as any)}
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button 
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                onClick={fetchClasses}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {registrationSuccess && (
              <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                {registrationSuccess}
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming Classes
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Past Recordings
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'materials'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Class Materials
              </button>
            </div>

            {filteredClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4">
                  <Calendar className="h-16 w-16 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {activeTab === 'upcoming' 
                    ? 'There are no upcoming live classes scheduled at the moment. Check back later!'
                    : activeTab === 'past'
                    ? 'There are no past recordings available yet.'
                    : 'No class materials are available at the moment.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClasses.map((class_) => (
                  <div
                    key={class_.id}
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedClass(class_)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`rounded-xl p-3 ${
                          class_.status === 'live' ? 'bg-green-500' :
                          class_.status === 'scheduled' ? 'bg-indigo-500' :
                          'bg-gray-500'
                        }`}>
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{class_.title}</h4>
                          <p className="text-sm text-gray-500">{class_.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(class_.level)}`}>
                        {class_.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(parseISO(class_.date), 'MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(parseISO(class_.date), 'h:mm a')} ({class_.duration})
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          {class_.attendees}/{class_.maxAttendees} enrolled
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          {getCategoryIcon(class_.category)}
                          <span className="ml-2">{class_.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={class_.instructor.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(class_.instructor.name)}
                          alt={class_.instructor.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {class_.instructor.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {activeTab === 'upcoming' ? (
                          class_.status === 'live' || canJoinClass(class_) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinClass(class_);
                              }}
                              disabled={isJoining}
                              className={`flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                                isJoining ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                            >
                              {isJoining ? (
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              <span>{isJoining ? 'Joining...' : 'Join Now'}</span>
                            </button>
                          ) : (
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium text-indigo-600 mb-1">
                                {getTimeUntilClass(class_.date)}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRegisterForClass(class_);
                                }}
                                disabled={isRegistering}
                                className={`flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 ${
                                  isRegistering ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                              >
                                {isRegistering ? (
                                  <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <span>{isRegistering ? 'Registering...' : 'Register'}</span>
                              </button>
                            </div>
                          )
                        ) : activeTab === 'past' && class_.recordingUrl ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(class_.recordingUrl, '_blank');
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <Play className="h-4 w-4" />
                            <span>Watch Recording</span>
                          </button>
                        ) : activeTab === 'materials' && class_.materials && class_.materials.length > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClass(class_);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>View Materials</span>
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {activeTab === 'past' ? 'No recording available' : 'No materials available'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <Chart
              options={weeklyProgressOptions}
              series={weeklyProgressSeries}
              type="area"
              height={200}
            />
          </div>

          {/* Recommended Classes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + index * 10000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80`}
                    alt="Class thumbnail"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {['AI for Business', 'E-commerce Fundamentals', 'Social Media Marketing'][index]}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {['Dr. Maya Johnson', 'Carlos Rodriguez', 'Priya Sharma'][index]}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{[4.9, 4.8, 4.7][index]}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {[189, 245, 167][index]} students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium">
              <span>View All Recommendations</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">AI Study Assistant</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Get personalized class recommendations and learning insights based on your progress.
            </p>
            <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              Get Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedClass.title}</h3>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <img
                  src={selectedClass.instructor.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedClass.instructor.name)}
                  alt={selectedClass.instructor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedClass.instructor.name}</h3>
                  <p className="text-gray-500">Expert Instructor</p>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Class Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{format(parseISO(selectedClass.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{format(parseISO(selectedClass.date), 'h:mm a')} ({selectedClass.duration})</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{selectedClass.attendees}/{selectedClass.maxAttendees} enrolled</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{selectedClass.level} Level</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedClass.description}</p>
              </div>

              {selectedClass.materials && selectedClass.materials.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Class Materials</h4>
                  <div className="space-y-2">
                    {selectedClass.materials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {material.type === 'pdf' ? (
                            <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                          ) : material.type === 'video' ? (
                            <Video className="h-5 w-5 text-red-500 mr-3" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-green-500 mr-3" />
                          )}
                          <span className="text-gray-700">{material.name}</span>
                        </div>
                        <a 
                          href={material.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Close
                </button>
                {canJoinClass(selectedClass) ? (
                  <button
                    onClick={() => handleJoinClass(selectedClass)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {isJoining ? 'Joining...' : 'Join Class'}
                  </button>
                ) : selectedClass.status === 'scheduled' ? (
                  <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add to Calendar
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}