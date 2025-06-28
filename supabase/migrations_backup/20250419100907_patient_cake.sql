/*
  # Create Course Management Tables

  1. New Tables
    - `modules`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `order` (integer)
      - `duration` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, references modules)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `order` (integer)
      - `duration` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lesson_content`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, references lessons)
      - `type` (text)
      - `content` (text)
      - `order` (integer)
      - `url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access and user read access
*/

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS lesson_content CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  "order" integer NOT NULL,
  duration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create lessons table with explicit type column
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL, -- Explicitly define type column
  "order" integer NOT NULL,
  duration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create lesson_content table
CREATE TABLE IF NOT EXISTS lesson_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  type text NOT NULL,
  content text NOT NULL,
  "order" integer NOT NULL,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text,
  CONSTRAINT lesson_content_type_check CHECK (type IN ('text', 'video', 'quiz', 'assignment', 'ppt', 'link'))
);

ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for modules with existence checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'modules' 
    AND policyname = 'Authenticated users can read modules'
  ) THEN
    CREATE POLICY "Authenticated users can read modules"
      ON modules
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'modules' 
    AND policyname = 'Admins can manage modules'
  ) THEN
    CREATE POLICY "Admins can manage modules"
      ON modules
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Add RLS policies for lessons with existence checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lessons' 
    AND policyname = 'Authenticated users can read lessons'
  ) THEN
    CREATE POLICY "Authenticated users can read lessons"
      ON lessons
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lessons' 
    AND policyname = 'Admins can manage lessons'
  ) THEN
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
  END IF;
END $$;

-- Add RLS policies for lesson_content with existence checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lesson_content' 
    AND policyname = 'Authenticated users can read lesson content'
  ) THEN
    CREATE POLICY "Authenticated users can read lesson content"
      ON lesson_content
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lesson_content' 
    AND policyname = 'Admins can manage lesson content'
  ) THEN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Admins can manage lesson content" ON lesson_content;
    
    -- Create a more permissive policy for admins
    CREATE POLICY "Admins can manage lesson content"
      ON lesson_content
      FOR ALL
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Add triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers with existence checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_modules_updated_at'
  ) THEN
    CREATE TRIGGER update_modules_updated_at
      BEFORE UPDATE ON modules
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_lessons_updated_at'
  ) THEN
    CREATE TRIGGER update_lessons_updated_at
      BEFORE UPDATE ON lessons
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_lesson_content_updated_at'
  ) THEN
    CREATE TRIGGER update_lesson_content_updated_at
      BEFORE UPDATE ON lesson_content
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert initial sample data
INSERT INTO modules (title, description, "order", duration)
VALUES 
  ('Foundations of Entrepreneurship', 'Build your entrepreneurial mindset and discover opportunities', 1, '2 weeks'),
  ('Building Your Brand & Business', 'Create your brand identity and learn marketing essentials', 2, '2 weeks'),
  ('Financial Literacy', 'Master money management and business finance basics', 3, '2 weeks'),
  ('Marketing & Sales Strategy', 'Learn to promote and sell your products effectively', 4, '2 weeks'),
  ('Leadership & Team Building', 'Develop essential leadership and management skills', 5, '2 weeks'),
  ('Capstone Project', 'Apply your knowledge in a real business project', 6, '2 weeks')
ON CONFLICT DO NOTHING;

-- Insert sample lessons for each module
DO $$
DECLARE
  module_id uuid;
  module_title text;
  module_cursor CURSOR FOR SELECT id, title FROM modules ORDER BY "order";
BEGIN
  OPEN module_cursor;
  
  LOOP
    FETCH module_cursor INTO module_id, module_title;
    EXIT WHEN NOT FOUND;
    
    -- Insert lessons based on module title
    IF module_title = 'Foundations of Entrepreneurship' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'What is Entrepreneurship?', 'video', 1, '2 hours'),
        (module_id, 'How to Identify Opportunities', 'document', 2, '1.5 hours'),
        (module_id, 'Basics of Business Models', 'video', 3, '2 hours'),
        (module_id, 'Communication & Storytelling', 'assignment', 4, '1.5 hours')
      ON CONFLICT DO NOTHING;
    ELSIF module_title = 'Building Your Brand & Business' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'Personal Brand Creation', 'video', 1, '2 hours'),
        (module_id, 'Logo & Business Identity', 'document', 2, '1.5 hours'),
        (module_id, 'Marketing Fundamentals', 'video', 3, '2 hours'),
        (module_id, 'Public Speaking Skills', 'quiz', 4, '2 hours')
      ON CONFLICT DO NOTHING;
    ELSIF module_title = 'Financial Literacy' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'Understanding Money', 'video', 1, '1.5 hours'),
        (module_id, 'Financial Planning', 'document', 2, '2 hours'),
        (module_id, 'Reading Financial Statements', 'video', 3, '2 hours'),
        (module_id, 'Smart Money Management', 'assignment', 4, '1.5 hours')
      ON CONFLICT DO NOTHING;
    ELSIF module_title = 'Marketing & Sales Strategy' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'Digital Marketing 101', 'video', 1, '2 hours'),
        (module_id, 'Building Online Presence', 'document', 2, '1.5 hours'),
        (module_id, 'Sales Techniques', 'video', 3, '2 hours'),
        (module_id, 'Customer Relations', 'assignment', 4, '1.5 hours')
      ON CONFLICT DO NOTHING;
    ELSIF module_title = 'Leadership & Team Building' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'Leadership Fundamentals', 'video', 1, '2 hours'),
        (module_id, 'Team Management', 'document', 2, '1.5 hours'),
        (module_id, 'Problem Solving', 'video', 3, '2 hours'),
        (module_id, 'Decision Making', 'quiz', 4, '1.5 hours')
      ON CONFLICT DO NOTHING;
    ELSIF module_title = 'Capstone Project' THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'Business Plan Creation', 'assignment', 1, '2 hours'),
        (module_id, 'Financial Projections', 'document', 2, '2 hours'),
        (module_id, 'Pitch Deck Preparation', 'video', 3, '2 hours'),
        (module_id, 'Final Presentation', 'assignment', 4, '2 hours')
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
  
  CLOSE module_cursor;
END $$;

-- Insert sample content for the first lesson of each module
DO $$
DECLARE
  lesson_id uuid;
  lesson_cursor CURSOR FOR 
    SELECT l.id 
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE l."order" = 1
    ORDER BY m."order";
  lesson_counter int := 1;
BEGIN
  OPEN lesson_cursor;
  
  LOOP
    FETCH lesson_cursor INTO lesson_id;
    EXIT WHEN NOT FOUND;
    
    -- Insert content for each lesson
    INSERT INTO lesson_content (lesson_id, type, content, "order", url, title)
    VALUES 
      (lesson_id, 'video', 'Introduction to the lesson', 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Introduction'),
      (lesson_id, 'text', 'This is the main content of the lesson. It includes important concepts and examples.', 2, NULL, 'Main Content')
    ON CONFLICT DO NOTHING;
    
    lesson_counter := lesson_counter + 1;
  END LOOP;
  
  CLOSE lesson_cursor;
END $$;