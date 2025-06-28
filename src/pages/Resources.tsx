import React from 'react';
import { Download, FileText, Video, Book, Presentation, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'video' | 'ebook' | 'presentation';
  category: string;
  downloadUrl: string;
  fileSize?: string;
  format?: string;
  popular: boolean;
}

const resources: Resource[] = [
  {
    id: 1,
    title: "Business Plan Template",
    description: "A comprehensive template to help you create a professional business plan. Perfect for young entrepreneurs starting their first venture.",
    type: "template",
    category: "Planning",
    downloadUrl: "/downloads/business-plan-template.pdf",
    fileSize: "2.4 MB",
    format: "PDF",
    popular: true
  },
  {
    id: 2,
    title: "Financial Projections Spreadsheet",
    description: "Easy-to-use Excel template for creating financial projections and budgets for your startup.",
    type: "template",
    category: "Finance",
    downloadUrl: "/downloads/financial-projections.xlsx",
    fileSize: "1.8 MB",
    format: "Excel",
    popular: true
  },
  {
    id: 3,
    title: "Marketing Strategy Guide",
    description: "Learn how to create and execute an effective marketing strategy for your business.",
    type: "guide",
    category: "Marketing",
    downloadUrl: "/downloads/marketing-guide.pdf",
    fileSize: "3.2 MB",
    format: "PDF",
    popular: false
  },
  {
    id: 4,
    title: "Pitch Deck Template",
    description: "Professional slide deck template for presenting your business idea to investors.",
    type: "presentation",
    category: "Pitching",
    downloadUrl: "/downloads/pitch-deck.pptx",
    fileSize: "5.1 MB",
    format: "PowerPoint",
    popular: true
  },
  {
    id: 5,
    title: "Social Media Content Calendar",
    description: "Plan and organize your social media content with this ready-to-use template.",
    type: "template",
    category: "Marketing",
    downloadUrl: "/downloads/social-media-calendar.xlsx",
    fileSize: "1.2 MB",
    format: "Excel",
    popular: false
  },
  {
    id: 6,
    title: "Young Entrepreneur's Guide to Success",
    description: "Comprehensive ebook covering all aspects of starting and running a successful business as a young entrepreneur.",
    type: "ebook",
    category: "Getting Started",
    downloadUrl: "/downloads/entrepreneur-guide.pdf",
    fileSize: "4.5 MB",
    format: "PDF",
    popular: true
  }
];

const categories = ["All", "Planning", "Finance", "Marketing", "Pitching", "Getting Started"];

const getIconByType = (type: string) => {
  switch (type) {
    case 'template':
      return FileText;
    case 'guide':
      return Book;
    case 'video':
      return Video;
    case 'ebook':
      return Book;
    case 'presentation':
      return Presentation;
    default:
      return FileText;
  }
};

const Resources: React.FC = () => {
  return (
    <>
      <SEO 
        title="Resources | Young CEO Program"
        description="Access free business templates, guides, and tools to help you start and grow your business."
        keywords={["business resources", "templates", "guides", "entrepreneurship tools"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Free Resources
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Download free templates, guides, and tools to help you start and grow your business
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Categories */}
          <div className="mb-12">
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

          {/* Popular Resources */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.filter(resource => resource.popular).map(resource => {
                const Icon = getIconByType(resource.type);
                return (
                  <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-500">{resource.format} • {resource.fileSize}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {resource.category}
                      </span>
                      <a
                        href={resource.downloadUrl}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map(resource => {
                const Icon = getIconByType(resource.type);
                return (
                  <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-500">{resource.format} • {resource.fileSize}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {resource.category}
                      </span>
                      <a
                        href={resource.downloadUrl}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Resources Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Need More Resources?</h2>
            <p className="text-indigo-100 mb-8 text-center max-w-2xl mx-auto">
              Check out our premium resources and tools available to enrolled students.
            </p>
            <div className="flex justify-center">
              <a
                href="/courses"
                className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Explore Premium Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources; 