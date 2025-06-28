import { CourseProgram, Week, Lesson, Quiz, Task, BadgeDefinition } from '../types';

// Helper function to create lesson unlock dates (1 per day)
const createLessonUnlockDates = (weekNumber: number): string[] => {
  const startDate = new Date();
  const daysOffset = (weekNumber - 1) * 7; // Each week starts 7 days after the previous
  
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysOffset + index);
    return date.toISOString().split('T')[0];
  });
};

// Badge definitions
const badges: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    requirement: 'Complete 1 lesson',
    xpReward: 10
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Complete your first week',
    icon: '⚡',
    requirement: 'Complete Week 1',
    xpReward: 25
  },
  {
    id: 'idea-master',
    name: 'Idea Master',
    description: 'Complete idea generation week',
    icon: '💡',
    requirement: 'Complete Week 2',
    xpReward: 25
  },
  {
    id: 'business-model-expert',
    name: 'Business Model Expert',
    description: 'Master business model canvas',
    icon: '📊',
    requirement: 'Complete Week 3',
    xpReward: 30
  },
  {
    id: 'customer-guru',
    name: 'Customer Guru',
    description: 'Understand your customers',
    icon: '👥',
    requirement: 'Complete Week 4',
    xpReward: 30
  },
  {
    id: 'brand-builder',
    name: 'Brand Builder',
    description: 'Create your brand identity',
    icon: '🎨',
    requirement: 'Complete Week 5',
    xpReward: 30
  },
  {
    id: 'marketing-maven',
    name: 'Marketing Maven',
    description: 'Master marketing basics',
    icon: '📢',
    requirement: 'Complete Week 6',
    xpReward: 30
  },
  {
    id: 'money-manager',
    name: 'Money Manager',
    description: 'Understand financial basics',
    icon: '💰',
    requirement: 'Complete Week 7',
    xpReward: 35
  },
  {
    id: 'communication-champion',
    name: 'Communication Champion',
    description: 'Master communication skills',
    icon: '🗣️',
    requirement: 'Complete Week 8',
    xpReward: 35
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Develop leadership skills',
    icon: '🧩',
    requirement: 'Complete Week 9',
    xpReward: 35
  },
  {
    id: 'tech-savvy',
    name: 'Tech Savvy',
    description: 'Learn startup tech tools',
    icon: '💻',
    requirement: 'Complete Week 10',
    xpReward: 35
  },
  {
    id: 'pitch-perfect',
    name: 'Pitch Perfect',
    description: 'Master your pitch',
    icon: '🎤',
    requirement: 'Complete Week 11',
    xpReward: 40
  },
  {
    id: 'launch-ready',
    name: 'Launch Ready',
    description: 'Prepare for launch',
    icon: '🚀',
    requirement: 'Complete Week 12',
    xpReward: 40
  },
  {
    id: 'young-ceo',
    name: 'Young CEO',
    description: 'Complete the entire program',
    icon: '👑',
    requirement: 'Complete Week 13',
    xpReward: 100
  }
];

