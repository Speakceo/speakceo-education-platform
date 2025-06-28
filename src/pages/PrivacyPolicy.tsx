import React from 'react';
import { Shield, Lock, Eye, UserCheck, Database, Globe, Mail } from 'lucide-react';
import SEO from '../components/SEO';

interface PolicySection {
  id: number;
  title: string;
  content: string[];
  icon: React.ElementType;
}

const policySections: PolicySection[] = [
  {
    id: 1,
    title: "Information We Collect",
    content: [
      "Personal information (name, email, age)",
      "Educational background and interests",
      "Payment information for course enrollments",
      "Usage data and learning progress",
      "Device and browser information"
    ],
    icon: Database
  },
  {
    id: 2,
    title: "How We Use Your Information",
    content: [
      "Provide and improve our educational services",
      "Personalize your learning experience",
      "Process payments and enrollments",
      "Send important updates and communications",
      "Analyze and enhance platform performance"
    ],
    icon: UserCheck
  },
  {
    id: 3,
    title: "Data Protection",
    content: [
      "Industry-standard encryption protocols",
      "Regular security audits and updates",
      "Secure data storage and transmission",
      "Limited employee access to personal data",
      "Automated threat detection systems"
    ],
    icon: Shield
  },
  {
    id: 4,
    title: "Your Privacy Rights",
    content: [
      "Access your personal information",
      "Request data correction or deletion",
      "Opt-out of marketing communications",
      "Control cookie preferences",
      "Download your data"
    ],
    icon: Lock
  },
  {
    id: 5,
    title: "Information Sharing",
    content: [
      "Never sell personal information",
      "Share only with authorized partners",
      "Comply with legal requirements",
      "Obtain consent for third-party sharing",
      "Maintain data sharing records"
    ],
    icon: Eye
  },
  {
    id: 6,
    title: "International Data Transfer",
    content: [
      "Comply with international data laws",
      "Ensure secure cross-border transfers",
      "Maintain regional data centers",
      "Follow GDPR and CCPA guidelines",
      "Transparent data location information"
    ],
    icon: Globe
  }
];

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy | Young CEO Program"
        description="Learn about how we protect your privacy and handle your personal information."
        keywords={["privacy policy", "data protection", "personal information", "data security"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              We take your privacy seriously. Learn how we protect and handle your personal information.
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
              At Young CEO Program, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform and services.
            </p>
            <p className="text-gray-600">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              We will not use or share your information with anyone except as described in this Privacy Policy.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {policySections.map(section => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-2 w-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-16">
            <Mail className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:privacy@speakceo.ai"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Email Us
              </a>
              <a
                href="/contact"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500">
              This privacy policy is subject to change without notice and was last updated on March 1, 2024. 
              If you have any questions about our privacy practices, please feel free to contact us.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 