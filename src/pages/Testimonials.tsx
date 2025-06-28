import React from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  quote: string;
  business: string;
  achievement: string;
  rating: number;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Chen",
    age: 16,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    quote: "The Young CEO Program helped me turn my passion for technology into a real business. The mentorship and practical skills I gained were invaluable.",
    business: "EcoTech Solutions",
    achievement: "Launched a successful recycling app with over 10,000 users",
    rating: 5,
    featured: true
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 15,
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    quote: "I learned more about running a business in six months than I ever thought possible. The hands-on experience was incredible.",
    business: "Healthy Bites",
    achievement: "Started a healthy snack delivery service for schools",
    rating: 5,
    featured: true
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    age: 14,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400&h=400&fit=crop",
    quote: "The program gave me the confidence to start my own business. The community support was amazing.",
    business: "TutorMatch",
    achievement: "Connected over 500 students with tutors",
    rating: 5
  },
  {
    id: 4,
    name: "Emily Zhang",
    age: 16,
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "Thanks to the Young CEO Program, I learned how to validate my ideas and create a solid business plan.",
    business: "ArtisanCraft",
    achievement: "Built an online marketplace for young artists",
    rating: 5
  },
  {
    id: 5,
    name: "David Kim",
    age: 15,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "The mentorship program was transformative. I gained insights from experienced entrepreneurs who truly cared about my success.",
    business: "GreenGrow",
    achievement: "Developed sustainable gardening solutions for urban areas",
    rating: 5
  }
];

const stats = [
  { label: "Success Stories", value: "500+" },
  { label: "Active Businesses", value: "200+" },
  { label: "Average Age", value: "15" },
  { label: "Countries", value: "25+" }
];

const Testimonials: React.FC = () => {
  return (
    <>
      <SEO 
        title="Success Stories | Young CEO Program"
        description="Read inspiring success stories from our young entrepreneurs and program graduates."
        keywords={["success stories", "young entrepreneurs", "student testimonials", "business achievements"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
              Meet our young entrepreneurs and discover their inspiring journeys
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-indigo-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Featured Stories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.filter(t => t.featured).map(testimonial => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-full">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-600 italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-500 text-sm">Age {testimonial.age} • {testimonial.location}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Business:</span>
                          <span className="text-gray-600 ml-2">{testimonial.business}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Achievement:</span>
                          <span className="text-gray-600 ml-2">{testimonial.achievement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Success Stories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.filter(t => !t.featured).map(testimonial => (
                <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">Age {testimonial.age} • {testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 italic mb-4 text-sm">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Business:</span>
                      <span className="text-gray-600 ml-2">{testimonial.business}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Achievement:</span>
                      <span className="text-gray-600 ml-2">{testimonial.achievement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Your Story CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <Quote className="h-12 w-12 mx-auto mb-6 opacity-75" />
            <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Are you a Young CEO Program graduate with a story to tell? We'd love to feature your entrepreneurial journey!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Share Your Story
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials; 