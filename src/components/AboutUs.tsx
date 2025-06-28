import React from 'react';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Award, 
  Linkedin, 
  Globe2 
} from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    role: 'Founder & CEO',
    location: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Former Harvard Business School professor with 15+ years of experience in business education.',
    linkedin: '#'
  },
  {
    id: 2,
    name: 'Raj Patel',
    role: 'Chief Education Officer',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Educational technology expert specializing in K-12 entrepreneurship programs.',
    linkedin: '#'
  },
  {
    id: 3,
    name: 'Sarah Chen',
    role: 'Head of Curriculum',
    location: 'Delhi, India',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Developed award-winning business education programs for young entrepreneurs.',
    linkedin: '#'
  }
];

const milestones = [
  {
    id: 1,
    year: '2021',
    title: 'Foundation',
    description: 'SpeakCEO was founded with a vision to revolutionize business education for young minds.'
  },
  {
    id: 2,
    year: '2022',
    title: 'Expansion',
    description: 'Launched in 10 major cities across India, reaching 5000+ students.'
  },
  {
    id: 3,
    year: '2023',
    title: 'Recognition',
    description: 'Awarded "Best EdTech Innovation" by the Indian Education Council.'
  },
  {
    id: 4,
    year: '2024',
    title: 'Global Reach',
    description: 'Expanded to international markets with students from 15+ countries.'
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-mint-50 relative overflow-hidden py-16">
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tr from-mint-200 via-purple-100 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-mint-500 mb-6 drop-shadow-lg">About Us</h1>
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Empowering the Next Generation of <span className="gradient-text">CEOs</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                At SpeakCEO, we believe every child has the potential to become a successful entrepreneur.
                Our mission is to nurture that potential through innovative education.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white rounded-3xl p-8 shadow-xl card-hover">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="mt-4 text-gray-600">
                  To equip young minds with the knowledge, skills, and confidence they need to become
                  successful entrepreneurs and business leaders of tomorrow through practical,
                  engaging, and innovative education methods.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl card-hover">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                  <Globe2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="mt-4 text-gray-600">
                  To create a global community of young entrepreneurs who are prepared to tackle
                  real-world challenges, drive innovation, and make a positive impact on society
                  through ethical business practices.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="mt-4 text-xl text-gray-500">
                Led by experienced educators and business professionals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center">
                    <img
                      className="h-32 w-32 rounded-full object-cover"
                      src={member.image}
                      alt={member.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <div className="flex flex-col">
                        <p className="text-sm text-indigo-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.location}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="mt-4 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
              <p className="mt-4 text-xl text-gray-500">
                Key milestones in our mission to transform business education
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-600 to-purple-600" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="flex-1 md:w-1/2" />
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 z-10" />
                    <div className="flex-1 md:w-1/2">
                      <div className="bg-white rounded-2xl p-6 shadow-lg ml-4 md:ml-0 md:mx-8">
                        <span className="text-sm font-semibold text-indigo-600">{milestone.year}</span>
                        <h3 className="mt-2 text-xl font-bold text-gray-900">{milestone.title}</h3>
                        <p className="mt-2 text-gray-500">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}