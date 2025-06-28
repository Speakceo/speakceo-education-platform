// Progress Types
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'project' | 'live' | 'quiz';
  duration: string;
  points: number;
  order: number;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  lessons: Lesson[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'file_upload' | 'text' | 'mcq';
  dueDate?: string;
  points: number;
  moduleId: string;
}

export interface UserProgress {
  completedLessons: Record<string, boolean>;
  completedTasks: Record<string, 'pending' | 'submitted' | 'completed'>;
  lastActivity: string;
  streak: number;
  totalPoints: number;
  toolUsage?: Record<string, {
    count: number;
    lastUsed: string;
    totalXP: number;
  }>;
}

export interface ProgressSummary {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
  lastCompletedLesson?: {
    moduleId: string;
    lessonId: string;
    title: string;
  };
  nextLesson?: {
    moduleId: string;
    lessonId: string;
    title: string;
  };
}

export interface Activity {
  id: string;
  type: 'course' | 'task' | 'simulator' | 'ai-tool' | 'community';
  title: string;
  description?: string;
  xpEarned: number;
  timestamp: string;
  relatedId?: string; // ID of the related item (lesson, task, etc.)
}

export interface XPBreakdown {
  courses: number;
  tasks: number;
  simulators: number;
  aiTools: number;
  community: number;
  total: number;
}

export interface ToolUsage {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: string | null;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'course' | 'task' | 'simulator' | 'ai-tool' | 'community';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  requiredProgress?: number;
  requiredActions?: {
    type: string;
    count: number;
    completed: number;
  }[];
}