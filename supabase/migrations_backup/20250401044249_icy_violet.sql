/*
  # Add projects and related tables

  1. New Tables
    - `projects`
      - Project details and metadata
      - AI feedback and suggestions
    - `project_metrics`
      - Financial and performance metrics
    - `project_milestones`
      - Project timeline and goals
    - `project_feedback`
      - Feedback from mentors, peers, and AI

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables and policies if they exist
DROP TABLE IF EXISTS project_feedback;
DROP TABLE IF EXISTS project_milestones;
DROP TABLE IF EXISTS project_metrics;
DROP TABLE IF EXISTS projects;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  tagline text,
  industry text NOT NULL,
  problem_statement text,
  target_audience text,
  revenue_model text,
  stage text CHECK (stage IN ('ideation', 'prototype', 'testing', 'scaling')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  ai_feedback text,
  ai_suggestions text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_metrics table
CREATE TABLE IF NOT EXISTS project_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  revenue numeric DEFAULT 0,
  expenses numeric DEFAULT 0,
  customers integer DEFAULT 0,
  marketing_spend numeric DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date timestamptz NOT NULL,
  completed_at timestamptz
);

-- Create project_feedback table
CREATE TABLE IF NOT EXISTS project_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  type text CHECK (type IN ('mentor', 'peer', 'ai')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can read own project metrics" ON project_metrics;
DROP POLICY IF EXISTS "Users can update own project metrics" ON project_metrics;
DROP POLICY IF EXISTS "Users can read own project milestones" ON project_milestones;
DROP POLICY IF EXISTS "Users can manage own project milestones" ON project_milestones;
DROP POLICY IF EXISTS "Users can read project feedback" ON project_feedback;
DROP POLICY IF EXISTS "Users can create project feedback" ON project_feedback;

-- Create policies for projects
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for project_metrics
CREATE POLICY "Users can read own project metrics"
  ON project_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_metrics.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own project metrics"
  ON project_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_metrics.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create policies for project_milestones
CREATE POLICY "Users can read own project milestones"
  ON project_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own project milestones"
  ON project_milestones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create policies for project_feedback
CREATE POLICY "Users can read project feedback"
  ON project_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_feedback.project_id
      AND (projects.user_id = auth.uid() OR project_feedback.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create project feedback"
  ON project_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_metrics_updated_at
  BEFORE UPDATE ON project_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();