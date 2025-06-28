import { z } from 'zod';

// Course Types
export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order_index: z.number().optional(),
  order: z.number().optional(),
  duration: z.string().optional(),
  image_url: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export const LessonSchema = z.object({
  id: z.string(),
  module_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['video', 'document', 'presentation', 'quiz', 'assignment', 'ppt']),
  duration: z.string().optional(),
  order_index: z.number().optional(),
  order: z.number().optional(),
  points: z.number().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export const LessonContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['text', 'video', 'quiz', 'assignment', 'ppt', 'link', 'pdf']),
  url: z.string().optional(),
  content: z.string().optional(),
  order: z.number(),
  quiz_questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      options: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          isCorrect: z.boolean()
        })
      ),
      explanation: z.string().optional(),
      points: z.number().default(10)
    })
  ).optional()
});

export type Module = z.infer<typeof ModuleSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;

// Course Progress Types
export interface CourseProgress {
  user_id: string;
  module_id: string;
  lesson_id: string;
  content_id: string;
  completed: boolean;
  progress_percentage: number;
  last_accessed: string;
  time_spent: number;
}

// User Type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  course_type: 'Basic' | 'Premium';
  progress: number;
  points: number;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Live Class Types
export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor: {
    id: string;
    name: string;
    avatar_url: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  durationMinutes: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  materials: {
    id: string;
    type: 'pdf' | 'video' | 'quiz';
    title: string;
    url: string;
  }[];
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
  joinUrl?: string;
}

// Quiz-specific types
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    points: number;
  }[];
  completedAt: string;
}

// Progress tracking
export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  quizResult?: QuizResult;
  xpEarned: number;
}

// Course roadmap types
export interface CourseSection {
  id: string;
  title: string;
  description: string;
  weeks: string;
  icon: string;
  color: string;
  modules: CourseModule[];
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
}

export interface CourseModule {
  id: string;
  title: string;
  icon: string;
  duration: string;
  slides: LessonContent[];
}