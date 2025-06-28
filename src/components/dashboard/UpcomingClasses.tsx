import React from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { format } from 'date-fns';

const classes = [
  {
    id: 1,
    title: 'Marketing Strategy Workshop',
    time: new Date(2024, 2, 15, 14, 30),
    duration: '1 hour',
    attendees: 24,
    type: 'live',
  },
  {
    id: 2,
    title: 'Financial Planning Basics',
    time: new Date(2024, 2, 16, 16, 0),
    duration: '45 minutes',
    attendees: 18,
    type: 'recorded',
  },
  {
    id: 3,
    title: 'Business Pitch Practice',
    time: new Date(2024, 2, 17, 15, 30),
    duration: '1.5 hours',
    attendees: 12,
    type: 'live',
  },
];

export default function UpcomingClasses() {
  return (
    <div className="space-y-4">
      {classes.map((class_) => (
        <div
          key={class_.id}
          className="flex items-center space-x-4 rounded-xl border border-gray-200 p-4 hover:border-indigo-200 transition-colors duration-300"
        >
          <div className="flex-shrink-0">
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{class_.title}</p>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {format(class_.time, 'MMM d, h:mm a')}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {class_.attendees} students
              </div>
            </div>
          </div>
          <div>
            {class_.type === 'live' ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600" />
                Live
              </span>
            ) : (
              <Video className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}