import React, { useState } from 'react';
import { Video, Users, Calendar, Clock, Star, BookOpen, MessageSquare, Award, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface UpcomingClass {
  id: number;
  title: string;
  instructor: string;
  instructorImage: string;
  date: Date;
  duration: string;
  attendees: number;
  level: string;
  description: string;
}

const upcomingClasses: UpcomingClass[] = [
  {
    id: 1,
    title: 'Introduction to Business Model Canvas',
    instructor: 'Dr. Priya Sharma',
    instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: new Date(),
    duration: '1 hour',
    attendees: 25,
    level: 'Beginner',
    description: 'Learn how to create and analyze a business model canvas for your startup idea.'
  },
  {
    id: 2,
    title: 'Marketing Strategies for Young Entrepreneurs',
    instructor: 'Raj Patel',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: addDays(new Date(), 1),
    duration: '1.5 hours',
    attendees: 30,
    level: 'Intermediate',
    description: 'Discover effective marketing strategies tailored for young entrepreneurs with limited budgets.'
  },
  {
    id: 3,
    title: 'Financial Planning Workshop',
    instructor: 'Sarah Chen',
    instructorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    date: addDays(new Date(), 2),
    duration: '2 hours',
    attendees: 20,
    level: 'Advanced',
    description: 'Master the fundamentals of financial planning for your business with hands-on exercises.'
  }
];

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
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 pt-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            🎥 Weekend <span className="gradient-text">Live Classes</span> With Experts
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Interactive, fun-filled live sessions to guide your child through real-world entrepreneurship.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Live Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingClasses.map((class_) => (
            <div key={class_.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  class_.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  class_.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {class_.level}
                </span>
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 text-sm font-medium">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{class_.title}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-500">
                  <Award className="h-5 w-5 mr-2" />
                  <span>{class_.instructor}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{format(class_.date, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{class_.duration}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{class_.attendees} students enrolled</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 line-clamp-2">{class_.description}</p>
              <button 
                onClick={() => setSelectedClass(class_)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300"
              >
                Join Class
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedClass.title}</h2>
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
                  src={selectedClass.instructorImage}
                  alt={selectedClass.instructor}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedClass.instructor}</h3>
                  <p className="text-gray-500">Expert Instructor</p>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Class Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{format(selectedClass.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{selectedClass.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{selectedClass.attendees} students enrolled</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{selectedClass.level} Level</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700">{selectedClass.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">Understand key concepts and principles</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">Apply practical techniques to real-world scenarios</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">Develop essential skills through interactive exercises</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                    <span className="text-gray-700">Receive personalized feedback from industry experts</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 mr-3"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join our community of young entrepreneurs and start your business journey today!
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-indigo-50 transition-colors duration-300">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}