import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Presentation,
  TrendingUp, 
  PiggyBank, 
  Users, 
  Zap,
  Lightbulb,
  Rocket,
  Mic, 
  DollarSign, 
  CheckCircle,
  Star,
  Target,
  Video,
  Calendar,
  MessageCircle,
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react';
import { useUserStore } from '../lib/store';
import EnrollmentPopup from '../components/EnrollmentPopup';
import CareerGuidePopup from '../components/career/CareerGuidePopup';
import SEO from '../components/SEO';

export default function Home() {
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showCareerGuide, setShowCareerGuide] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <>
      <SEO
        title="SpeakCEO - Future Leaders Start Here"
        description="Transform your child into a confident leader. SpeakCEO teaches entrepreneurship, communication, and leadership skills to young minds through our innovative 90-day curriculum."
        keywords={[
          'entrepreneurship education',
          'youth leadership',
          'public speaking for kids',
          'entrepreneurial mindset',
          'future skills',
          'confidence building',
          'youth business education',
          'leadership training',
          'communication skills',
          'AI awareness'
        ]}
      />
      
      <div className="min-h-screen bg-white font-[Poppins] overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/15 via-blue-400/15 to-teal-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-400/15 via-indigo-400/15 to-purple-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left z-10 relative">
                <div className="inline-block mb-6 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                  <span className="text-emerald-300 font-semibold text-lg">✨ Join 2,500+ Young Entrepreneurs</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  Where Young Minds
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400">
                    Become Future Leaders
                  </span>
                </h1>
                
                <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
                  Transform your child's potential into reality with our immersive 90-day journey. From idea to launch, we guide young entrepreneurs through every step of building their first business.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowEnrollment(true)}
                    className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Journey
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </span>
                  </button>
                  <button
                    onClick={() => setShowCareerGuide(true)}
                    className="px-10 py-5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105"
                  >
                    Download Guide
                  </button>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-emerald-300">2,500+</div>
                    <div className="text-sm text-white/80">Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-blue-300">90</div>
                    <div className="text-sm text-white/80">Day Program</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-2xl font-bold text-indigo-300">98%</div>
                    <div className="text-sm text-white/80">Success Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="relative">
                  <img 
                    src="https://i.postimg.cc/vmXKM1Y9/Chat-GPT-Image-May-19-2025-10-58-12-PM.png" 
                    alt="Young entrepreneurs collaborating" 
                    className="rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/20 backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/20 via-blue-600/20 to-purple-600/20"></div>
                  
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Lightbulb className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pop Challenges Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-bl from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full px-6 py-3 mb-6">
                <span className="text-emerald-700 font-semibold text-lg">⚡ Try Before You Buy</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Spark new ideas in just 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
                  5 minutes!
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2">
                  with <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-2xl">Pop Challenges</span>
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Level up your business knowledge with bite-sized challenges. Perfect for when 
                you're short on time but big on curiosity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Challenge 1 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100 to-blue-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-emerald-600 font-semibold">5 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          50 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    Spot the Million Dollar Idea
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Look around your daily life and identify 3 problems that could become profitable businesses. Learn to see opportunities everywhere!
                  </p>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-100 to-pink-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-purple-600 font-semibold">7 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          75 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    Price It Right
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Master pricing psychology with real examples. Learn why $9.99 feels cheaper than $10 and how to price your products strategically.
                  </p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-indigo-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 font-semibold">6 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          60 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Brand or Bland?
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Test your brand recognition skills! Learn what makes some brand names unforgettable while others fade into obscurity.
                  </p>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Challenge 4 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-100 to-red-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-orange-600 font-semibold">8 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          80 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    Customer or Competitor?
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sharpen your market analysis skills by identifying target customers for different businesses. Learn who buys what and why.
                  </p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Challenge 5 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-100 to-green-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-teal-600 font-semibold">10 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          100 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    Profit or Loss?
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Quick math challenges with real business scenarios. Learn to calculate profit margins, break-even points, and make smart financial decisions.
                  </p>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Challenge 6 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-100 to-purple-100 rounded-full opacity-50 transform translate-x-6 -translate-y-6"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-indigo-600 font-semibold">5 mins</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          50 XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    Pitch Perfect
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Practice your elevator pitch skills! Learn to explain your business idea clearly and confidently in just 30 seconds.
                  </p>
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Start Challenge
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform -translate-x-6 -translate-y-6"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl transform translate-x-8 translate-y-8"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Ready for the Full Adventure?
                  </h3>
                  <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                    These challenges are just the beginning! Join our complete 90-day program 
                    and transform your child into a confident young entrepreneur.
                  </p>
                  <button
                    onClick={() => setShowEnrollment(true)}
                    className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-indigo-100">Young Entrepreneurs</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-indigo-100">Parent Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">90</div>
                <div className="text-indigo-100">Day Program</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-indigo-100">AI Support</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showEnrollment && <EnrollmentPopup onClose={() => setShowEnrollment(false)} />}
      {showCareerGuide && <CareerGuidePopup onClose={() => setShowCareerGuide(false)} />}
    </>
  );
}
