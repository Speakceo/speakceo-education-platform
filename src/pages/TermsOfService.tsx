import React from 'react';
import { FileText, Shield, AlertCircle, UserCheck, Scale, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

interface TermsSection {
  id: number;
  title: string;
  content: string[];
  icon: React.ElementType;
}

const termsSections: TermsSection[] = [
  {
    id: 1,
    title: "Account Terms",
    content: [
      "You must be at least 13 years old to use this service",
      "You must provide accurate and complete registration information",
      "You are responsible for maintaining the security of your account",
      "You must notify us of any unauthorized account access",
      "We reserve the right to suspend or terminate accounts"
    ],
    icon: UserCheck
  },
  {
    id: 2,
    title: "Service Usage",
    content: [
      "Services are provided 'as is' without warranties",
      "We may modify or discontinue services at any time",
      "You agree to use services for lawful purposes only",
      "You must not violate any applicable laws or regulations",
      "Usage limits and restrictions may apply"
    ],
    icon: FileText
  },
  {
    id: 3,
    title: "Content Guidelines",
    content: [
      "You retain rights to content you create",
      "We may remove inappropriate or violating content",
      "You must not post harmful or offensive content",
      "Respect intellectual property rights",
      "Content moderation policies apply"
    ],
    icon: AlertCircle
  },
  {
    id: 4,
    title: "Privacy & Security",
    content: [
      "We protect your personal information",
      "Data collection and usage as per Privacy Policy",
      "Security measures are implemented",
      "Third-party services may collect data",
      "Cookie usage and tracking disclosure"
    ],
    icon: Shield
  },
  {
    id: 5,
    title: "Legal Considerations",
    content: [
      "Governing law and jurisdiction",
      "Limitation of liability",
      "Indemnification terms",
      "Dispute resolution process",
      "Changes to terms notification"
    ],
    icon: Scale
  },
  {
    id: 6,
    title: "Support & Communication",
    content: [
      "Methods of contacting support",
      "Response time expectations",
      "Service updates and notifications",
      "Feedback and improvement process",
      "Community guidelines"
    ],
    icon: HelpCircle
  }
];

const TermsOfService: React.FC = () => {
  return (
    <>
      <SEO 
        title="Terms of Service | Young CEO Program"
        description="Read our terms of service and understand your rights and responsibilities when using our platform."
        keywords={["terms of service", "user agreement", "legal terms", "platform rules"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Please read these terms carefully before using our platform
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
              Welcome to Young CEO Program. By accessing or using our platform, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
              using or accessing this site.
            </p>
            <p className="text-gray-600">
              We reserve the right to update or change our Terms of Service at any time without notice. 
              Your continued use of the platform following any changes indicates your acceptance of those changes.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {termsSections.map(section => (
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
            <Scale className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about our Terms of Service, please contact our legal team.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:legal@speakceo.ai"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Contact Legal Team
              </a>
              <a
                href="/contact"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                General Support
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-500">
              These terms of service are subject to change without notice and were last updated on March 1, 2024. 
              If you have any questions about our terms, please feel free to contact us.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService; 