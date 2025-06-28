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
  ChevronLeft, 
  Filter, 
  Search, 
  Plus, 
  ExternalLink, 
  Calendar as CalendarIcon,
  ArrowRight,
  Award as AwardIcon,
  Zap,
  Sparkles,
  Target,
  Brain,
  Mic,
  RefreshCw,
  X,
  Download,
  Bell,
  Trash2,
  Edit
} from 'lucide-react';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks, isBefore, isAfter, differenceInMinutes } from 'date-fns';
import { useUserStore, useProgressStore } from '../../lib/store';
import ProgressBar from '../ui/ProgressBar';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    image: string;
    bio: string;
  };
  date: Date;
  duration: string; // e.g., "1 hour"
  durationMinutes: number; // e.g., 60
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  materials: {
    id: string;
    type: 'pdf' | 'video' | 'quiz';
    title: string;
    url: string;
  }[];
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
  joinUrl?: string;
  feedback?: {
    rating: number;
    submitted: boolean;
  };
}

// Mock data for upcoming classes
const upcomingClasses: LiveClass[] = [
  {
    id: '1',
    title: 'Business Model Canvas Workshop',
    description: 'Learn how to create and analyze a business model canvas for your startup idea. We\'ll cover all nine components and work through real examples.',
    instructor: {
      name: 'Dr. Priya Sharma',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bio: 'Former Harvard Business School professor with 15+ years of experience in business education.'
    },
    date: new Date(new Date().setHours(new Date().getHours() + 3)),
    duration: '1.5 hours',
    durationMinutes: 90,
    category: 'Business Strategy',
    level: 'Beginner',
    tags: ['Business Model', 'Strategy', 'Startup'],
    materials: [
      {
        id: 'm1',
        type: 'pdf',
        title: 'Business Model Canvas Template',
        url: 'https://example.com/business-model-canvas.pdf'
      },
      {
        id: 'm2',
        type: 'video',
        title: 'Introduction to Business Models',
        url: 'https://www.youtube.com/watch?v=QoAOzMTLP5s'
      }
    ],
    attendees: 24,
    maxAttendees: 30,
    status: 'scheduled',
    joinUrl: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Financial Planning for Young Entrepreneurs',
    description: 'Essential financial planning concepts for startup founders and young entrepreneurs. Learn budgeting, forecasting, and financial modeling.',
    instructor: {
      name: 'Raj Patel',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bio: 'Financial technology expert specializing in startup finance and investment strategies.'
    },
    date: addDays(new Date(), 1),
    duration: '2 hours',
    durationMinutes: 120,
    category: 'Finance',
    level: 'Intermediate',
    tags: ['Finance', 'Planning', 'Budgeting'],
    materials: [
      {
        id: 'm3',
        type: 'pdf',
        title: 'Financial Planning Worksheet',
        url: 'https://example.com/financial-planning.pdf'
      },
      {
        id: 'm4',
        type: 'quiz',
        title: 'Financial Literacy Quiz',
        url: 'https://example.com/finance-quiz'
      }
    ],
    attendees: 18,
    maxAttendees: 25,
    status: 'scheduled',
    joinUrl: 'https://meet.google.com/jkl-mnop-qrs'
  },
  {
    id: '3',
    title: 'Effective Pitch Techniques',
    description: 'Master the art of pitching your business idea to investors and stakeholders. Learn storytelling, presentation skills, and handling Q&A.',
    instructor: {
      name: 'Sarah Chen',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bio: 'Communication expert and pitch coach for over 200 successful startups.'
    },
    date: addDays(new Date(), -1),
    duration: '1.5 hours',
    durationMinutes: 90,
    category: 'Communication',
    level: 'Advanced',
    tags: ['Pitching', 'Public Speaking', 'Presentation'],
    materials: [
      {
        id: 'm5',
        type: 'pdf',
        title: 'Pitch Deck Template',
        url: 'https://example.com/pitch-deck-template.pdf'
      },
      {
        id: 'm6',
        type: 'video',
        title: 'Successful Pitch Examples',
        url: 'https://www.youtube.com/watch?v=SB16xgtFmco'
      }
    ],
    attendees: 35,
    maxAttendees: 40,
    status: 'completed',
    recordingUrl: 'https://example.com/recordings/pitch-techniques-2023.mp4',
    joinUrl: 'https://meet.google.com/tuv-wxyz-123',
    feedback: {
      rating: 4.8,
      submitted: true
    }
  },
  {
    id: '4',
    title: 'Marketing Strategies for Startups',
    description: 'Learn cost-effective marketing strategies for early-stage startups. Focus on digital marketing, content creation, and growth hacking.',
    instructor: {
      name: 'Vikram Mehta',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bio: 'Growth marketing specialist who has helped 50+ startups scale their customer acquisition.'
    },
    date: addDays(new Date(), 2),
    duration: '2 hours',
    durationMinutes: 120,
    category: 'Marketing',
    level: 'Intermediate',
    tags: ['Marketing', 'Growth', 'Digital'],
    materials: [
      {
        id: 'm7',
        type: 'pdf',
        title: 'Marketing Strategy Template',
        url: 'https://example.com/marketing-strategy.pdf'
      },
      {
        id: 'm8',
        type: 'quiz',
        title: 'Marketing Channels Quiz',
        url: 'https://example.com/marketing-quiz'
      }
    ],
    attendees: 12,
    maxAttendees: 35,
    status: 'scheduled',
    joinUrl: 'https://meet.google.com/456-789-abc'
  },
  {
    id: '5',
    title: 'Leadership Skills for Young CEOs',
    description: 'Develop essential leadership skills to effectively manage your team and business. Learn delegation, motivation, and decision-making.',
    instructor: {
      name: 'Ananya Gupta',
      image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bio: 'Leadership coach and founder of three successful startups.'
    },
    date: new Date(),
    duration: '1.5 hours',
    durationMinutes: 90,
    category: 'Leadership',
    level: 'Intermediate',
    tags: ['Leadership', 'Management', 'Team Building'],
    materials: [
      {
        id: 'm9',
        type: 'pdf',
        title: 'Leadership Assessment',
        url: 'https://example.com/leadership-assessment.pdf'
      },
      {
        id: 'm10',
        type: 'video',
        title: 'Leadership Case Studies',
        url: 'https://www.youtube.com/watch?v=XKUPDUDOBVo'
      }
    ],
    attendees: 28,
    maxAttendees: 30,
    status: 'live',
    joinUrl: 'https://meet.google.com/def-ghi-jkl'
  }
];

