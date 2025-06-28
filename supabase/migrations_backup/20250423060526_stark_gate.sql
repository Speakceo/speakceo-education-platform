/*
  # Create live classes table

  1. New Tables
    - `live_classes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor_id` (uuid, references profiles.id)
      - `date` (timestamptz)
      - `duration` (interval)
      - `zoom_link` (text)
      - `status` (text) - can be 'scheduled', 'in_progress', 'completed', 'cancelled'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `live_classes` table
    - Add policies for:
      - Admins can manage all live classes
      - Authenticated users can read live classes
      - Instructors can update their own live classes
*/

-- Create live_classes table
CREATE TABLE IF NOT EXISTS live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES profiles(id),
  date timestamptz NOT NULL,
  duration interval NOT NULL,
  zoom_link text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT live_classes_status_check CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all live classes"
  ON live_classes
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can read live classes"
  ON live_classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can update their own live classes"
  ON live_classes
  FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Create trigger for updating updated_at
CREATE TRIGGER update_live_classes_updated_at
  BEFORE UPDATE ON live_classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();