// Create all 13 weeks with consistent structure
const createWeek = (weekNumber: number, title: string, description: string, theme: string): Week => {
  const lessonTitles = [
    `${title} - Introduction`,
    `${title} - Core Concepts`, 
    `${title} - Practical Application`,
    `${title} - Advanced Techniques`,
    `${title} - Review & Practice`
  ];

  return {
    id: `week-${weekNumber}`,
    weekNumber,
    title,
    description,
    theme,
    lessons: Array.from({ length: 5 }, (_, index) => ({
      id: `lesson-${weekNumber}-${index + 1}`,
      title: lessonTitles[index],
      description: `Lesson ${index + 1} covering ${title.toLowerCase()}`,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      pdfUrl: `/course-files/week${weekNumber}/lesson${weekNumber}.${index + 1}.pdf`,
      pptUrl: `/course-files/week${weekNumber}/lesson${weekNumber}.${index + 1}.pptx`,
      duration: 15 + index * 5,
      isCompleted: false,
      isLocked: weekNumber === 1 && index === 0 ? false : true, // Only first lesson is unlocked
      unlockDate: createLessonUnlockDates(weekNumber)[index],
      order: index + 1
    })),
    quiz: {
      id: `quiz-${weekNumber}`,
      title: `${title} Quiz`,
      questions: [
        {
          id: `q${weekNumber}-1`,
          question: `What is the main focus of ${title}?`,
          options: [
            'Basic understanding',
            'Practical implementation',
            'Advanced strategies',
            'All of the above'
          ],
          correct: 3,
          explanation: `${title} covers all aspects from basic understanding to advanced strategies.`
        },
        {
          id: `q${weekNumber}-2`,
          question: `Why is ${title.toLowerCase()} important for entrepreneurs?`,
          options: [
            'It builds foundational skills',
            'It helps in decision making',
            'It creates competitive advantage',
            'All of the above'
          ],
          correct: 3,
          explanation: `${title} is crucial as it builds skills, aids decisions, and creates advantages.`
        },
        {
          id: `q${weekNumber}-3`,
          question: `What is the best way to apply ${title.toLowerCase()} concepts?`,
          options: [
            'Memorize all concepts',
            'Practice with real examples',
            'Only use in emergencies',
            'Avoid practical application'
          ],
          correct: 1,
          explanation: 'Practicing with real examples helps solidify understanding and build practical skills.'
        },
        {
          id: `q${weekNumber}-4`,
          question: `How does ${title.toLowerCase()} relate to overall business success?`,
          options: [
            'It\'s not important',
            'It\'s a foundational element',
            'Only needed for large businesses',
            'Can be ignored initially'
          ],
          correct: 1,
          explanation: `${title} serves as a foundational element that supports overall business success.`
        },
        {
          id: `q${weekNumber}-5`,
          question: `What should you do after completing the ${title.toLowerCase()} module?`,
          options: [
            'Move to next topic immediately',
            'Practice and reflect on learnings',
            'Forget the concepts',
            'Start over from beginning'
          ],
          correct: 1,
          explanation: 'Practicing and reflecting helps reinforce learning and identify areas for improvement.'
        }
      ],
      xpReward: 5
    },
    task: {
      id: `task-${weekNumber}`,
      title: `${title} Practical Task`,
      description: `Apply your knowledge of ${title.toLowerCase()} to a practical scenario`,
      instructions: `Create a practical application of ${title.toLowerCase()} concepts. Include examples, explain your approach, and demonstrate understanding through a real-world application.`,
      xpReward: 5,
      type: weekNumber <= 4 ? 'text' : weekNumber <= 8 ? 'upload' : 'project'
    },
    isCompleted: false,
    progress: 0,
    xpEarned: 0,
    totalXpPossible: 30 // 5 lessons (25 XP) + quiz (5 XP) + task (5 XP) = 35 XP base
  };
};

// Define all weeks
const allWeeks: Week[] = [
  createWeek(1, 'Discovering Entrepreneurship', 'Learn the fundamentals of entrepreneurship and develop entrepreneurial thinking', 'Foundation'),
  createWeek(2, 'Idea Generation & Validation', 'Learn how to generate innovative business ideas and validate them effectively', 'Ideation'),
  createWeek(3, 'Understanding Business Models', 'Master the Business Model Canvas and learn how businesses create value', 'Business Strategy'),
  createWeek(4, 'Knowing Your Customers', 'Deep dive into customer research, personas, and user journey mapping', 'Customer Focus'),
  createWeek(5, 'Branding Basics', 'Create compelling brand identity and understand branding fundamentals', 'Brand Building'),
  createWeek(6, 'Basic Marketing Concepts', 'Learn essential marketing channels, campaigns, and customer acquisition', 'Marketing'),
  createWeek(7, 'Money Matters', 'Understand financial basics, profit, revenue, and business economics', 'Finance'),
  createWeek(8, 'Communication Mastery', 'Develop public speaking, pitching, and communication skills', 'Communication'),
  createWeek(9, 'Problem Solving & Leadership', 'Build critical thinking, problem-solving, and leadership capabilities', 'Leadership'),
  createWeek(10, 'Tech for Founders', 'Learn essential technology tools and concepts for modern entrepreneurs', 'Technology'),
  createWeek(11, 'Pitch Practice & Feedback', 'Master the art of pitching and presenting your business ideas', 'Presentation'),
  createWeek(12, 'Refine & Prepare to Launch', 'Polish your business concept and prepare for market entry', 'Launch Prep'),
  createWeek(13, 'Launch Week', 'Execute your launch strategy and celebrate your entrepreneurial journey', 'Launch & Celebration')
];

// Override first lesson to be immediately accessible
allWeeks[0].lessons[0].isLocked = false;
allWeeks[0].lessons[0].unlockDate = new Date().toISOString().split('T')[0];

export const youngCEOProgram: CourseProgram = {
  id: 'young-ceo-90-day',
  title: '90-Day Young CEO Program',
  description: 'A comprehensive 13-week entrepreneurship learning program designed for young aspiring entrepreneurs',
  totalWeeks: 13,
  weeks: allWeeks,
  badges,
  totalXpPossible: allWeeks.reduce((total, week) => total + week.totalXpPossible, 0)
};

export default youngCEOProgram; 