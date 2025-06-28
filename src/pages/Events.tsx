import React from 'react';
import { Calendar, Clock, MapPin, Users, Tag, ExternalLink, Filter } from 'lucide-react';
import SEO from '../components/SEO';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'webinar' | 'competition' | 'networking';
  category: string;
  capacity: number;
  spotsLeft: number;
  speaker?: {
    name: string;
    role: string;
    company: string;
  };
  price: number | 'Free';
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Young Entrepreneurs Pitch Competition",
    description: "Showcase your business idea and get feedback from successful entrepreneurs and investors. Top ideas will receive funding and mentorship.",
    date: "2024-03-15",
    time: "14:00 - 17:00",
    location: "Virtual Event",
    type: "competition",
    category: "Pitching",
    capacity: 50,
    spotsLeft: 15,
    price: "Free",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Building Your First Business Plan Workshop",
    description: "Learn how to create a comprehensive business plan that will help you launch your startup successfully.",
    date: "2024-03-20",
    time: "16:00 - 18:00",
    location: "Virtual Event",
    type: "workshop",
    category: "Planning",
    capacity: 30,
    spotsLeft: 8,
    speaker: {
      name: "Sarah Johnson",
      role: "Business Strategy Consultant",
      company: "StartupMentor Inc."
    },
    price: 25,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    description: "Master the fundamentals of digital marketing and learn how to promote your business online effectively.",
    date: "2024-03-25",
    time: "15:00 - 17:00",
    location: "Virtual Event",
    type: "webinar",
    category: "Marketing",
    capacity: 100,
    spotsLeft: 45,
    speaker: {
      name: "Michael Chen",
      role: "Digital Marketing Director",
      company: "GrowthLab Digital"
    },
    price: 35,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
  }
];

const categories = ["All Events", "Workshops", "Webinars", "Competitions", "Networking"];

const Events: React.FC = () => {
  return (
    <>
      <SEO 
        title="Events | Young CEO Program"
        description="Join our upcoming events, workshops, and competitions designed for young entrepreneurs."
        keywords={["entrepreneurship events", "business workshops", "startup competitions", "networking events"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming Events
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join our events and connect with other young entrepreneurs
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Filters */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Event */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-full">
                  <img
                    src={events[0].image}
                    alt={events[0].title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      {events[0].type}
                    </span>
                    <span>•</span>
                    <span>{events[0].category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {events[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {events[0].description}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3" />
                      {new Date(events[0].date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-3" />
                      {events[0].time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3" />
                      {events[0].location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3" />
                      {events[0].spotsLeft} spots remaining
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Register Now {events[0].price === "Free" ? "(Free)" : `($${events[0].price})`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(1).map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      {event.price === "Free" ? "Free" : `$${event.price}`}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      {event.type}
                    </span>
                    <span>•</span>
                    <span>{event.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.spotsLeft} spots remaining
                    </div>
                  </div>
                  {event.speaker && (
                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-900">{event.speaker.name}</p>
                      <p className="text-sm text-gray-600">{event.speaker.role}, {event.speaker.company}</p>
                    </div>
                  )}
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Host Event CTA */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Want to Host an Event?</h2>
              <p className="text-indigo-100 mb-8">
                Are you an expert who'd like to share knowledge with young entrepreneurs? We'd love to hear from you!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Events; 