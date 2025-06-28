/*
  # Fix Lesson Content Schema and Add Title Field

  1. Updates
    - Add title field to lesson_content table
    - Update type constraint to include all content types used in the application
    - Fix RLS policies to ensure proper access control

  2. Security
    - Maintain read access for all authenticated users
    - Grant full access to admin users
*/

-- Add title field to lesson_content if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'lesson_content' AND column_name = 'title'
  ) THEN
    ALTER TABLE lesson_content ADD COLUMN title text;
  END IF;
END $$;

-- Update lesson_content type check constraint to include more content types
ALTER TABLE lesson_content DROP CONSTRAINT IF EXISTS lesson_content_type_check;
ALTER TABLE lesson_content ADD CONSTRAINT lesson_content_type_check 
  CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'));

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

-- Update existing lesson_content records to set title if missing
UPDATE lesson_content
SET title = 'Content Item ' || "order"
WHERE title IS NULL;