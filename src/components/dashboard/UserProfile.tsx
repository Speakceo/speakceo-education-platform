import React from 'react';
import { useUserStore } from '../../lib/store';
import { Shield, Award, Star, BookOpen } from 'lucide-react';

export default function UserProfile() {
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start space-x-6">
        <img
          src={user.avatar || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
          alt={user.name}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <div className="mt-1 flex items-center">
            <Shield className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">{user.courseType} Plan</span>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-100 mx-auto">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">{user.points}</p>
              <p className="text-xs text-gray-500">Points</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 mx-auto">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">12</p>
              <p className="text-xs text-gray-500">Achievements</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 mx-auto">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">{user.progress}%</p>
              <p className="text-xs text-gray-500">Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}