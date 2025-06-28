export interface Project {
  id: string;
  user_id: string;
  name: string;
  tagline: string;
  industry: string;
  problem_statement: string;
  target_audience: string;
  revenue_model: string;
  stage: 'ideation' | 'prototype' | 'testing' | 'scaling';
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  ai_feedback?: string;
  ai_suggestions?: string[];
}

export interface ProjectMetrics {
  revenue: number;
  expenses: number;
  customers: number;
  marketing_spend: number;
  conversion_rate: number;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completed_at?: string;
}

export interface ProjectFeedback {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  type: 'mentor' | 'peer' | 'ai';
  rating?: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url: string;
  };
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface RevenueModel {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface BusinessStage {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  next_steps: string[];
}