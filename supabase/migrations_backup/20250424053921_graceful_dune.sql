/*
  # Create live_classes table with all required columns

  1. New Tables
    - `live_classes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor_id` (uuid, references profiles)
      - `date` (timestamptz)
      - `duration` (interval)
      - `zoom_link` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `attendees` (integer)
      - `max_attendees` (integer)

  2. Security
    - Enable RLS on the table
    - Add policies for admin access and user read access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS live_classes CASCADE;

-- Create live_classes table with all required columns
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
  attendees integer DEFAULT 0,
  max_attendees integer DEFAULT 30,
  CONSTRAINT live_classes_status_check CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all live classes"
  ON live_classes
  FOR ALL
  TO authenticated
  USING (
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