// Past classes with recordings
const pastClasses = [
  {
    id: '6',
    title: 'Investor Pitch Masterclass',
    instructor: 'James Wilson',
    date: addDays(new Date(), -7),
    duration: '1.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
    recordingUrl: 'https://example.com/recordings/investor-pitch-masterclass.mp4',
    views: 156,
    rating: 4.9
  },
  {
    id: '7',
    title: 'Digital Marketing Fundamentals',
    instructor: 'Sophia Chen',
    date: addDays(new Date(), -14),
    duration: '2 hours',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
    recordingUrl: 'https://example.com/recordings/digital-marketing-fundamentals.mp4',
    views: 243,
    rating: 4.7
  },
  {
    id: '8',
    title: 'Business Model Innovation',
    instructor: 'Dr. Priya Sharma',
    date: addDays(new Date(), -21),
    duration: '1.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
    recordingUrl: 'https://example.com/recordings/business-model-innovation.mp4',
    views: 189,
    rating: 4.8
  }
];

// Recommended classes based on user progress and interests
const recommendedClasses = [
  {
    id: '9',
    title: 'Startup Legal Essentials',
    instructor: 'Aisha Patel, J.D.',
    date: addDays(new Date(), 7),
    level: 'Beginner',
    category: 'Legal',
    description: 'Learn the essential legal requirements for starting a business, including entity formation, contracts, and intellectual property.',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80'
  },
  {
    id: '10',
    title: 'E-commerce Business Strategies',
    instructor: 'Carlos Rodriguez',
    date: addDays(new Date(), 9),
    level: 'Intermediate',
    category: 'Business Strategy',
    description: 'Discover proven strategies for launching and scaling an e-commerce business, from platform selection to fulfillment.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80'
  },
  {
    id: '11',
    title: 'AI Tools for Entrepreneurs',
    instructor: 'Dr. Maya Johnson',
    date: addDays(new Date(), 12),
    level: 'Beginner',
    category: 'Technology',
    description: 'Learn how to leverage AI tools to automate tasks, generate content, and make data-driven decisions for your business.',
    thumbnail: 'https://images.unsplash.com/photo-1677442135968-6bd241f26c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80'
  }
];

