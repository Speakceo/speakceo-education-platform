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
import { useUserStore, useProgressStore, useUnifiedProgressStore } from '../lib/store';
import SEO from '../components/SEO';

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

const upcomingClasses: LiveClass[] = [
  {
    id: '1',
    title: 'Business Model Canvas Workshop',
    description: 'Learn how to create and analyze a business model canvas for your startup idea. We\'ll cover all nine components and work through real examples.',
    instructor: {
      id: 'i1',
      name: 'Dr. Priya Sharma',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    date: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString(),
    duration: '1.5 hours',
    durationMinutes: 90,
    category: 'Business Strategy',
    level: 'Beginner',
    attendees: 24,
    maxAttendees: 30,
    status: 'scheduled',
    joinUrl: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Digital Marketing Essentials',
    description: 'Master the fundamentals of digital marketing for your startup. From social media to SEO, learn how to grow your online presence.',
    instructor: {
      id: 'i2',
      name: 'Raj Patel',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    date: new Date(new Date().setHours(new Date().getHours() + 24)).toISOString(),
    duration: '2 hours',
    durationMinutes: 120,
    category: 'Marketing',
    level: 'Intermediate',
    attendees: 28,
    maxAttendees: 30,
    status: 'scheduled',
    joinUrl: 'https://meet.google.com/xyz-defg-hij'
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
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  
  const { user } = useUserStore();
  const { getOverallProgress } = useProgressStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  const overallProgress = getOverallProgress();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleJoinClass = async (class_: LiveClass) => {
    setIsJoining(true);
    try {
      // Simulate joining delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.open(class_.joinUrl, '_blank');
      recordActivity('joined_live_class', { classId: class_.id });
    } catch (err) {
      setError('Failed to join the class. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const canJoinClass = (class_: LiveClass) => {
    if (class_.status === 'live') return true;
    const minutesToStart = differenceInMinutes(parseISO(class_.date), new Date());
    return minutesToStart <= 15 && minutesToStart >= 0;
  };

  const getTimeStatus = (class_: LiveClass) => {
    const now = new Date();
    const classDate = parseISO(class_.date);
    const minutesToStart = differenceInMinutes(classDate, now);
    const hoursToStart = differenceInMinutes(classDate, now);
    const daysToStart = differenceInDays(classDate, now);

    if (class_.status === 'live') {
      return 'Live Now!';
    }

    if (minutesToStart <= 0) {
      return 'Starting Soon';
    }

    if (minutesToStart < 60) {
      return `Starts in ${minutesToStart} minutes`;
    }

    if (hoursToStart < 24) {
      return `Starts in ${Math.round(hoursToStart)} hours`;
    }

    return `Starts in ${daysToStart} days`;
  };

  const filteredClasses = upcomingClasses.filter(class_ => {
    const matchesSearch = class_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         class_.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'All' || class_.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Live Classes | Young CEO Program"
        description="Join interactive live classes with expert mentors and learn entrepreneurship skills in real-time."
        keywords={["live classes", "online learning", "entrepreneurship", "mentorship"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Live Interactive Classes
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Learn directly from industry experts and successful entrepreneurs through interactive live sessions.
            </p>
            <div className="flex justify-center space-x-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="bg-white/10 p-3 rounded-lg inline-block mb-2">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Class Listings */}
          <div className="space-y-6">
            {filteredClasses.map((class_) => (
              <div
                key={class_.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        class_.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        class_.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {class_.level}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        class_.status === 'live' ? 'bg-red-100 text-red-800 animate-pulse' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTimeStatus(class_)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {class_.attendees}/{class_.maxAttendees}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{class_.title}</h3>
                  <p className="text-gray-600 mb-4">{class_.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={class_.instructor.avatar_url}
                        alt={class_.instructor.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {class_.instructor.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {class_.status === 'live' || canJoinClass(class_) ? (
                        <button
                          onClick={() => handleJoinClass(class_)}
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
                        <button
                          onClick={() => setSelectedClass(class_)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find more classes.
              </p>
            </div>
          )}
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
                  src={selectedClass.instructor.avatar_url}
                  alt={selectedClass.instructor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedClass.instructor.name}</h3>
                  <p className="text-gray-500">Expert Instructor</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">About This Class</h4>
                  <p className="text-gray-700">{selectedClass.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h4>
                    <p className="text-gray-700">{format(parseISO(selectedClass.date), 'PPP p')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Duration</h4>
                    <p className="text-gray-700">{selectedClass.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                    <p className="text-gray-700">{selectedClass.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Level</h4>
                    <p className="text-gray-700">{selectedClass.level}</p>
                  </div>
                </div>

                {selectedClass.materials && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Class Materials</h4>
                    <div className="space-y-2">
                      {selectedClass.materials.map((material) => (
                        <a
                          key={material.id}
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {material.type === 'pdf' ? (
                            <FileText className="h-5 w-5 text-red-500 mr-2" />
                          ) : material.type === 'video' ? (
                            <Video className="h-5 w-5 text-blue-500 mr-2" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                          )}
                          <span className="text-gray-700">{material.name}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                  {canJoinClass(selectedClass) ? (
                    <button
                      onClick={() => handleJoinClass(selectedClass)}
                      disabled={isJoining}
                      className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Join Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Add to calendar logic
                      }}
                      className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Add to Calendar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 