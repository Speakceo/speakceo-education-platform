import React from 'react';
import { BookOpen, Users, Trophy, TrendingUp, Brain, Sparkles, Target, DollarSign, Mic } from 'lucide-react';

const features = [
  {
    name: 'Interactive Learning',
    description: 'Engage with real-world business simulations and practical exercises',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Expert Mentorship',
    description: 'Learn from successful entrepreneurs and industry leaders',
    icon: Users,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Business Projects',
    description: 'Build your own business projects with guidance from mentors',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your learning journey with AI-powered analytics',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
];

export default function Features() {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-50 to-transparent"></div>
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-purple-50 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center mb-20">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Why Choose SpeakCEO
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            A better way to learn
            <span className="gradient-text"> business</span>
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our comprehensive program is designed to nurture young entrepreneurs
            through practical learning and real-world experience.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="relative p-8 rounded-3xl bg-white shadow-lg card-hover animate-wiggle"
              >
                <div className={`absolute flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white transform -translate-y-12`}>
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <p className="text-xl font-semibold text-gray-900 mt-4">
                    {feature.name}
                  </p>
                  <p className="mt-4 text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Skills Your Child Will Develop
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Critical Thinking</h4>
              <p className="text-sm text-gray-500">Analyze problems and find creative solutions</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Mic className="h-7 w-7 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Public Speaking</h4>
              <p className="text-sm text-gray-500">Communicate ideas with confidence and clarity</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Financial Literacy</h4>
              <p className="text-sm text-gray-500">Understand money management and investment</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Goal Setting</h4>
              <p className="text-sm text-gray-500">Plan, execute, and achieve meaningful objectives</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Creativity</h4>
              <p className="text-sm text-gray-500">Think outside the box and innovate</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Teamwork</h4>
              <p className="text-sm text-gray-500">Collaborate effectively with others</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Resilience</h4>
              <p className="text-sm text-gray-500">Overcome challenges and learn from failures</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mx-auto h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-teal-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Leadership</h4>
              <p className="text-sm text-gray-500">Inspire and guide others effectively</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}