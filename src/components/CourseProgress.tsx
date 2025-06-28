import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play, Lock, Award, Star, TrendingUp } from 'lucide-react';

interface CourseProgressProps {
  course: {
    id: string;
    title: string;
    progress: number;
    totalModules: number;
    completedModules: number;
    timeSpent: number;
    nextModule: {
      title: string;
      duration: number;
      type: 'video' | 'quiz' | 'project';
    };
    achievements: Array<{
      id: string;
      title: string;
      earned: boolean;
    }>;
    skills: Array<{
      name: string;
      level: number;
    }>;
  };
  onContinue: () => void;
}

export default function CourseProgress({ course, onContinue }: CourseProgressProps) {
  const progressBarVariants = {
    initial: { width: 0 },
    animate: { width: `${course.progress}%` }
  };

  const skillLevelColors = [
    'bg-gray-200',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Course Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>{course.completedModules}/{course.totalModules} Modules</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{Math.round(course.timeSpent / 60)} hrs spent</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-indigo-600">{course.progress}%</span>
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          variants={progressBarVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Next Module */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Next Up</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {course.nextModule.type === 'video' && <Play className="w-5 h-5 text-blue-500" />}
            {course.nextModule.type === 'quiz' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {course.nextModule.type === 'project' && <Award className="w-5 h-5 text-purple-500" />}
            <div>
              <p className="font-medium text-gray-900">{course.nextModule.title}</p>
              <p className="text-sm text-gray-500">{course.nextModule.duration} min</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue
          </motion.button>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Achievements</h4>
        <div className="grid grid-cols-2 gap-3">
          {course.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                achievement.earned ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              {achievement.earned ? (
                <Star className="w-5 h-5 text-yellow-500" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              <span className={`text-sm ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Progress */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Skills Development</h4>
        <div className="space-y-3">
          {course.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">{skill.name}</span>
                <span className="text-sm font-medium text-gray-900">Level {skill.level}</span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full ${
                      level <= skill.level ? skillLevelColors[level] : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 