-- Fix RLS policies for lesson_content table
-- This migration ensures admin users can properly manage course content

-- Drop existing policies for lesson_content
DROP POLICY IF EXISTS "Admins can manage lesson content" ON lesson_content;
DROP POLICY IF EXISTS "Authenticated users can read lesson content" ON lesson_content;

-- Create updated policies for lesson_content
CREATE POLICY "Authenticated users can read lesson content"
  ON lesson_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a more permissive policy for admins without WITH CHECK clause
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
  );

-- Update type check constraint to include 'ppt' and 'link' types
ALTER TABLE lesson_content DROP CONSTRAINT IF EXISTS lesson_content_type_check;
ALTER TABLE lesson_content ADD CONSTRAINT lesson_content_type_check 
  CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'));

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

-- Update existing lesson_content records to set title if missing
UPDATE lesson_content
SET title = 'Content Item ' || "order"
WHERE title IS NULL;

-- Ensure RLS is enabled
ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;