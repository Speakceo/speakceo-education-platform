import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react';
import { useUserStore } from '../lib/store';
import { useLanguage } from '../lib/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import EnrollmentPopup from './EnrollmentPopup';
import CareerGuidePopup from './career/CareerGuidePopup';

const menuItems = [
  { title: 'nav.home', href: '/' },
  { title: 'nav.courses', href: '/courses' },
  { title: 'nav.about', href: '/about' },
  { title: 'nav.contact', href: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showCareerGuide, setShowCareerGuide] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useUserStore();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setShowEnrollment(true);
    }
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleEnrollmentClick = () => {
    setShowEnrollment(true);
  };

  return (
    <div className="w-full relative z-40">
      {/* Enhanced Navbar with Glass-morphism Effect */}
      <nav className="fixed w-full z-50 transition-all duration-300">
        {/* Background with enhanced glass effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 via-blue-400/20 to-teal-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Enhanced Logo Section */}
            <div className="flex items-center space-x-3 py-3">
              <button 
                onClick={handleLogoClick}
                className="flex items-center space-x-3 group"
              >
                <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 hover:shadow-indigo-500/25">
                  <GraduationCap className="h-8 w-8 z-10" />
                  <Sparkles className="absolute h-4 w-4 top-1 right-1 text-yellow-300 animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-100 group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
                    SpeakCEO
                  </span>
                  <span className="text-xs text-purple-200 font-medium tracking-wider">
                    Future Leaders
                  </span>
                </div>
              </button>
            </div>

            {/* Enhanced Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <LanguageToggle />
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`relative px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 group ${
                    isActive(item.href) 
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                    : 'text-purple-100 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/20'
                  }`}
                >
                  <span className="relative z-10">{t(item.title)}</span>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"></div>
                  )}
                </Link>
              ))}
              
              {/* Enhanced Career Guide Button */}
              <button
                onClick={() => setShowCareerGuide(true)}
                className="relative px-5 py-2.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                <span className="relative z-10">Career Guide</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              
              {/* Enhanced Auth Buttons */}
              {isInitialized && (
                user ? (
                  <button
                    onClick={handleDashboardClick}
                    className="relative px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 group overflow-hidden"
                  >
                    <span className="relative z-10">
                      {user.role === 'admin' ? 'Admin Panel' : t('nav.dashboard')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLoginClick}
                      className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleEnrollmentClick}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:shadow-lg text-center shadow-xl"
                    >
                      Get Started
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-purple-200 transition-all duration-300 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div 
        className={`md:hidden fixed w-full bg-gradient-to-br from-slate-900/98 via-blue-900/98 to-indigo-900/98 backdrop-blur-xl border-b border-white/10 transition-all duration-300 transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ top: '80px' }}
      >
        <div className="px-4 pt-2 pb-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`block px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                isActive(item.href) 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-purple-100 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t(item.title)}
            </Link>
          ))}
          <button
            onClick={() => {
              setShowCareerGuide(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-5 py-4 rounded-2xl text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg"
          >
            Career Guide
          </button>
          {isInitialized && (
            user ? (
              <button
                onClick={handleDashboardClick}
                className="w-full mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:shadow-lg text-center shadow-xl"
              >
                {user.role === 'admin' ? 'Admin Panel' : t('nav.dashboard')}
              </button>
            ) : (
              <div className="space-y-3 mt-4">
                <button
                  onClick={handleLoginClick}
                  className="w-full px-5 py-4 rounded-2xl text-base font-semibold bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  Login
                </button>
                <button
                  onClick={handleEnrollmentClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:shadow-lg text-center shadow-xl"
                >
                  Get Started
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
      {showCareerGuide && <CareerGuidePopup isOpen={showCareerGuide} onClose={() => setShowCareerGuide(false)} />}
    </div>
  );
}