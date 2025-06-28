-- Fix schema mismatches between frontend and database
-- This migration adds missing columns and fixes data types

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_type TEXT DEFAULT 'Basic';

-- Add missing columns to tasks table  
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS live_discussion BOOLEAN DEFAULT false;

-- Update task_type enum to include frontend expected values
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_task_type_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_task_type_check 
  CHECK (task_type IN ('assignment', 'quiz', 'project', 'discussion', 'file_upload', 'text', 'mcq'));

-- Add missing columns to task_submissions table
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0;

-- Update status enum to include frontend expected values  
ALTER TABLE task_submissions DROP CONSTRAINT IF EXISTS task_submissions_status_check;
ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_status_check
  CHECK (status IN ('submitted', 'graded', 'pending', 'reviewed'));

-- Create user_progress_custom table for frontend progress tracking
CREATE TABLE IF NOT EXISTS user_progress_custom (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_lessons JSONB DEFAULT '{}',
  completed_tasks JSONB DEFAULT '{}',
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  tool_usage JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on new table
ALTER TABLE user_progress_custom ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress_custom
CREATE POLICY "Users can manage their own custom progress" ON user_progress_custom
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all custom progress" ON user_progress_custom
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_custom_user ON user_progress_custom(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_progress ON profiles(progress);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(points);
CREATE INDEX IF NOT EXISTS idx_tasks_week ON tasks(week_number);

-- Update existing tasks with week numbers based on creation date
UPDATE tasks 
SET week_number = CASE 
  WHEN created_at < NOW() - INTERVAL '3 weeks' THEN 1
  WHEN created_at < NOW() - INTERVAL '2 weeks' THEN 2  
  WHEN created_at < NOW() - INTERVAL '1 week' THEN 3
  ELSE 4
END
WHERE week_number IS NULL OR week_number = 1;

-- Add trigger for user_progress_custom updated_at
CREATE TRIGGER update_user_progress_custom_updated_at 
  BEFORE UPDATE ON user_progress_custom
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO user_progress_custom (user_id, completed_lessons, completed_tasks, streak, total_points)
SELECT 
  id,
  '{}',
  '{}', 
  0,
  COALESCE(points, 0)
FROM profiles 
WHERE role = 'student'
ON CONFLICT (user_id) DO NOTHING; 