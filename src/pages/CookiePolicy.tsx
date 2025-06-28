import React from 'react';
import { Cookie, Settings, Shield, Clock, BarChart, Globe } from 'lucide-react';
import SEO from '../components/SEO';

interface CookieType {
  id: number;
  name: string;
  description: string;
  duration: string;
  required: boolean;
}

interface CookieCategory {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  cookies: CookieType[];
}

const cookieCategories: CookieCategory[] = [
  {
    id: 1,
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
    icon: Shield,
    cookies: [
      {
        id: 1,
        name: "Session Cookie",
        description: "Maintains your session while you're using the platform",
        duration: "Session",
        required: true
      },
      {
        id: 2,
        name: "CSRF Token",
        description: "Helps prevent cross-site request forgery attacks",
        duration: "Session",
        required: true
      },
      {
        id: 3,
        name: "Authentication",
        description: "Keeps you logged in to your account",
        duration: "30 days",
        required: true
      }
    ]
  },
  {
    id: 2,
    title: "Performance Cookies",
    description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
    icon: BarChart,
    cookies: [
      {
        id: 4,
        name: "Analytics",
        description: "Collects anonymous data about how you use our site",
        duration: "2 years",
        required: false
      },
      {
        id: 5,
        name: "Load Balancing",
        description: "Ensures the platform loads quickly and efficiently",
        duration: "Session",
        required: false
      }
    ]
  },
  {
    id: 3,
    title: "Functional Cookies",
    description: "These cookies enable the website to provide enhanced functionality and personalization.",
    icon: Settings,
    cookies: [
      {
        id: 6,
        name: "Language Preference",
        description: "Remembers your preferred language setting",
        duration: "1 year",
        required: false
      },
      {
        id: 7,
        name: "User Preferences",
        description: "Stores your personalized settings",
        duration: "1 year",
        required: false
      }
    ]
  },
  {
    id: 4,
    title: "Targeting Cookies",
    description: "These cookies may be set through our site by our advertising partners to build a profile of your interests.",
    icon: Globe,
    cookies: [
      {
        id: 8,
        name: "Marketing",
        description: "Used to track visitors across websites",
        duration: "1 year",
        required: false
      },
      {
        id: 9,
        name: "Social Media",
        description: "Enables social media features",
        duration: "6 months",
        required: false
      }
    ]
  }
];

const CookiePolicy: React.FC = () => {
  return (
    <>
      <SEO 
        title="Cookie Policy | Young CEO Program"
        description="Learn about how we use cookies to improve your experience on our platform."
        keywords={["cookie policy", "website cookies", "privacy", "data tracking"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Understanding how and why we use cookies on our platform
            </p>
            <p className="text-indigo-200">
              Last updated: March 1, 2024
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-gray-600 mb-6">
              We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. 
              By clicking 'Accept' or continuing to use our site, you agree to this use of cookies. 
            </p>
            <p className="text-gray-600">
              You can learn more about how we use cookies and set your preferences in your Cookie Settings at any time.
            </p>
          </div>

          {/* Cookie Categories */}
          {cookieCategories.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-900">Cookie Name</th>
                      <th className="text-left py-3 px-4 text-gray-900">Purpose</th>
                      <th className="text-left py-3 px-4 text-gray-900">Duration</th>
                      <th className="text-left py-3 px-4 text-gray-900">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.cookies.map(cookie => (
                      <tr key={cookie.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900 font-medium">{cookie.name}</td>
                        <td className="py-3 px-4 text-gray-600">{cookie.description}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {cookie.duration}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            cookie.required
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {cookie.required ? 'Required' : 'Optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Cookie Settings CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16">
            <Cookie className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Manage Your Cookie Preferences</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              You can change your cookie settings at any time. Please note that disabling some cookies may impact your experience on our site.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Cookie Settings
            </button>
          </div>

          {/* Additional Information */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500">
              This cookie policy is subject to change without notice and was last updated on March 1, 2024. 
              For questions about our cookie practices, please contact us at privacy@speakceo.ai.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy; 