import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  Video, 
  Users, 
  Lightbulb,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I access my courses?',
      answer: 'Go to "My Courses" in the sidebar to view all your enrolled courses. Click on any course to start learning.',
      category: 'courses'
    },
    {
      id: '2',
      question: 'How do I submit my assignments?',
      answer: 'Navigate to the "Tasks" section, find your assignment, and click "Submit". You can upload files, enter text, or select from multiple choices depending on the task type.',
      category: 'tasks'
    },
    {
      id: '3',
      question: 'When are live classes scheduled?',
      answer: 'Check the "Live Classes" section for upcoming sessions. You\'ll see the schedule, instructor details, and join links.',
      category: 'live-classes'
    },
    {
      id: '4',
      question: 'How do I track my progress?',
      answer: 'Your progress is automatically tracked and displayed in the Analytics section. You can see completion rates, XP points, and learning streaks.',
      category: 'progress'
    },
    {
      id: '5',
      question: 'Can I access AI tools for help?',
      answer: 'Yes! Visit the "AI Tools" section for personalized learning assistance, business plan help, and study support.',
      category: 'ai-tools'
    },
    {
      id: '6',
      question: 'How do I join the community discussions?',
      answer: 'Click on "Community" to join discussions, ask questions, and connect with other students.',
      category: 'community'
    },
    {
      id: '7',
      question: 'What if I miss a live class?',
      answer: 'Most live classes are recorded and available in your course materials. Check the "Live Classes" section for recordings.',
      category: 'live-classes'
    },
    {
      id: '8',
      question: 'How do I contact my instructors?',
      answer: 'Use the "Ask CEO" messaging feature to communicate with instructors and get personalized support.',
      category: 'contact'
    }
  ];

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: 'Start Chat',
      available: true,
      color: 'bg-green-500'
    },
    {
      title: 'Email Support',
      description: 'Send us detailed questions via email',
      icon: Mail,
      action: 'Send Email',
      available: true,
      color: 'bg-blue-500'
    },
    {
      title: 'Video Call',
      description: 'Schedule a 1-on-1 support session',
      icon: Video,
      action: 'Schedule Call',
      available: true,
      color: 'bg-purple-500'
    },
    {
      title: 'Phone Support',
      description: 'Call us during business hours',
      icon: Phone,
      action: 'Call Now',
      available: false,
      color: 'bg-orange-500'
    }
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', icon: Book, url: '/dashboard/courses' },
    { title: 'Video Tutorials', icon: Video, url: '/dashboard/courses' },
    { title: 'Community Forum', icon: Users, url: '/dashboard/community' },
    { title: 'AI Learning Assistant', icon: Lightbulb, url: '/dashboard/ai-tools' },
    { title: 'Contact Instructor', icon: MessageCircle, url: '/dashboard/messages' }
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitContact = () => {
    // Here you would handle the contact form submission
    alert('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ subject: '', message: '', priority: 'normal' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        </div>
        <p className="text-gray-600">
          Find answers to common questions, get support, and access helpful resources.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'contact', label: 'Contact Support', icon: MessageCircle },
              { id: 'resources', label: 'Resources', icon: Book }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openFAQ === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-4 pb-3 text-gray-700">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No FAQ items found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {supportOptions.map((option) => (
              <div key={option.title} className="bg-white rounded-lg shadow-sm border p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${option.color} text-white mb-4`}>
                  <option.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    option.available
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!option.available}
                >
                  {option.action}
                  {!option.available && ' (Soon)'}
                </button>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <button
                  onClick={handleSubmitContact}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Support Hours</h3>
                <div className="text-blue-800 space-y-1">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  Emergency support is available 24/7 for critical issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.url}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <link.icon className="h-6 w-6 text-indigo-600 mr-3" />
                    <span className="font-medium text-gray-900">{link.title}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentation</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Platform User Guide</h3>
                    <p className="text-gray-600 text-sm">Complete guide to using all platform features</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Video className="h-6 w-6 text-indigo-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Video Tutorials</h3>
                    <p className="text-gray-600 text-sm">Step-by-step video guides for common tasks</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-indigo-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Tips & Best Practices</h3>
                    <p className="text-gray-600 text-sm">Expert tips to maximize your learning experience</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Platform Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Live Classes</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Assignment Submissions</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700">AI Tools</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 