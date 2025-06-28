export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: 'Basic' | 'Premium';
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface MenuItem {
  title: string;
  href: string;
}

// 90-Day Young CEO Program Types
export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  xpReward: number;
}

export type TaskInputType = 'text' | 'pdf' | 'image' | 'audio' | 'video' | 'link' | 'text-audio' | 'pdf-audio' | 'image-audio' | 'presentation-audio';

export type TaskSubmissionStatus = 'pending' | 'submitted' | 'reviewed' | 'completed';

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  submittedAt: string;
  status: TaskSubmissionStatus;
  textContent?: string;
  fileUrls?: string[];
  linkUrl?: string;
  reflection?: string;
  aiReview?: {
    feedback: string;
    score: number;
    suggestions: string[];
    generatedAt: string;
  };
  resubmissionAllowed: boolean;
  reviewedAt?: string;
  xpAwarded: number;
}

export interface EnhancedTask {
  id: string;
  title: string;
  description: string;
  instructions: string;
  inputType: TaskInputType;
  requiredInputs: string[]; // e.g., ['text', 'audio'] for text-audio type
  xpReward: number;
  dueDate: string;
  weekNumber: number;
  order: number;
  isRequired: boolean;
  estimatedTime: number; // in minutes
  examples?: string[];
  rubric?: {
    criteria: string;
    points: number;
  }[];
}

export interface TaskProgress {
  taskId: string;
  status: TaskSubmissionStatus;
  submissionId?: string;
  lastUpdated: string;
  xpEarned: number;
}

// Update existing Task interface to be compatible
export interface Task extends EnhancedTask {
  type: 'text' | 'upload' | 'project';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl?: string;
  pptUrl?: string;
  duration: number; // in minutes
  isCompleted: boolean;
  isLocked: boolean;
  unlockDate?: string;
  order: number;
}

export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  theme: string;
  lessons: Lesson[];
  quiz: Quiz;
  task: Task;
  isCompleted: boolean;
  progress: number; // 0-100
  xpEarned: number;
  totalXpPossible: number;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  currentWeek: number;
  totalXp: number;
  completedLessons: string[];
  completedQuizzes: string[];
  completedTasks: string[];
  streak: number;
  lastActivityDate: string;
  badges: string[];
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
}

export interface CourseProgram {
  id: string;
  title: string;
  description: string;
  totalWeeks: number;
  weeks: Week[];
  badges: BadgeDefinition[];
  totalXpPossible: number;
}