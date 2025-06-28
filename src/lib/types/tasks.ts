export interface Task {
  id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  task_type: 'assignment' | 'quiz' | 'project' | 'discussion' | 'file_upload' | 'text_response' | 'multiple_choice' | 'presentation';
  type: string;
  week_number: number;
  points: number;
  due_date: string | null;
  live_discussion: boolean;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  submission_text: string | null;
  content: string | null;
  file_url: string | null;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'pending';
  grade: number | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  graded_at: string | null;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  total_points: number;
  points_earned: number;
  completion_rate: number;
}