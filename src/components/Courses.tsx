import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Star, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Users, 
  Calendar, 
  ArrowRight,
  Brain,
  Mic,
  DollarSign,
  TrendingUp,
  Rocket,
  Clock,
  Trophy,
  Globe2,
  Heart,
  Zap,
  Shield,
  PlayCircle,
  MessageCircle,
  Video,
  Lightbulb,
  Building2,
  Camera
} from 'lucide-react';
import { useLanguage } from '../lib/contexts/LanguageContext';
import { useUserStore } from '../lib/store';
import EnrollmentPopup from './EnrollmentPopup';
import { motion } from 'framer-motion';

const parentTestimonials = [
  {
    name: "Sarah Chen",
    role: "Mother of Emma (12)",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332800b?w=150&h=150&fit=crop&crop=face",
    quote: "Emma went from being shy to pitching her business idea to our neighbors! The confidence transformation is incredible.",
    outcome: "Started a pet-sitting business, earning $500/month"
  },
  {
    name: "Michael Rodriguez",
    role: "Father of Diego (14)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Diego now thinks like an entrepreneur. He sees opportunities everywhere and has developed incredible leadership skills.",
    outcome: "Led school fundraising, raised $2,000 for charity"
  },
  {
    name: "Jennifer Park",
    role: "Mother of Alex (13)",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "Best investment we ever made. Alex is now mentoring other kids and speaking at school events with confidence!",
    outcome: "Became student council president, launched school app"
  }
];

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

const successStories = [
  {
    name: "Maya, 12",
    story: "Created an eco-friendly product line",
    achievement: "Sold 500+ items, donated 20% to ocean cleanup",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
    badge: "Social Impact Award"
  },
  {
    name: "Jake, 14",
    story: "Developed a mobile app for students",
    achievement: "1,000+ downloads, featured in school newsletter",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
    badge: "Tech Innovation Award"
  },
  {
    name: "Zoe, 13",
    story: "Started a tutoring marketplace",
    achievement: "Connected 50+ tutors with students",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop",
    badge: "Education Leader Award"
  }
];

const learningPath = [
  {
    weeks: '1-2',
    title: 'Confidence & Communication',
    description: 'Transform from shy to confident speaker',
    icon: Mic,
    color: 'from-blue-500 to-indigo-500',
    parentBenefit: 'Watch your child speak up at family dinners',
    modules: [
      { title: 'Overcoming Speaking Anxiety', icon: Heart, duration: '2h', outcome: 'Confident presentations' },
      { title: 'Storytelling Mastery', icon: BookOpen, duration: '1.5h', outcome: 'Captivating narratives' },
      { title: 'Body Language & Presence', icon: Users, duration: '2h', outcome: 'Leadership presence' },
      { title: 'Persuasion & Influence', icon: Target, duration: '1.5h', outcome: 'Convincing arguments' }
    ]
  },
  {
    weeks: '3-4',
    title: 'Creative Thinking & Innovation',
    description: 'Unlock unlimited creativity and problem-solving',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500',
    parentBenefit: 'See them solve problems you never thought of',
    modules: [
      { title: 'Design Thinking Process', icon: Brain, duration: '2h', outcome: 'Creative solutions' },
      { title: 'Innovation Techniques', icon: Sparkles, duration: '1.5h', outcome: 'Original ideas' },
      { title: 'Brand Identity Creation', icon: Star, duration: '2h', outcome: 'Professional branding' },
      { title: 'Marketing Your Ideas', icon: Globe2, duration: '2h', outcome: 'Effective promotion' }
    ]
  },
  {
    weeks: '5-6',
    title: 'Financial Intelligence',
    description: 'Master money, budgeting, and investment basics',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    parentBenefit: 'No more fighting about allowance or spending',
    modules: [
      { title: 'Money Psychology', icon: Brain, duration: '1.5h', outcome: 'Healthy money mindset' },
      { title: 'Smart Budgeting', icon: Target, duration: '2h', outcome: 'Personal finance skills' },
      { title: 'Investment Basics', icon: TrendingUp, duration: '2h', outcome: 'Future wealth building' },
      { title: 'Business Finance', icon: Building2, duration: '1.5h', outcome: 'Profit understanding' }
    ]
  },
  {
    weeks: '7-8',
    title: 'Digital Leadership',
    description: 'Become a responsible digital native and leader',
    icon: Globe2,
    color: 'from-amber-500 to-orange-500',
    parentBenefit: 'Productive screen time, not passive consumption',
    modules: [
      { title: 'Digital Citizenship', icon: Shield, duration: '2h', outcome: 'Online responsibility' },
      { title: 'Content Creation', icon: Camera, duration: '1.5h', outcome: 'Professional content' },
      { title: 'Online Community Building', icon: Users, duration: '2h', outcome: 'Leadership skills' },
      { title: 'Tech for Good', icon: Heart, duration: '1.5h', outcome: 'Positive impact' }
    ]
  },
  {
    weeks: '9-10',
    title: 'Leadership & Team Building',
    description: 'Inspire others and lead with purpose',
    icon: Users,
    color: 'from-red-500 to-pink-500',
    parentBenefit: 'Natural leader at school and home',
    modules: [
      { title: 'Leadership Styles', icon: Star, duration: '2h', outcome: 'Personal leadership' },
      { title: 'Team Dynamics', icon: Users, duration: '1.5h', outcome: 'Collaboration skills' },
      { title: 'Conflict Resolution', icon: Heart, duration: '2h', outcome: 'Problem solving' },
      { title: 'Inspiring Others', icon: Trophy, duration: '1.5h', outcome: 'Motivational skills' }
    ]
  },
  {
    weeks: '11-12',
    title: 'Real Business Launch',
    description: 'Launch your first real business or social impact project',
    icon: Rocket,
    color: 'from-purple-600 to-indigo-600',
    parentBenefit: 'Actual business results you can see',
    modules: [
      { title: 'Business Plan Mastery', icon: Target, duration: '2h', outcome: 'Complete business plan' },
      { title: 'Pitch Deck Creation', icon: Mic, duration: '2h', outcome: 'Investor-ready pitch' },
      { title: 'Launch Strategy', icon: Rocket, duration: '2h', outcome: 'Successful launch' },
      { title: 'Growth & Scale', icon: TrendingUp, duration: '2h', outcome: 'Measurable results' }
    ]
  }
];

