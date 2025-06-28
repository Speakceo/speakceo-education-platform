import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  User,
  Send,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  Tag,
  Bookmark,
  MoreHorizontal,
  FileText,
  Download,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Flag,
  BarChart2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Chart from 'react-apexcharts';

interface Ticket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'course' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  assigned_name?: string;
  created_at: string;
  updated_at: string;
  messages: {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_type: 'user' | 'admin';
    content: string;
    created_at: string;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  }[];
  student_details?: {
    course_type: string;
    progress: number;
    last_active: string;
  };
}

interface TicketFilters {
  status: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'all' | 'technical' | 'billing' | 'course' | 'account' | 'other';
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  assigned: 'all' | 'assigned' | 'unassigned' | 'me';
  sortBy: 'created_at' | 'updated_at' | 'priority';
  sortOrder: 'asc' | 'desc';
}

interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  avg_response_time: number; // in hours
  avg_resolution_time: number; // in hours
  satisfaction_rate: number; // percentage
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'all',
    category: 'all',
    priority: 'all',
    assigned: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
    fetchTicketStats();
  }, []);

  // Apply filters and search when tickets or filters change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [tickets, filters, searchQuery]);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockTickets: Ticket[] = Array.from({ length: 20 }, (_, i) => {
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
        
        const updatedAt = new Date(createdAt);
        updatedAt.setHours(updatedAt.getHours() + Math.floor(Math.random() * 48)); // 0-48 hours after created
        
        const status: Ticket['status'] = 
          Math.random() > 0.7 ? 'open' :
          Math.random() > 0.5 ? 'in_progress' :
          Math.random() > 0.3 ? 'resolved' : 'closed';
        
        const priority: Ticket['priority'] = 
          Math.random() > 0.8 ? 'urgent' :
          Math.random() > 0.6 ? 'high' :
          Math.random() > 0.3 ? 'medium' : 'low';
        
        const category: Ticket['category'] = 
          Math.random() > 0.8 ? 'technical' :
          Math.random() > 0.6 ? 'billing' :
          Math.random() > 0.4 ? 'course' :
          Math.random() > 0.2 ? 'account' : 'other';
        
        const userName = [
          'Arjun Patel',
          'Priya Sharma',
          'Rahul Singh',
          'Ananya Gupta',
          'Vikram Mehta',
          'Neha Kapoor',
          'Sanjay Kumar',
          'Meera Reddy',
          'Aditya Shah',
          'Kavita Verma'
        ][Math.floor(Math.random() * 10)];
        
        const userEmail = `${userName.toLowerCase().replace(' ', '.')}@example.com`;
        
        const subjects = [
          'Unable to access course content',
          'Payment failed but amount deducted',
          'Need help with assignment submission',
          'Video playback issues',
          'Request for course extension',
          'Certificate not generated',
          'Login issues',
          'Refund request',
          'Course material download problem',
          'Live class connection issues'
        ];
        
        const descriptions = [
          'I\'m trying to access the Financial Literacy module but getting an error message.',
          'I made a payment for the Premium plan but it failed. However, the amount was deducted from my account.',
          'I\'m unable to submit my assignment for the Marketing module. The submit button is not working.',
          'The videos in the Leadership module are not playing properly. They keep buffering.',
          'Due to personal reasons, I need an extension for completing my course. Please help.',
          'I\'ve completed all modules but my certificate hasn\'t been generated yet.',
          'I\'m unable to log in to my account. It says "Invalid credentials" even though I\'m sure my password is correct.',
          'I want to request a refund as the course content doesn\'t match what was advertised.',
          'I\'m unable to download the PDF materials for the Business Model module.',
          'I couldn\'t connect to the live class yesterday. The link wasn\'t working.'
        ];
        
        // Generate 1-5 messages for the ticket
        const messageCount = 1 + Math.floor(Math.random() * 5);
        const messages = Array.from({ length: messageCount }, (_, j) => {
          const messageSenderType: 'user' | 'admin' = j === 0 ? 'user' : Math.random() > 0.5 ? 'user' : 'admin';
          const messageSenderName = messageSenderType === 'user' ? userName : 'Support Agent';
          
          const messageCreatedAt = new Date(createdAt);
          messageCreatedAt.setHours(messageCreatedAt.getHours() + j * 2); // Each message 2 hours apart
          
          const userMessages = [
            'I\'m having an issue with the course content.',
            'Can you please help me with this problem?',
            'I\'ve tried refreshing the page but it\'s still not working.',
            'Thank you for your help!',
            'I\'m still experiencing the same issue.'
          ];
          
          const adminMessages = [
            'Thank you for reaching out. I\'ll look into this for you.',
            'Could you please provide more details about the issue?',
            'I\'ve checked your account and everything seems to be in order.',
            'The issue has been resolved. Please let me know if you need anything else.',
            'I\'ve escalated this to our technical team.'
          ];
          
          // Randomly add attachments to some messages
          const hasAttachments = Math.random() > 0.7;
          let attachments;
          
          if (hasAttachments) {
            const attachmentTypes = ['image/png', 'application/pdf', 'image/jpeg', 'text/plain'];
            attachments = [{
              name: `attachment-${j}.${['png', 'pdf', 'jpg', 'txt'][Math.floor(Math.random() * 4)]}`,
              url: 'https://example.com/attachment',
              type: attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)]
            }];
          }
          
          return {
            id: `message-${i}-${j}`,
            sender_id: `sender-${i}-${j}`,
            sender_name: messageSenderName,
            sender_type: messageSenderType,
            content: messageSenderType === 'user' 
              ? userMessages[j % userMessages.length] 
              : adminMessages[j % adminMessages.length],
            created_at: messageCreatedAt.toISOString(),
            attachments
          };
        });
        
        return {
          id: `ticket-${i + 1}`,
          user_id: `user-${i + 1}`,
          user_name: userName,
          user_email: userEmail,
          subject: subjects[i % subjects.length],
          description: descriptions[i % descriptions.length],
          category,
          priority,
          status,
          assigned_to: status === 'open' ? undefined : `admin-${1 + Math.floor(Math.random() * 3)}`,
          assigned_name: status === 'open' ? undefined : ['Sarah Chen', 'Raj Patel', 'Dr. Priya Sharma'][Math.floor(Math.random() * 3)],
          created_at: createdAt.toISOString(),
          updated_at: updatedAt.toISOString(),
          messages,
          student_details: {
            course_type: Math.random() > 0.3 ? 'Premium' : 'Basic',
            progress: Math.floor(Math.random() * 100),
            last_active: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString()
          }
        };
      });
      
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to load support tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketStats = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTicketStats({
        total: 156,
        open: 32,
        in_progress: 45,
        resolved: 68,
        closed: 11,
        avg_response_time: 3.5, // hours
        avg_resolution_time: 24, // hours
        satisfaction_rate: 92 // percentage
      });
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...tickets];
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(ticket => ticket.status === filters.status);
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(ticket => ticket.category === filters.category);
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(ticket => ticket.priority === filters.priority);
    }
    
    // Apply assigned filter
    if (filters.assigned !== 'all') {
      if (filters.assigned === 'assigned') {
        result = result.filter(ticket => ticket.assigned_to !== undefined);
      } else if (filters.assigned === 'unassigned') {
        result = result.filter(ticket => ticket.assigned_to === undefined);
      } else if (filters.assigned === 'me') {
        // In a real implementation, this would filter by the current user's ID
        result = result.filter(ticket => ticket.assigned_name === 'Raj Patel');
      }
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ticket => 
          ticket.subject.toLowerCase().includes(query) || 
          ticket.description.toLowerCase().includes(query) ||
          ticket.user_name.toLowerCase().includes(query) ||
          ticket.user_email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'created_at') {
        return filters.sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (filters.sortBy === 'updated_at') {
        return filters.sortOrder === 'asc'
          ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else {
        // For priority
        const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
        return filters.sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });
    
    setFilteredTickets(result);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    
    setIsSending(true);
    
    try {
      // In a real implementation, this would save to Supabase
      // For now, we'll just update the local state
      
      const newMessage = {
        id: `message-${Date.now()}`,
        sender_id: 'admin-1',
        sender_name: 'Support Agent',
        sender_type: 'admin' as const,
        content: replyContent,
        created_at: new Date().toISOString()
      };
      
      const updatedTicket = {
        ...selectedTicket,
        status: selectedTicket.status === 'open' ? 'in_progress' as const : selectedTicket.status,
        messages: [...selectedTicket.messages, newMessage],
        updated_at: new Date().toISOString()
      };
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setSelectedTicket(updatedTicket);
      setReplyContent('');
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateTicketStatus = async (status: Ticket['status']) => {
    if (!selectedTicket) return;
    
    try {
      // In a real implementation, this would update in Supabase
      // For now, we'll just update the local state
      
      const updatedTicket = {
        ...selectedTicket,
        status,
        updated_at: new Date().toISOString()
      };
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError('Failed to update ticket status. Please try again.');
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      // In a real implementation, this would update in Supabase
      // For now, we'll just update the local state
      
      const updatedTicket = {
        ...selectedTicket,
        assigned_to: 'admin-1',
        assigned_name: 'Support Agent',
        status: selectedTicket.status === 'open' ? 'in_progress' as const : selectedTicket.status,
        updated_at: new Date().toISOString()
      };
      
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error('Error assigning ticket:', error);
      setError('Failed to assign ticket. Please try again.');
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-amber-100 text-amber-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Ticket['category']) => {
    switch (category) {
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'course':
        return 'bg-blue-100 text-blue-800';
      case 'account':
        return 'bg-amber-100 text-amber-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Chart options for ticket analytics
  const ticketStatusOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    colors: ['#3B82F6', '#F59E0B', '#10B981', '#6B7280'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const ticketStatusSeries = ticketStats ? [
    ticketStats.open,
    ticketStats.in_progress,
    ticketStats.resolved,
    ticketStats.closed
  ] : [0, 0, 0, 0];

  // Chart options for ticket categories
  const ticketCategoryOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    colors: ['#8B5CF6'],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Technical', 'Billing', 'Course', 'Account', 'Other'],
    }
  };

  const ticketCategorySeries = [{
    name: 'Tickets',
    data: [
      tickets.filter(t => t.category === 'technical').length,
      tickets.filter(t => t.category === 'billing').length,
      tickets.filter(t => t.category === 'course').length,
      tickets.filter(t => t.category === 'account').length,
      tickets.filter(t => t.category === 'other').length
    ]
  }];

  // Chart options for response time trend
  const responseTimeTrendOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5', '#10B981'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yaxis: {
      title: {
        text: 'Hours'
      }
    }
  };

  const responseTimeTrendSeries = [
    {
      name: 'Response Time',
      data: [4.2, 3.8, 3.5, 3.2, 3.0, 2.8]
    },
    {
      name: 'Resolution Time',
      data: [28, 26, 24, 22, 20, 18]
    }
  ];

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 mt-1">
            Manage and respond to student support requests
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAnalytics(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BarChart2 className="h-5 w-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={fetchTickets}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-6">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg shadow-sm">
        {/* Ticket List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as TicketFilters['status'] })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as TicketFilters['priority'] })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value as TicketFilters['category'] })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="course">Course</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={filters.assigned}
                onChange={(e) => setFilters({ ...filters, assigned: e.target.value as TicketFilters['assigned'] })}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Tickets</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
                <option value="me">Assigned to Me</option>
              </select>
            </div>
          </div>
          
          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No tickets found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTicket?.id === ticket.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{ticket.subject}</h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getCategoryColor(ticket.category)}`}>
                          {ticket.category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Ticket Details */}
        <div className="w-2/3 flex flex-col">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedTicket.subject}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{selectedTicket.user_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{selectedTicket.user_email}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{formatDate(selectedTicket.created_at)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(selectedTicket.category)}`}>
                    {selectedTicket.category}
                  </span>
                  
                  {selectedTicket.assigned_to ? (
                    <div className="flex items-center ml-4">
                      <span className="text-xs text-gray-500 mr-2">Assigned to:</span>
                      <span className="text-xs font-medium text-gray-700">{selectedTicket.assigned_name}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAssignTicket}
                      className="ml-4 text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Assign to me
                    </button>
                  )}
                </div>
                
                {/* Student Details */}
                {selectedTicket.student_details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-gray-700">Student Details</h4>
                      <button 
                        onClick={() => window.location.href = `/admin/users?search=${selectedTicket.user_email}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Course Type</p>
                        <p className="text-xs font-medium text-gray-900">{selectedTicket.student_details.course_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Progress</p>
                        <p className="text-xs font-medium text-gray-900">{selectedTicket.student_details.progress}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Active</p>
                        <p className="text-xs font-medium text-gray-900">{new Date(selectedTicket.student_details.last_active).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Ticket Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Initial Description */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{selectedTicket.user_name}</span>
                      <span className="text-xs text-gray-500">{formatDate(selectedTicket.created_at)}</span>
                    </div>
                    <p className="text-gray-700">{selectedTicket.description}</p>
                  </div>
                </div>
                
                {/* Message Thread */}
                {selectedTicket.messages.slice(1).map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {message.sender_type === 'admin' ? (
                        <MessageSquare className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className={`flex-1 rounded-lg p-4 ${
                      message.sender_type === 'admin' ? 'bg-indigo-50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{message.sender_name}</span>
                        <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                      </div>
                      <p className={`${
                        message.sender_type === 'admin' ? 'text-indigo-700' : 'text-gray-700'
                      }`}>
                        {message.content}
                      </p>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center p-2 bg-white rounded border border-gray-200">
                              <div className="flex-shrink-0 mr-2">
                                {attachment.type.includes('image') ? (
                                  <FileText className="h-5 w-5 text-blue-500" />
                                ) : attachment.type.includes('pdf') ? (
                                  <FileText className="h-5 w-5 text-red-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                <a 
                                  href={attachment.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reply Box */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleUpdateTicketStatus(e.target.value as Ticket['status'])}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={handleSendReply}
                        disabled={isSending || !replyContent.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isSending ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Ticket Selected</h3>
                <p className="text-gray-500 max-w-md">
                  Select a ticket from the list to view details and respond to the student.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Support Analytics</h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Total Tickets</h4>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{ticketStats?.total || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Avg. Response Time</h4>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{ticketStats?.avg_response_time || 0} hrs</p>
                  <p className="text-xs text-green-600 mt-1">↓ 15% from last month</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Avg. Resolution Time</h4>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{ticketStats?.avg_resolution_time || 0} hrs</p>
                  <p className="text-xs text-green-600 mt-1">↓ 8% from last month</p>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Satisfaction Rate</h4>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{ticketStats?.satisfaction_rate || 0}%</p>
                  <p className="text-xs text-green-600 mt-1">↑ 3% from last month</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Ticket Status Distribution</h4>
                  <Chart
                    options={ticketStatusOptions}
                    series={ticketStatusSeries}
                    type="donut"
                    height={300}
                  />
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Ticket Categories</h4>
                  <Chart
                    options={ticketCategoryOptions}
                    series={ticketCategorySeries}
                    type="bar"
                    height={300}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Response & Resolution Time Trend</h4>
                <Chart
                  options={responseTimeTrendOptions}
                  series={responseTimeTrendSeries}
                  type="line"
                  height={300}
                />
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Key Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Improved Response Time</p>
                      <p className="text-sm text-gray-600">Average first response time has decreased by 15% compared to last month.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Technical Issues Increasing</p>
                      <p className="text-sm text-gray-600">There's been a 12% increase in technical support tickets, primarily related to video playback.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Star className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">High Satisfaction Rate</p>
                      <p className="text-sm text-gray-600">92% of users rated their support experience as "Excellent" or "Good".</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // In a real implementation, this would download a detailed report
                    alert('Downloading detailed analytics report...');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}