import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

// FORCE DEPLOYMENT: Current local state - "Where Young Minds Become Future Leaders" design - Dec 19, 2024
import { useLanguage } from '../lib/contexts/LanguageContext';
import { useUserStore } from '../lib/store';
import EnrollmentPopup from '../components/EnrollmentPopup';
import CareerGuidePopup from '../components/career/CareerGuidePopup';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

// Force deployment - Current local state with "Where Young Minds Become Future Leaders" design
// This should match the local server exactly - Dec 19, 2024

// Minimal animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const transformationOutcomes = [
  {
    before: "Lacks confidence in speaking",
    after: "Confident public speaker",
    icon: Mic,
    color: "from-blue-500 to-indigo-600"
  },
  {
    before: "No clear direction or goals",
    after: "Clear vision & purpose",
    icon: Target,
    color: "from-purple-500 to-pink-600"
  },
  {
    before: "Poor financial awareness",
    after: "Financially responsible",
    icon: DollarSign,
    color: "from-green-500 to-emerald-600"
  },
  {
    before: "Passive screen consumption",
    after: "Creative problem solver",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-600"
  }
];

export default function Home() {
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showCareerGuide, setShowCareerGuide] = useState(false);
  const { t } = useLanguage();
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
      
      <div className="min-h-screen bg-white font-[Poppins] overflow-x-hidden pt-20">
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen flex items-center">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/15 via-blue-400/15 to-teal-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-bl from-blue-400/15 via-indigo-400/15 to-purple-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-teal-400/10 via-blue-400/10 to-indigo-400/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Enhanced Hero Content */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center lg:text-left z-10 relative"
              >
                <motion.div
                  variants={fadeIn}
                  className="inline-block mb-6 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"
                >
                  <span className="text-emerald-300 font-semibold text-lg">✨ Join 2,500+ Young Entrepreneurs</span>
                </motion.div>
                
                <motion.h1 
                  variants={fadeIn}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                >
                  Where Young Minds
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400">
                    Become Future Leaders
                  </span>
                </motion.h1>
                
                <motion.p 
                  variants={fadeIn}
                  className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed"
                >
                  Transform your child's potential into reality with our immersive 90-day journey. From idea to launch, we guide young entrepreneurs through every step of building their first business.
                </motion.p>
                
                <motion.div 
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                >
                  <button
                    onClick={() => setShowEnrollment(true)}
                    className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Journey
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                  <button
                    onClick={() => setShowCareerGuide(true)}
                    className="px-10 py-5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105"
                  >
                    Download Guide
                  </button>
                </motion.div>

                {/* Enhanced stats section */}
                <motion.div 
                  variants={fadeIn}
                  className="mt-16 grid grid-cols-3 gap-8 text-center"
                >
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
                </motion.div>
              </motion.div>
              
              {/* Enhanced Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="relative">
                  <img 
                    src="https://i.postimg.cc/vmXKM1Y9/Chat-GPT-Image-May-19-2025-10-58-12-PM.png" 
                    alt="Young entrepreneurs collaborating" 
                    className="rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/20 backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/20 via-blue-600/20 to-purple-600/20"></div>
                  
                  {/* Professional floating elements */}
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Parent Testimonials & Social Proof */}
        <section className="py-20 bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full px-6 py-2 mb-6">
                <span className="text-emerald-700 font-semibold">Real Parent Stories</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                "My Child is a Different Person"
              </h2>
              <p className="text-xl text-gray-600">See the transformations that make parents proud</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah Chen"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.currentTarget.src = 'https://ui-avatars.com/api/?name=Sarah+Chen&background=e5e7eb&color=374151&size=64';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                    <p className="text-gray-600 text-sm">Mother of Emma (12)</p>
                    <div className="flex text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Emma went from being too shy to order food to confidently pitching business ideas to our neighbors! The transformation is incredible."
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    🎯 Result: Started a pet-sitting business, earning $500/month
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                    alt="Michael Rodriguez"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Rodriguez</h4>
                    <p className="text-gray-600 text-sm">Father of Diego (14)</p>
                    <div className="flex text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Diego now thinks like an entrepreneur. He sees opportunities everywhere and has developed incredible leadership skills."
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-purple-700">
                    🎯 Result: Led school fundraising, raised $2,000 for charity
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                    alt="Jennifer Park"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Jennifer Park</h4>
                    <p className="text-gray-600 text-sm">Mother of Alex (13)</p>
                    <div className="flex text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Best investment we ever made. Alex is now mentoring other kids and speaking at school events with confidence!"
                </p>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-700">
                    🎯 Result: Became student council president, launched school app
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">2,500+</div>
                  <div className="text-gray-600">Happy Families</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600">Parent Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">35+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">Forbes</div>
                  <div className="text-gray-600">Featured</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider 1 - Hero to Features */}
        <div className="relative w-full overflow-hidden">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#f9fafb"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#f9fafb"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f9fafb"></path>
          </svg>
        </div>

        {/* Live Interactive Learning Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/15 via-blue-400/15 to-teal-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/15 via-indigo-400/15 to-purple-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-teal-400/10 via-blue-400/10 to-indigo-400/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-emerald-300 font-semibold">Complete Learning Ecosystem</span>
                </div>
                
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    AI-Powered Learning
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-pink-400">
                      Meets Real Mentorship
                    </span>
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Experience the perfect blend of cutting-edge AI tools, on-demand recorded sessions, 
                    interactive business simulators, and live mentorship from industry experts—all designed 
                    to give your child every advantage in their entrepreneurial journey.
                  </p>
                </div>
                
                {/* Learning Methods Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">AI-Powered Tools</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      24/7 AI business coach, pitch deck generator, and smart analytics for instant feedback and guidance.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Live Expert Classes</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Interactive sessions with successful entrepreneurs, real-time Q&A, and collaborative learning.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Business Simulators</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Risk-free virtual environments to practice running businesses, making decisions, and learning from outcomes.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Recorded Sessions</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Access hundreds of expert-led lessons anytime, with progress tracking and personalized recommendations.
                    </p>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowEnrollment(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Learning Journey
                      <Rocket className="ml-3 h-5 w-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                  <button 
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105"
                  >
                    Download Free Guide
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-300">100+</div>
                    <div className="text-sm text-white/80">AI-Powered Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">50+</div>
                    <div className="text-sm text-white/80">Live Sessions Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-300">500+</div>
                    <div className="text-sm text-white/80">Recorded Lessons</div>
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative">
                <div className="relative">
                  <img 
                    src="https://i.postimg.cc/tR1StD70/Chat-GPT-Image-Jun-19-2025-10-21-56-PM.png" 
                    alt="Students collaborating in comprehensive learning environment with AI tools and live mentorship" 
                    className="rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/20 backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/10 via-blue-600/10 to-purple-600/10"></div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl animate-bounce flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-xl animate-pulse flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div className="absolute top-1/2 -right-6 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-xl animate-ping flex items-center justify-center">
                    <span className="text-sm">🚀</span>
                  </div>
                  <div className="absolute top-1/4 -left-6 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-xl animate-bounce flex items-center justify-center" style={{animationDelay: '1s'}}>
                    <span className="text-lg">💡</span>
                  </div>
                </div>
                
                {/* Live indicator */}
                <div className="absolute top-6 left-6 flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-sm">LIVE NOW</span>
                </div>

                {/* Feature badges */}
                <div className="absolute bottom-6 right-6 space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                    AI-Powered
                  </div>
                  <div className="bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                    Expert-Led
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider 3 - Live Classes to Roadmap */}
        <div className="relative w-full overflow-hidden">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f9fafb"></path>
          </svg>
        </div>

        {/* Roadmap Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-indigo-100">
                <span className="text-indigo-600 font-medium">Step-by-Step Journey</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Your Child's 90-Day Entrepreneurial Adventure
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Step-by-step guidance, from that first spark of an idea to launching a real business.
              </p>
            </div>
            
            <div className="mb-16 text-center">
              <img 
                src="https://i.postimg.cc/kM6k6zpT/Chat-GPT-Image-Jun-6-2025-06-28-18-PM.png" 
                alt="Complete 90-day entrepreneurial journey roadmap" 
                className="rounded-2xl shadow-xl max-w-3xl mx-auto w-full h-auto"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Phase 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find your passion, spot opportunities, and dream big.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Problem Identification
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Market Research
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Idea Validation
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Idea to MVP</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Transform your ideas into tangible products or services.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Product Development
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Customer Feedback
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Prototype Testing
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Presentation className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Branding & Storytelling</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Create a unique brand identity and compelling story.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Visual Identity
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Brand Messaging
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Pitch Development
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Speaking & Presence</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Become a confident communicator and presenter.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Speech Techniques
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Presentation Skills
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Confidence Building
                  </div>
                </div>
              </div>

              {/* Phase 5 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finance & Pitching</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Master money skills and pitch to potential investors.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Financial Planning
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Investor Decks
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Demo Day Preparation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider 3 - Roadmap to Why Choose Us */}
        <div className="relative w-full overflow-hidden bg-white">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#0f172a"></path>
          </svg>
        </div>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Parents & Kids Love SpeakCEO
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                More than business. We're building confidence, creativity, and a lifelong love of learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Presentation className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-World Confidence</h3>
                <p className="text-white/80">
                  From TED-style talks to investor pitches, kids learn to lead and inspire with confidence.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Entrepreneurial Mindset</h3>
                <p className="text-white/80">
                  Solve real problems, build real products, and pitch to real investors with guidance.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Future-Ready Skills</h3>
                <p className="text-white/80">
                  Master AI, money, and marketing—skills for life, not just for school success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider 4 - Why Choose Us to Success Stories */}
        <div className="relative w-full overflow-hidden">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#f9fafb"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#f9fafb"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f9fafb"></path>
          </svg>
        </div>

        {/* Success Stories Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-emerald-100">
                <span className="text-emerald-600 font-medium">Success Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Parents & Kids Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of families who've watched their children transform into confident young entrepreneurs.
              </p>
            </div>

            {/* Success Stories Image */}
            <div className="mb-16 text-center">
              <img 
                src="https://i.postimg.cc/6pwSP35P/Chat-GPT-Image-Jun-6-2025-06-18-44-PM.png" 
                alt="Young entrepreneurs celebrating their success stories" 
                className="rounded-2xl shadow-xl max-w-2xl mx-auto w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face&v=2"
                    alt="Amanda K."
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Amanda K.</div>
                    <div className="text-sm text-gray-500">Mom of 12-year-old Emma</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "My daughter used to be so shy, but after starting her sticker business through SpeakCEO, she's presenting to her entire school! The transformation has been incredible."
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=80&h=80&fit=crop&crop=face"
                    alt="Tyler J."
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Tyler J.</div>
                    <div className="text-sm text-gray-500">10-year-old Entrepreneur</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I never thought I could start my own business at 10, but now I sell my handmade bracelets online! The AI coach helped me figure out pricing and even make a logo."
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Michael T."
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Michael T.</div>
                    <div className="text-sm text-gray-500">Dad of 14-year-old Jayden</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The gamified lessons kept my son engaged while teaching him real business skills. He's learning concepts I didn't understand until college! Worth every penny."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider 5 - Success Stories to Stats */}
        <div className="relative w-full overflow-hidden">
          <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#4f46e5"></path>
          </svg>
        </div>

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

        {/* Enhanced CTA Section with Urgency */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-gradient-to-r from-red-100 to-orange-100 rounded-full px-6 py-2 mb-6">
                <span className="text-red-700 font-semibold">⚡ Limited Time - Only 30 Spots Left</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                Don't Let Your Child Fall Behind While Others Get Ahead
              </h2>
              
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                While other kids are just consuming content, your child could be building 
                <strong> confidence, leadership skills, and an entrepreneurial mindset</strong> that lasts a lifetime.
              </p>

              {/* Urgency indicators */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-yellow-300">30</div>
                    <div className="text-sm opacity-80">Spots Remaining</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-300">7</div>
                    <div className="text-sm opacity-80">Days Left</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-300">$200</div>
                    <div className="text-sm opacity-80">Early Bird Savings</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => setShowEnrollment(true)}
                  className="group relative px-10 py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold rounded-2xl text-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Secure Your Child's Spot Now
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
                
                <button 
                  className="px-8 py-6 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105"
                >
                  Download Free Guide
                </button>
              </div>

              {/* Guarantee & Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm opacity-80">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-300" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-300" />
                  <span>2,500+ happy families</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-300" />
                  <span>Forbes featured program</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
        {showCareerGuide && <CareerGuidePopup isOpen={showCareerGuide} onClose={() => setShowCareerGuide(false)} />}
      </div>
    </>
  );
}