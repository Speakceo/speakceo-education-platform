/**
 * Course Data Service
 * 
 * This service manages the 90-day journey course data and synchronization
 * between the admin panel and student dashboard.
 */

// Type definitions
export interface CourseSlide {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'ppt' | 'link' | 'text';
  url?: string;
  content?: string;
  order: number;
}

export interface CourseModule {
  title: string;
  icon: string;
  duration: string;
  slides: CourseSlide[];
}

export interface CourseSection {
  weeks: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: CourseModule[];
}

// Default course data structure - matches the structure in CourseRoadmap.tsx
const DEFAULT_COURSE_DATA: CourseSection[] = [
  {
    weeks: '1-2',
    title: 'Foundations of Entrepreneurship',
    description: 'Build your entrepreneurial mindset and discover opportunities',
    icon: 'Target',
    color: 'from-blue-500 to-indigo-500',
    modules: [
      { 
        title: 'What is Entrepreneurship?', 
        icon: 'Trophy', 
        duration: '2h',
        slides: [
          {
            id: '1.1',
            title: 'Introduction to Entrepreneurship',
            type: 'ppt',
            url: 'https://gamma.app/docs/Chapter-11-c17ydyv4u5kger9',
            order: 1
          },
          {
            id: '1.2',
            title: 'Entrepreneurial Mindset',
            type: 'ppt',
            url: 'https://gamma.app/docs/Chapter-12--z47d5h5w2nsaoeg',
            order: 2
          }
        ]
      },
      { 
        title: 'How to Identify Opportunities', 
        icon: 'BrainCircuit', 
        duration: '1.5h',
        slides: [
          {
            id: '1.5',
            title: 'Market Gap Analysis',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            order: 1
          }
        ]
      }
    ]
  },
  {
    weeks: '3-4',
    title: 'Building Your Brand & Business',
    description: 'Create your brand identity and learn marketing essentials',
    icon: 'Sparkles',
    color: 'from-purple-500 to-pink-500',
    modules: [
      { 
        title: 'Personal Brand Creation', 
        icon: 'Star', 
        duration: '2h',
        slides: [
          {
            id: '2.1',
            title: 'Personal Branding Fundamentals',
            type: 'video',
            url: 'https://www.youtube.com/embed/qOmBxQHR7Cs',
            order: 1
          }
        ]
      }
    ]
  },
  {
    weeks: '5-6',
    title: 'Financial Literacy',
    description: 'Master money management and business finance basics',
    icon: 'DollarSign',
    color: 'from-green-500 to-emerald-500',
    modules: [
      { 
        title: 'Understanding Money', 
        icon: 'DollarSign', 
        duration: '1.5h',
        slides: [
          {
            id: '3.1',
            title: 'Business Finance Basics',
            type: 'ppt',
            url: 'https://gamma.app/docs/Finance-101-xy4h8nt2qml5p0g',
            order: 1
          }
        ]
      },
      { 
        title: 'Financial Planning', 
        icon: 'TrendingUp', 
        duration: '2h',
        slides: [
          {
            id: '3.2',
            title: 'Creating Financial Projections',
            type: 'video',
            url: 'https://www.youtube.com/embed/qOmBxQHR7Cs',
            order: 1
          }
        ]
      }
    ]
  },
  {
    weeks: '7-8',
    title: 'Marketing & Sales Strategy',
    description: 'Learn to promote and sell your products effectively',
    icon: 'Target',
    color: 'from-amber-500 to-orange-500',
    modules: [
      { 
        title: 'Digital Marketing 101', 
        icon: 'Globe', 
        duration: '2h',
        slides: [
          {
            id: '4.1',
            title: 'Social Media Marketing',
            type: 'video',
            url: 'https://www.youtube.com/embed/qOmBxQHR7Cs',
            order: 1
          }
        ]
      },
      { 
        title: 'Sales Techniques', 
        icon: 'Target', 
        duration: '2h',
        slides: [
          {
            id: '4.2',
            title: 'Closing Sales',
            type: 'ppt',
            url: 'https://gamma.app/docs/Sales-101-vt9d5ch27kl8p3q',
            order: 1
          }
        ]
      }
    ]
  },
  {
    weeks: '9-10',
    title: 'Leadership & Team Building',
    description: 'Develop essential leadership and management skills',
    icon: 'Users',
    color: 'from-red-500 to-pink-500',
    modules: [
      { 
        title: 'Leadership Fundamentals', 
        icon: 'Star', 
        duration: '2h',
        slides: [
          {
            id: '5.1',
            title: 'Leadership Styles',
            type: 'video',
            url: 'https://www.youtube.com/embed/qOmBxQHR7Cs',
            order: 1
          }
        ]
      },
      { 
        title: 'Team Management', 
        icon: 'Users', 
        duration: '1.5h',
        slides: [
          {
            id: '5.2',
            title: 'Building Effective Teams',
            type: 'ppt',
            url: 'https://gamma.app/docs/Team-Building-ht5r9cq23kl8p0q',
            order: 1
          }
        ]
      }
    ]
  },
  {
    weeks: '11-12',
    title: 'Capstone Project',
    description: 'Apply your knowledge in a real business project',
    icon: 'Rocket',
    color: 'from-purple-600 to-indigo-600',
    modules: [
      { 
        title: 'Business Plan Creation', 
        icon: 'Target', 
        duration: '2h',
        slides: [
          {
            id: '6.1',
            title: 'Business Plan Structure',
            type: 'ppt',
            url: 'https://gamma.app/docs/Business-Plan-xz4h9dq27nl3p0q',
            order: 1
          }
        ]
      },
      { 
        title: 'Pitch Deck Preparation', 
        icon: 'Mic', 
        duration: '2h',
        slides: [
          {
            id: '6.2',
            title: 'Creating a Compelling Pitch',
            type: 'video',
            url: 'https://www.youtube.com/embed/qOmBxQHR7Cs',
            order: 1
          }
        ]
      }
    ]
  }
];

