/*
  # Fix RLS Policies for Course Management

  1. Updates
    - Fix RLS policies for lessons and lesson_content tables
    - Ensure admin users can properly manage course content
    - Add WITH CHECK clauses to existing policies

  2. Security
    - Maintain read access for all authenticated users
    - Grant full access to admin users
*/

-- Fix RLS policies for lessons
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;
CREATE POLICY "Admins can manage lessons"
  ON lessons
  FOR ALL
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

-- Fix RLS policies for lesson_content
DROP POLICY IF EXISTS "Admins can manage lesson content" ON lesson_content;
CREATE POLICY "Admins can manage lesson content"
  ON lesson_content
  FOR ALL
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

-- Update lesson_content type check constraint to include more content types
ALTER TABLE lesson_content DROP CONSTRAINT IF EXISTS lesson_content_type_check;
ALTER TABLE lesson_content ADD CONSTRAINT lesson_content_type_check 
  CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'));