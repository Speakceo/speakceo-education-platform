/*
  # Create tasks and assignments system

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text) - 'file_upload', 'text', 'mcq'
      - `week_number` (integer)
      - `points` (integer)
      - `due_date` (timestamptz)
      - `live_discussion` (boolean)
      - `created_at` (timestamptz)

    - `task_submissions`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `file_url` (text)
      - `status` (text) - 'pending', 'submitted', 'reviewed'
      - `feedback` (text)
      - `points_earned` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS task_submissions;
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('file_upload', 'text', 'mcq')),
  week_number integer NOT NULL,
  points integer DEFAULT 0,
  due_date timestamptz,
  live_discussion boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create task_submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id),
  user_id uuid REFERENCES profiles(id),
  content text,
  file_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'reviewed')),
  feedback text,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Users can create submissions" ON task_submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON task_submissions;

-- Create policies for tasks
CREATE POLICY "Users can read tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for task_submissions
CREATE POLICY "Users can read own submissions"
  ON task_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON task_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON task_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_task_submission_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task_submissions
CREATE TRIGGER update_task_submissions_timestamp
  BEFORE UPDATE ON task_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_task_submission_timestamp();

-- Insert sample tasks
INSERT INTO tasks (title, description, type, week_number, points, due_date, live_discussion)
VALUES
  (
    'Define Your Startup Idea',
    'Write a clear, one-sentence description of your business idea. Focus on the problem you''re solving and your target audience.',
    'text',
    1,
    50,
    (now() + interval '7 days'),
    false
  ),
  (
    'Create Customer Persona',
    'Develop a detailed customer persona including demographics, interests, pain points, and goals.',
    'file_upload',
    1,
    100,
    (now() + interval '7 days'),
    true
  ),
  (
    'Personal Brand Statement',
    'Write your personal brand statement that reflects your values and entrepreneurial goals.',
    'text',
    2,
    75,
    (now() + interval '14 days'),
    false
  ),
  (
    'Introduction Video',
    'Record and upload a 30-second video introducing yourself and your business idea.',
    'file_upload',
    2,
    150,
    (now() + interval '14 days'),
    true
  );