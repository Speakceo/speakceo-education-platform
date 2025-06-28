import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../lib/contexts/LanguageContext';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Award, 
  BookOpen, 
  Heart,
  Shield,
  Star,
  Trophy,
  Zap,
  Globe2,
  CheckCircle,
  Quote,
  ArrowRight,
  Play,
  MapPin,
  Calendar,
  Mic,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import EnrollmentPopup from '../components/EnrollmentPopup';

const About = () => {
  const { t } = useLanguage();
  const [showEnrollment, setShowEnrollment] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { label: 'Happy Families', value: '2,500+', icon: Heart, color: 'text-red-500' },
    { label: 'Success Rate', value: '98%', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Countries Reached', value: '35+', icon: Globe2, color: 'text-blue-500' },
    { label: 'Expert Mentors', value: '50+', icon: Users, color: 'text-purple-500' }
  ];

  const achievements = [
    {
      title: 'Featured in Forbes',
      description: '"Revolutionary approach to youth entrepreneurship education"',
      date: '2024'
    },
    {
      title: 'EdTech Innovation Award',
      description: 'Best Youth Development Platform',
      date: '2023'
    },
    {
      title: 'Parent Choice Gold',
      description: 'Highest rated program for character development',
      date: '2023'
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      background: "Former Harvard Professor, 15+ years in youth development",
      story: "Started SpeakCEO after watching her own shy daughter transform into a confident leader through entrepreneurship."
    },
    {
      name: "Marcus Johnson",
      role: "Head of Curriculum",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      background: "Serial entrepreneur, sold 3 companies by age 30",
      story: "Believes every child has entrepreneurial potential waiting to be unlocked."
    },
    {
      name: "Elena Rodriguez",
      role: "Child Psychology Expert",
      image: "https://images.unsplash.com/photo-1594824506039-d1c139de2ec8?w=300&h=300&fit=crop&crop=face",
      background: "PhD in Child Development, 20+ years experience",
      story: "Ensures our methods are age-appropriate and psychologically sound."
    }
  ];

  const parentWorries = [
    {
      worry: "Will my child be too young?",
      answer: "Our curriculum is designed specifically for ages 8-16, with age-appropriate modules that grow with your child.",
      icon: Users
    },
    {
      worry: "Is this just another screen time activity?",
      answer: "No! We focus on real-world application, hands-on projects, and building genuine confidence and skills.",
      icon: Zap
    },
    {
      worry: "What if my child is shy or introverted?",
      answer: "Perfect! Many of our most successful students started as shy kids. We specialize in building confidence gradually.",
      icon: Heart
    },
    {
      worry: "Is it worth the investment?",
      answer: "Parents see results within the first 2 weeks. Plus, we offer a 30-day money-back guarantee.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-mint-50 pt-16">
      {/* Hero Section - Founder Story */}
      <motion.section 
        className="pt-32 pb-16 px-4 sm:px-6 lg:px-8"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-2 mb-6">
                <span className="text-purple-700 font-semibold">The Story Behind SpeakCEO</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                From One Child's Question to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  A Global Movement
                </span>
              </h1>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
                <Quote className="h-8 w-8 text-purple-500 mb-4" />
                <div className="space-y-4 text-lg text-gray-700">
                  <p className="italic font-medium">
                    Once upon a time, a curious 12-year-old named Aarav had a bold question:
                  </p>
                  <p className="text-xl font-semibold text-purple-600">
                    "Why don't we learn how to speak like leaders or build real businesses in school?"
                  </p>
                  <p>
                    He loved giving ideas, helping his friends sell handmade cards, and even hosted pretend investor meetings with his cousins. But every time he spoke up in class, he felt nervous. And while he was full of ideas, no one was teaching him how to pitch them like a pro.
                  </p>
                  <p className="font-semibold">
                    That spark lit the idea behind SpeakCEO — a platform built just for kids like Aarav.
                  </p>
                  <p>
                    <strong>We believe every child is already a leader.</strong> All they need is the right space to speak up, explore, and lead boldly.
                  </p>
                </div>
              </div>

              {/* What We Created */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">So we created SpeakCEO — a place where:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Mic className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Kids practice public speaking through games, stories, and challenges</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">They think like entrepreneurs and build real mini-businesses</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sparkles className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">They explore how AI and branding shape the future</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">They learn with real teachers, friendly mentors, and awesome tools</p>
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">SpeakCEO isn't just a class. It's an adventure in confidence.</h3>
                <p className="text-gray-700 mb-4">
                  From Delhi to Dubai, from small towns to big cities, our young CEOs are launching bake sales, eco-campaigns, sticker startups, and even podcasts.
                </p>
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                  <h4 className="text-lg font-bold mb-3">Our mission is simple:</h4>
                  <p className="text-lg">
                    <strong>Raise the next generation of speakers, thinkers, and doers — one confident child at a time.</strong>
                  </p>
                  <p className="mt-4 text-purple-100">
                    So if your child has a voice, a dream, or just a spark — SpeakCEO is where it begins.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Children learning together"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Parent Satisfaction</div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center">
                  <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-sm font-semibold">Forbes Featured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Families Worldwide</h2>
            <p className="text-xl text-gray-600">Real results that speak for themselves</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
              >
                <Award className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 mb-3">{achievement.description}</p>
                <span className="text-sm text-purple-600 font-semibold">{achievement.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Addressing Parent Concerns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">We Understand Your Concerns</h2>
            <p className="text-xl text-gray-600">Here's how we address what parents worry about most</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {parentWorries.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-xl p-3 flex-shrink-0">
                    <item.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">"{item.worry}"</h3>
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Child's Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join 2,500+ families who've already seen the confidence transformation. 
              Your child's journey to leadership starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => setShowEnrollment(true)}
                className="group relative px-10 py-6 bg-white text-purple-600 font-bold rounded-2xl text-xl hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Your Child's Transformation
                  <ArrowRight className="ml-3 h-6 w-6" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>2,500+ happy families</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                <span>Forbes featured</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
    </div>
  );
};

export default About; 