const features = [
  {
    icon: Brain,
    title: 'Virtual Business Simulation',
    description: 'Practice running a business in our safe, virtual environment'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Learn from successful entrepreneurs and business leaders'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Tools',
    description: 'Use AI to generate business ideas and create pitch decks'
  },
  {
    icon: Target,
    title: 'Real Projects',
    description: 'Work on actual business projects with guidance'
  }
];

export default function Courses() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-24">
      {/* Hero Section - Parent-focused */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full px-6 py-2 mb-6">
            <span className="text-emerald-700 font-semibold">Trusted by 2,500+ Parents Worldwide</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Watch Your Child Transform Into a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600">
              Confident Young Leader
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            In just 90 days, see your child develop the <strong>confidence, communication skills, and entrepreneurial mindset</strong> that will set them apart for life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => setShowEnrollment(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white font-bold rounded-2xl text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Your Child's Transformation
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Only 30 spots left this month</span>
            </div>
          </div>

          {/* Transformation Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {transformationOutcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${outcome.color} flex items-center justify-center mb-4 mx-auto`}>
                  <outcome.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">{outcome.before}</p>
                  <div className="flex justify-center mb-2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{outcome.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Parent Testimonials - Social Proof */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Parents Are Saying
            </h2>
            <p className="text-xl text-gray-600">Real transformations from real families</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {parentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    🎯 Result: {testimonial.outcome}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600">See what your child could achieve</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => setHoveredStory(index)}
                onMouseLeave={() => setHoveredStory(null)}
              >
                <div className="relative">
                  <img 
                    src={story.image} 
                    alt={story.story}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-semibold">{story.badge}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                  <p className="text-gray-600 mb-4">{story.story}</p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-purple-700">
                      ✨ Achievement: {story.achievement}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Interactive Learning Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-400/15 via-blue-400/15 to-purple-400/15 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
        
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
                <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    Start Learning Journey
                    <Rocket className="ml-3 h-5 w-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
                <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:scale-105">
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

      {/* Learning Path with Parent Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              12-Week Transformation Journey
            </h2>
            <p className="text-xl text-gray-600">
              Each week builds confidence and skills your child will use for life
            </p>
          </div>

          <div className="space-y-8">
            {learningPath.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  selectedModule === path.title ? 'ring-2 ring-purple-500 transform scale-[1.02]' : ''
                }`}
                onClick={() => setSelectedModule(selectedModule === path.title ? null : path.title)}
              >
                <div className="flex items-start space-x-6">
                  {/* Enhanced Week Badge */}
                  <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-r ${path.color} text-white flex flex-col items-center justify-center shadow-lg`}>
                    <span className="text-sm font-medium">WEEK</span>
                    <span className="text-xl font-bold">{path.weeks}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{path.title}</h3>
                        <p className="text-gray-600 mb-2">{path.description}</p>
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl px-4 py-2 inline-block">
                          <p className="text-sm font-semibold text-emerald-700">
                            👨‍👩‍👧‍👦 Parent Benefit: {path.parentBenefit}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-6 w-6 text-purple-500 transform transition-transform ${
                          selectedModule === path.title ? 'rotate-90' : ''
                        }`}
                      />
                    </div>

                    {/* Enhanced Modules */}
                    {selectedModule === path.title && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                      >
                        {path.modules.map((module, moduleIndex) => (
                          <div
                            key={moduleIndex}
                            className="relative p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex items-center space-x-4 mb-3">
                              <div className={`rounded-lg bg-gradient-to-r ${path.color} p-3`}>
                                <module.icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>{module.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-purple-700">
                                🎯 Outcome: {module.outcome}
                              </p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Don't Let Your Child Fall Behind
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              While other kids are just playing games, your child could be building 
              <strong> confidence, leadership skills, and an entrepreneurial mindset</strong> that lasts a lifetime.
            </p>
            
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
                  <div className="text-3xl font-bold text-yellow-300">98%</div>
                  <div className="text-sm opacity-80">Parent Satisfaction</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEnrollment(true)}
              className="group relative px-10 py-6 bg-white text-purple-600 font-bold rounded-2xl text-xl hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Secure Your Child's Spot Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
            
            <p className="mt-4 text-sm opacity-80">
              ⚡ Early bird pricing ends in 7 days • 💰 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
    </div>
  );
}