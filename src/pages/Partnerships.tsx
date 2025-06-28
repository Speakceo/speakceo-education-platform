import React from 'react';
import { Handshake, Users, Building, Award, ArrowRight, Mail } from 'lucide-react';
import SEO from '../components/SEO';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  type: 'Education' | 'Corporate' | 'Nonprofit' | 'Government';
  website: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Future Entrepreneurs Foundation",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    description: "Supporting young entrepreneurs with grants and mentorship programs.",
    type: "Nonprofit",
    website: "https://futureentrepreneurs.org"
  },
  {
    id: 2,
    name: "TechStart Academy",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
    description: "Providing technology education and coding bootcamps for youth.",
    type: "Education",
    website: "https://techstartacademy.com"
  },
  {
    id: 3,
    name: "Innovation Corp",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
    description: "Corporate partner offering internships and real-world experience.",
    type: "Corporate",
    website: "https://innovationcorp.com"
  },
  {
    id: 4,
    name: "Small Business Administration",
    logo: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&h=200&fit=crop",
    description: "Government support for small business development and resources.",
    type: "Government",
    website: "https://sba.gov"
  }
];

const benefits = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Access to Network",
    description: "Connect with industry leaders and successful entrepreneurs"
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Mentorship Programs",
    description: "Get guidance from experienced business professionals"
  },
  {
    icon: <Building className="h-8 w-8" />,
    title: "Real-World Experience",
    description: "Internships and project opportunities with partner companies"
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    title: "Funding Opportunities",
    description: "Access to grants, scholarships, and investment opportunities"
  }
];

const Partnerships: React.FC = () => {
  return (
    <>
      <SEO 
        title="Partnerships | Young CEO Program - Business Collaborations"
        description="Discover our partnerships with leading organizations supporting young entrepreneurs. Connect with mentors, access funding, and gain real-world experience."
        keywords={["business partnerships", "entrepreneurship mentors", "startup funding", "youth business support"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Partnerships
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Collaborating with leading organizations to empower young entrepreneurs
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Partnership Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Partnership Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Organizations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Partner Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                          {partner.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{partner.description}</p>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Visit Website <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Partner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
            <p className="text-indigo-100 mb-6">
              Join us in empowering the next generation of entrepreneurs. Partner with Young CEO Program to make a lasting impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Corporate Partners</h3>
                <p className="text-indigo-100 text-sm">Provide internships, mentorship, and real-world projects</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Educational Partners</h3>
                <p className="text-indigo-100 text-sm">Collaborate on curriculum and student exchanges</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Funding Partners</h3>
                <p className="text-indigo-100 text-sm">Support through grants, scholarships, and investments</p>
              </div>
            </div>
            
            <a
              href="mailto:partnerships@speakceo.ai"
              className="inline-flex items-center bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Partnership Team
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Partnerships; 