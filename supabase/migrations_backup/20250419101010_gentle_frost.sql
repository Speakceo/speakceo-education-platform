/*
  # Fix RLS policies for lesson_content table

  1. Changes
    - Update RLS policy for lesson_content table to allow admins to insert content
    - Add title column to lesson_content table if it doesn't exist
    - Update type check constraint to include 'ppt' and 'link' types

  2. Security
    - Maintain RLS enabled on lesson_content table
    - Ensure admins can properly manage content
*/

-- Add title column to lesson_content if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lesson_content' AND column_name = 'title'
  ) THEN
    ALTER TABLE lesson_content ADD COLUMN title text;
  END IF;
END $$;

-- Update type check constraint to include 'ppt' and 'link' types
ALTER TABLE lesson_content DROP CONSTRAINT IF EXISTS lesson_content_type_check;
ALTER TABLE lesson_content ADD CONSTRAINT lesson_content_type_check 
  CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'));

-- Drop existing policies for lesson_content
DROP POLICY IF EXISTS "Admins can manage lesson content" ON lesson_content;
DROP POLICY IF EXISTS "Authenticated users can read lesson content" ON lesson_content;

-- Create updated policies for lesson_content
CREATE POLICY "Authenticated users can read lesson content"
  ON lesson_content
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Ensure RLS is enabled
ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;