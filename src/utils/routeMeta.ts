interface RouteMeta {
  title: string;
  description: string;
  keywords: string[];
  type: 'website' | 'article' | 'course';
}

export const routeMeta: Record<string, RouteMeta> = {
  '/': {
    title: 'SpeakCEO - Young Entrepreneurship Program',
    description: 'Transform your child into a future business leader with our comprehensive 90-Day Young CEO Program. Interactive courses, live mentoring, and hands-on projects.',
    keywords: ['young CEO program', 'kids entrepreneurship', 'business education for children'],
    type: 'website'
  },
  '/courses': {
    title: 'Entrepreneurship Courses for Kids | SpeakCEO',
    description: 'Discover our interactive entrepreneurship courses designed specifically for young minds. From business basics to advanced leadership skills.',
    keywords: ['kids business courses', 'entrepreneurship education', 'children business training'],
    type: 'course'
  },
  '/about': {
    title: 'About SpeakCEO | Empowering Young Entrepreneurs',
    description: 'Learn about our mission to empower the next generation of business leaders through innovative education and hands-on experience.',
    keywords: ['about SpeakCEO', 'kids business education', 'young entrepreneur program'],
    type: 'website'
  },
  '/blog': {
    title: 'Entrepreneurship Blog for Kids | SpeakCEO',
    description: 'Read our latest articles on youth entrepreneurship, business education, and success stories of young business leaders.',
    keywords: ['kids business blog', 'young entrepreneur stories', 'business education tips'],
    type: 'article'
  },
  '/resources': {
    title: 'Business Resources for Young Entrepreneurs | SpeakCEO',
    description: 'Access our comprehensive collection of business resources, tools, and materials designed for young entrepreneurs.',
    keywords: ['business resources for kids', 'young entrepreneur tools', 'business education materials'],
    type: 'website'
  },
  '/contact': {
    title: 'Contact SpeakCEO | Get in Touch',
    description: 'Have questions about our Young CEO Program? Contact us to learn more about how we can help your child become a future business leader.',
    keywords: ['contact SpeakCEO', 'business education inquiry', 'young CEO program contact'],
    type: 'website'
  }
};

export function getRouteMeta(path: string): RouteMeta {
  return routeMeta[path] || routeMeta['/'];
} 