export default function LiveClassesPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'materials'>('upcoming');
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [calendarView, setCalendarView] = useState<'week' | 'list'>('week');
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isJoiningClass, setIsJoiningClass] = useState(false);
  
  const { user } = useUserStore();
  const { getOverallProgress, updateLessonProgress } = useProgressStore();
  
  const overallProgress = getOverallProgress();

  // Filter classes based on search query and level filter
  const filteredUpcomingClasses = upcomingClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filterLevel === 'All' || cls.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  // Get classes for the current week view
  const currentWeekClasses = filteredUpcomingClasses.filter(cls => {
    const classDate = new Date(cls.date);
    const weekEnd = addDays(currentWeekStart, 6);
    return isAfter(classDate, currentWeekStart) && isBefore(classDate, addDays(weekEnd, 1));
  });

  // Group classes by day for the week view
  const classesByDay = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(currentWeekStart, i);
    return {
      date: day,
      classes: currentWeekClasses.filter(cls => isSameDay(new Date(cls.date), day))
    };
  });

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleJoinClass = (cls: LiveClass) => {
    setIsJoiningClass(true);
    
    // Simulate joining the class
    setTimeout(() => {
      // Record progress if the class is linked to a module/lesson
      if (cls.joinUrl) {
        window.open(cls.joinUrl, '_blank');
      }
      
      setIsJoiningClass(false);
    }, 1500);
  };

  const handleSubmitFeedback = () => {
    // In a real implementation, this would submit feedback to the backend
    if (selectedClass) {
      // Update the selected class with feedback
      const updatedClass = {
        ...selectedClass,
        feedback: {
          rating: feedbackRating,
          submitted: true
        }
      };
      
      setSelectedClass(updatedClass);
      setShowFeedbackForm(false);
      
      // Show success message
      alert('Thank you for your feedback!');
    }
  };

  const canJoinClass = (cls: LiveClass) => {
    if (cls.status === 'completed' || cls.status === 'cancelled') {
      return false;
    }
    
    const now = new Date();
    const classTime = new Date(cls.date);
    const minutesUntilClass = differenceInMinutes(classTime, now);
    
    return minutesUntilClass <= 10 && minutesUntilClass >= -cls.durationMinutes;
  };

  const getClassStatusLabel = (cls: LiveClass) => {
    switch (cls.status) {
      case 'live':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
            Live Now
          </span>
        );
      case 'scheduled':
        const now = new Date();
        const classTime = new Date(cls.date);
        const minutesUntilClass = differenceInMinutes(classTime, now);
        
        if (minutesUntilClass <= 10 && minutesUntilClass > 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-600 animate-pulse"></span>
              Starting Soon
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
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
      case 'Product':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'Legal':
        return <BookOpen className="h-5 w-5 text-red-600" />;
      case 'Technology':
        return <Brain className="h-5 w-5 text-cyan-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-gray-600 mt-1">Schedule and manage live classes for students</p>
        </div>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Class</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Showing classes from {format(new Date(), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUpcomingClasses.map((cls) => (
                <tr key={cls.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(cls.category)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cls.title}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{cls.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img className="h-8 w-8 rounded-full" src={cls.instructor.image} alt={cls.instructor.name} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{cls.instructor.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{format(new Date(cls.date), 'MMMM d, yyyy')}</div>
                    <div className="text-xs text-gray-500">{format(new Date(cls.date), 'h:mm a')} ({cls.duration})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cls.attendees}/{cls.maxAttendees}</div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ width: `${(cls.attendees / cls.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getClassStatusLabel(cls)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      {cls.status === 'scheduled' && (
                        <>
                          <a 
                            href="#" 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => {
                              e.preventDefault();
                              // Edit class logic
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </a>
                          <a 
                            href="#" 
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.preventDefault();
                              // Cancel class logic
                            }}
                          >
                            <X className="h-4 w-4" />
                          </a>
                        </>
                      )}
                      {cls.status === 'live' && cls.joinUrl && (
                        <a 
                          href={cls.joinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {cls.status === 'completed' && cls.recordingUrl && (
                        <a 
                          href={cls.recordingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Video className="h-4 w-4" />
                        </a>
                      )}
                      <a 
                        href="#" 
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          e.preventDefault();
                          // Delete class logic
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUpcomingClasses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No classes found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}