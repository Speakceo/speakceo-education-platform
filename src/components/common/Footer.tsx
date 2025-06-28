import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white relative -mt-1">
      {/* Top angled separator */}
      <div className="bg-white" style={{ height: '50px', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
      
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Information */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">SpeakCEO</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering the next generation of entrepreneurs with the skills they need to succeed in business and life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-white transition-colors duration-200">Our Courses</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white transition-colors duration-200">Upcoming Events</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-200">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQs</Link></li>
              <li><Link to="/testimonials" className="text-gray-300 hover:text-white transition-colors duration-200">Success Stories</Link></li>
              <li><Link to="/resources" className="text-gray-300 hover:text-white transition-colors duration-200">Free Resources</Link></li>
              <li><Link to="/partnerships" className="text-gray-300 hover:text-white transition-colors duration-200">Partnerships</Link></li>
              <li><Link to="/career-guide" className="text-gray-300 hover:text-white transition-colors duration-200">Career Guide</Link></li>
            </ul>
          </div>
          
          {/* Get Started / Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Get Started</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Subscribe to our newsletter for tips, updates, and special offers.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 transition-all"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-md">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              We respect your privacy and never share your information.
            </p>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SpeakCEO. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
        
        {/* Made with love message */}
        <div className="text-center text-gray-400 text-sm mt-6">
          Made with ❤️ for young entrepreneurs everywhere
        </div>
      </div>
    </footer>
  );
} 