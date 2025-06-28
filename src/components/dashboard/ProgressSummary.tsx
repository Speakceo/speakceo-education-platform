import React from 'react';
import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

type ProgressSummaryProps = {
  variant?: 'card' | 'inline';
  showNextLesson?: boolean;
};

const ProgressSummary = ({ variant = 'card', showNextLesson = true }: ProgressSummaryProps) => {
  // Static mock data
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium text-gray-600">Progress:</div>
        <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-indigo-600 left-0 top-0"
            style={{ width: '60%' }}
          ></div>
        </div>
        <div className="text-sm font-medium text-indigo-600">60%</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-900">Lessons Completed</span>
          </div>
          <p className="text-xl font-bold text-indigo-700">12/20</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-900">Tasks Completed</span>
          </div>
          <p className="text-xl font-bold text-green-700">8/15</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Completion</span>
          <span className="text-sm font-medium text-indigo-600">60%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600"
            style={{ width: '60%' }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-sm font-medium">4-day streak</span>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">+5% this week</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;