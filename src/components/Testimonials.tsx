import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Arjun Patel',
    role: 'Student, Age 14',
    location: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'SpeakCEO helped me launch my first online business selling handmade crafts! The mentors are amazing and really understand how to teach complex business concepts to young entrepreneurs like me.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Student, Age 15',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'The business simulations are so engaging! I learned how to create a business plan, manage finances, and even pitched my startup idea to real investors. My parents are amazed at how much I\'ve grown.',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Parent',
    location: 'Delhi, India',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b332800b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'Watching my daughter develop entrepreneurial skills at such a young age has been incredible. The curriculum is comprehensive and the support is outstanding. She\'s now more confident and creative!',
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    role: 'Student, Age 13',
    location: 'Barcelona, Spain',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'SpeakCEO made learning about business fun! I never thought I could understand financial concepts, but the interactive lessons and games made everything click. Now I\'m saving to start my own café!',
  },
  {
    id: 5,
    name: 'Ravi Krishnan',
    role: 'Parent',
    location: 'Bangalore, India',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'My son was always interested in business, but I didn\'t know how to nurture that passion. SpeakCEO provided the perfect structure and mentorship. His confidence has grown tremendously!',
  },
  {
    id: 6,
    name: 'Olivia Johnson',
    role: 'Student, Age 16',
    location: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'The global community aspect of SpeakCEO is amazing! I\'ve connected with young entrepreneurs from India, Singapore, and the US. We even collaborated on a cross-border project. This experience is priceless!',
  },
];

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-mint-50 relative overflow-hidden py-16">
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tr from-mint-200 via-purple-100 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-mint-500 mb-6 drop-shadow-lg">Testimonials</h1>
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Hear from our
              <span className="gradient-text"> young entrepreneurs</span>
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Success stories from students across the globe who transformed their entrepreneurial dreams into reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-3xl p-8 shadow-lg relative card-hover animate-wiggle"
                style={{animationDelay: `${testimonial.id * 0.2}s`}}
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-indigo-100" />
                <div className="flex items-center mb-6">
                  <img
                    className="h-14 w-14 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex flex-col">
                      <p className="text-sm text-indigo-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Global Reach Section */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Global Community</h3>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10">
              Join thousands of young entrepreneurs from over 15 countries who are learning, growing, and building the future together.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['India', 'Singapore', 'Australia', 'United States', 'United Kingdom', 'Canada', 'Spain', 'UAE', 'Japan'].map((country) => (
                <span key={country} className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 font-medium animate-bounce-slow" style={{animationDelay: `${Math.random()}s`}}>
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}