import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  'about': 'About Us',
  'courses': 'Our Courses',
  'events': 'Events',
  'blog': 'Blog',
  'contact': 'Contact',
  'faq': 'FAQ',
  'testimonials': 'Success Stories',
  'resources': 'Resources',
  'partnerships': 'Partnerships',
  'career-guide': 'Career Guide',
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service',
  'cookies': 'Cookie Policy'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="bg-white/50 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 h-10">
          <Link
            to="/"
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            return (
              <React.Fragment key={name}>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="text-indigo-600 font-medium">
                    {routeNames[name] || name}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    {routeNames[name] || name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb; 