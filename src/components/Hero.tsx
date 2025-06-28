import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Play, Sparkles, ChevronRight, TrendingUp, PiggyBank, Target, Users, MessageSquare, Video, ArrowRight, Download, X, GraduationCap, Mic, DollarSign, Brain, Star, Lightbulb, Pause } from 'lucide-react';
import { useLanguage } from '../lib/contexts/LanguageContext';
import { useUserStore } from '../lib/store';
import EnrollmentPopup from './EnrollmentPopup';
import CareerGuidePopup from './career/CareerGuidePopup';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  { icon: PiggyBank, text: "Money Management" },
  { icon: Target, text: "Mini Business" },
  { icon: TrendingUp, text: "Track Growth" },
];

const rotatingWords = ['Business', 'Life', 'Journey', 'Leadership'];

const testimonials = [
  {
    name: "Sarah Chen, 14",
    text: "Started my first online business in just 8 weeks!",
    image: "/testimonials/sarah.jpg"
  },
  {
    name: "Alex Thompson, 15",
    text: "Learned how to pitch my ideas with confidence",
    image: "/testimonials/alex.jpg"
  },
  {
    name: "Maya Patel, 13",
    text: "Built my own eco-friendly product line",
    image: "/testimonials/maya.jpg"
  }
];

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showCareerGuide, setShowCareerGuide] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useUserStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 500);
    }, 2000);

    let testimonialInterval: NodeJS.Timeout;
    if (isPlaying) {
      testimonialInterval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, [isPlaying]);

  const handleExploreClasses = () => {
    if (user) {
      navigate('/dashboard/live-classes');
    } else {
      setShowEnrollment(true);
    }
    setIsOpen(false);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-medium">Live Classes Available Now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform Your Child Into a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Future Business Leader
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Our 90-day program combines hands-on projects, mentorship, and cutting-edge tools to nurture the next generation of entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={() => window.location.href = '/enroll'}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 inline-block transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.location.href = '/demo'}
                className="group px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 transform hover:scale-105"
              >
                Watch Demo
                <Play className="ml-2 h-5 w-5 inline-block" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-emerald-400">2,500+</div>
                <div className="text-sm text-white/70">Students Enrolled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">92%</div>
                <div className="text-sm text-white/70">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">150+</div>
                <div className="text-sm text-white/70">Business Launched</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-medium mb-2">{testimonials[currentTestimonial].text}</p>
                    <p className="text-white/70">{testimonials[currentTestimonial].name}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
      {showCareerGuide && <CareerGuidePopup isOpen={showCareerGuide} onClose={() => setShowCareerGuide(false)} />}
    </section>
  );
}