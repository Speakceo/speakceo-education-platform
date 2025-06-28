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
  CONSTRAINT lesson_content_type_check CHECK (type IN ('text', 'video', 'quiz', 'assignment'))
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
  ('Financial Literacy', 'Master money management and business finance basics', 3, '2 weeks')
ON CONFLICT DO NOTHING;

-- Check if the lessons table has the type column before inserting data
DO $$
DECLARE
  module_id uuid;
  has_type_column boolean;
BEGIN
  -- Check if the type column exists in the lessons table
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'type'
  ) INTO has_type_column;
  
  -- Only proceed if the type column exists
  IF has_type_column THEN
    SELECT id INTO module_id FROM modules WHERE title = 'Foundations of Entrepreneurship' LIMIT 1;
    
    IF FOUND THEN
      INSERT INTO lessons (module_id, title, type, "order", duration)
      VALUES 
        (module_id, 'What is Entrepreneurship?', 'video', 1, '2 hours'),
        (module_id, 'How to Identify Opportunities', 'document', 2, '1.5 hours'),
        (module_id, 'Basics of Business Models', 'video', 3, '2 hours'),
        (module_id, 'Communication & Storytelling', 'assignment', 4, '1.5 hours')
      ON CONFLICT DO NOTHING;
    END IF;
  ELSE
    RAISE NOTICE 'Type column does not exist in lessons table. Skipping lesson insertion.';
  END IF;
END $$;