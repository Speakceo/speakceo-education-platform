import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import EnrollmentPopup from '../EnrollmentPopup';
import CareerGuidePopup from '../career/CareerGuidePopup';

export default function CTASection() {
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [showCareerGuide, setShowCareerGuide] = useState(false);

  return (
    <>
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-blue-700 overflow-hidden -mt-1">
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight drop-shadow-sm">
            Ready to Nurture the Next Generation of Entrepreneurs?
          </h2>
          
          <p className="text-xl text-white opacity-90 mb-12 max-w-3xl mx-auto drop-shadow-sm">
            Join over 10,000 families empowering their children with business skills that last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setShowEnrollment(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg transition-all transform hover:scale-105"
            >
              Get Started Today
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            
            <button 
              onClick={() => setShowCareerGuide(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md text-white bg-transparent border-2 border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg transition-all transform hover:scale-105"
            >
              Download Career Guide
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free consultation
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expert guidance
            </div>
          </div>
        </div>
      </section>

      {showEnrollment && <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />}
      {showCareerGuide && <CareerGuidePopup isOpen={showCareerGuide} onClose={() => setShowCareerGuide(false)} />}
    </>
  );
} 