import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Sparkles, 
  Award, 
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Lock,
  Play,
  BrainCircuit,
  Video,
  Clock,
  Zap,
  MessageSquare,
  Share2,
  Download
} from 'lucide-react';
import { useUserStore, useProgressStore, useUnifiedProgressStore } from '../../lib/store';
import ProgressBar from '../ui/ProgressBar';

// Define achievement types based on user progress
const getAchievements = (userProgress: number, completedLessons: number, totalLessons: number) => {
  return [
    {
      id: 1,
      title: 'First Business Plan',
      description: 'Created your first complete business plan',
      icon: Target,
      color: 'from-amber-500 to-orange-500',
      date: '2 days ago',
      xp: 100,
      unlocked: userProgress >= 15
    },
    {
      id: 2,
      title: 'Marketing Master',
      description: 'Completed all marketing course modules',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      date: '1 week ago',
      xp: 150,
      unlocked: userProgress >= 30
    },
    {
      id: 3,
      title: 'Innovation Award',
      description: 'Top 3 in monthly pitch competition',
      icon: Trophy,
      color: 'from-blue-500 to-indigo-500',
      date: '2 weeks ago',
      xp: 200,
      unlocked: userProgress >= 45
    },
    {
      id: 4,
      title: 'Public Speaking Pro',
      description: 'Delivered 5 successful presentations',
      icon: Video,
      color: 'from-green-500 to-emerald-500',
      date: 'Locked',
      xp: 250,
      unlocked: userProgress >= 60,
      progress: Math.min(100, Math.round((userProgress / 60) * 100))
    }
  ];
};

// Define skill mastery based on user progress
const getSkillMasteries = (userProgress: number) => {
  return [
    {
      name: 'Business Strategy',
      progress: Math.min(100, Math.round(userProgress * 0.75)),
      icon: Target,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'Financial Literacy',
      progress: Math.min(100, Math.round(userProgress * 0.60)),
      icon: BrainCircuit,
      color: 'from-green-600 to-emerald-600'
    },
    {
      name: 'Public Speaking',
      progress: Math.min(100, Math.round(userProgress * 0.85)),
      icon: Video,
      color: 'from-purple-600 to-pink-600'
    },
    {
      name: 'Leadership',
      progress: Math.min(100, Math.round(userProgress * 0.70)),
      icon: Users,
      color: 'from-amber-600 to-orange-600'
    }
  ];
};

// Generate upcoming challenges based on user progress
const getUpcomingChallenges = (userProgress: number) => {
  return [
    {
      title: 'Business Pitch Challenge',
      deadline: '3 days left',
      reward: '500 XP',
      participants: 45
    },
    {
      title: 'Marketing Campaign Simulation',
      deadline: '5 days left',
      reward: '400 XP',
      participants: 32
    }
  ];
};

export default function Achievements() {
  const { user } = useUserStore();
  const { 
    fetchUserProgress, 
    getOverallProgress, 
    getCompletedLessons, 
    getTotalLessons,
    getLearningStreak
  } = useProgressStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  useEffect(() => {
    if (user) {
      fetchUserProgress(user.id);
    }
  }, [user, fetchUserProgress]);
  
  const overallProgress = getOverallProgress();
  const completedLessons = getCompletedLessons();
  const totalLessons = getTotalLessons();
  const learningStreak = getLearningStreak();
  
  // Get dynamic data based on user progress
  const achievements = getAchievements(overallProgress, completedLessons, totalLessons);
  const skillMasteries = getSkillMasteries(overallProgress);
  const upcomingChallenges = getUpcomingChallenges(overallProgress);
  
  const handleUnlockAchievement = (achievement: typeof achievements[0]) => {
    if (achievement.unlocked) return;
    
    // Record activity
    recordActivity({
      type: 'course',
      title: `Unlocked ${achievement.title} Achievement`,
      xpEarned: achievement.xp
    });
    
    // Show success message
    alert(`Congratulations! You've unlocked the ${achievement.title} achievement and earned ${achievement.xp} XP!`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with Progress Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Achievements</h2>
            <p className="text-gray-500 mt-1">Track your progress and unlock rewards</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{user?.points || 0}</p>
              <p className="text-sm text-gray-500">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{Math.floor(overallProgress / 10)}</p>
              <p className="text-sm text-gray-500">Badges</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Level {Math.floor(overallProgress / 20) + 1} Progress</span>
            <span className="text-sm font-medium text-indigo-600">{overallProgress % 20 * 5}%</span>
          </div>
          <ProgressBar 
            progress={overallProgress % 20 * 5} 
            size="md"
            showLabel={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Achievements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 ${
                    !achievement.unlocked ? 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50' : ''
                  }`}
                  onClick={() => handleUnlockAchievement(achievement)}
                >
                  <div className={`rounded-xl bg-gradient-to-r ${achievement.color} p-3`}>
                    <achievement.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {achievement.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-indigo-600 font-medium">
                          +{achievement.xp} XP
                        </span>
                        {achievement.unlocked ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    {!achievement.unlocked && achievement.progress && (
                      <div className="mt-2">
                        <ProgressBar 
                          progress={achievement.progress} 
                          size="sm"
                          showLabel={false}
                          color="indigo"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Progress: {achievement.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Mastery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill Mastery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillMasteries.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`rounded-lg bg-gradient-to-r ${skill.color} p-2`}>
                      <skill.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          Level {Math.floor(skill.progress / 20) + 1}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {skill.progress}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar 
                      progress={skill.progress} 
                      size="sm"
                      showLabel={false}
                      color={skill.color.includes('green') ? 'green' : 
                             skill.color.includes('purple') ? 'purple' : 
                             skill.color.includes('amber') ? 'indigo' : 'blue'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Challenges */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Challenges</h3>
            <div className="space-y-4">
              {upcomingChallenges.map((challenge, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50"
                >
                  <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {challenge.deadline}
                      </span>
                      <span className="text-indigo-600 font-medium">{challenge.reward}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {challenge.participants} participants
                    </div>
                  </div>
                  <button 
                    className="w-full mt-3 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                    onClick={() => {
                      // Record activity
                      recordActivity({
                        type: 'community',
                        title: `Joined ${challenge.title}`,
                        xpEarned: parseInt(challenge.reward.split(' ')[0]) / 10 // 10% of reward for joining
                      });
                    }}
                  >
                    Join Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Record activity
                  recordActivity({
                    type: 'community',
                    title: 'Shared Progress',
                    xpEarned: 15
                  });
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-600">Share Progress</span>
              </button>
              <button 
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Record activity
                  recordActivity({
                    type: 'course',
                    title: 'Downloaded Certificate',
                    xpEarned: 25
                  });
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}