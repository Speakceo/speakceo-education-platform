-- Fix RLS policies for lessons and lesson_content tables
-- This migration removes the WITH CHECK clause that was causing permission issues

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can manage lesson content" ON lesson_content;

-- Create new policies with proper permissions for admin users
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
  );

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

-- Update lesson_content type check constraint to include more content types
ALTER TABLE lesson_content DROP CONSTRAINT IF EXISTS lesson_content_type_check;
ALTER TABLE lesson_content ADD CONSTRAINT lesson_content_type_check 
  CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'));

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

-- Update existing lesson_content records to set title if missing
UPDATE lesson_content
SET title = 'Content Item ' || "order"
WHERE title IS NULL;

-- Ensure all lessons have a type field set
UPDATE lessons
SET type = 'video'
WHERE type IS NULL OR type = '';

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_content_lesson_id ON lesson_content(lesson_id);

-- Ensure lessons table has the correct type constraint
DO $$
BEGIN
  -- Check if the type column exists in the lessons table
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'type'
  ) THEN
    -- Add a check constraint for the type column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.constraint_column_usage
      WHERE table_name = 'lessons' AND column_name = 'type'
    ) THEN
      ALTER TABLE lessons ADD CONSTRAINT lessons_type_check 
        CHECK (type IN ('video', 'document', 'quiz', 'assignment', 'ppt'));
    END IF;
  END IF;
END $$;