/**
 * Load course data from local storage or fall back to default data
 */
export function loadCourseData(): CourseSection[] {
  try {
    const savedData = localStorage.getItem('90dayJourneyCourses');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData.length > 0 ? parsedData : DEFAULT_COURSE_DATA;
    }
  } catch (error) {
    console.error('Error loading course data:', error);
  }
  return DEFAULT_COURSE_DATA;
}

/**
 * Save course data to local storage
 */
export function saveCourseData(courseData: CourseSection[]): boolean {
  try {
    localStorage.setItem('90dayJourneyCourses', JSON.stringify(courseData));
    return true;
  } catch (error) {
    console.error('Error saving course data:', error);
    return false;
  }
}

/**
 * Calculate user progress based on completed lessons
 */
export function calculateUserProgress(completedLessons: Record<string, boolean>): number {
  const courseData = loadCourseData();
  let totalLessons = 0;
  let completedCount = 0;
  
  courseData.forEach((section: CourseSection) => {
    section.modules.forEach((module: CourseModule) => {
      if (module.slides) {
        module.slides.forEach((slide: CourseSlide) => {
          totalLessons++;
          if (completedLessons[slide.id]) {
            completedCount++;
          }
        });
      }
    });
  });
  
  return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
}

/**
 * Get the next lesson that hasn't been completed
 */
export function getNextLesson(completedLessons: Record<string, boolean>): { moduleId: string; lessonId: string; title: string } | null {
  const courseData = loadCourseData();
  
  for (const section of courseData) {
    for (const module of section.modules) {
      if (module.slides && module.slides.length > 0) {
        for (const slide of module.slides) {
          if (!completedLessons[slide.id]) {
            return {
              moduleId: module.title.toLowerCase().replace(/\s+/g, '-'),
              lessonId: slide.id,
              title: module.title
            };
          }
        }
      }
    }
  }
  
  return null;
}

export default {
  loadCourseData,
  saveCourseData,
  calculateUserProgress,
  getNextLesson
}; 