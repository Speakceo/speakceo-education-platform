-- ============================================
-- COMPLETE DATABASE SETUP FOR SPEAKCEO
-- ============================================
-- Run this script in Supabase Dashboard > SQL Editor

-- ============================================
-- 1. CREATE MISSING TABLES
-- ============================================

-- Create courses table (MISSING)
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  level TEXT DEFAULT 'Beginner',
  duration TEXT DEFAULT '4 weeks',
  price DECIMAL DEFAULT 0,
  instructor TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_enrollments table (MISSING)
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create user_progress table (MISSING)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create announcements table (MISSING)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- 2. ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- Add missing columns to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Add missing columns to lessons table  
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add missing columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- ============================================
-- 3. SETUP ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Simple policies: allow authenticated users to read everything
CREATE POLICY "courses_select_policy" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "courses_all_policy" ON courses FOR ALL TO authenticated USING (true);

CREATE POLICY "user_enrollments_select_policy" ON user_enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_enrollments_all_policy" ON user_enrollments FOR ALL TO authenticated USING (true);

CREATE POLICY "user_progress_select_policy" ON user_progress FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_progress_all_policy" ON user_progress FOR ALL TO authenticated USING (true);

CREATE POLICY "announcements_select_policy" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "announcements_all_policy" ON announcements FOR ALL TO authenticated USING (true);

-- Update existing table policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON modules;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON profiles;

CREATE POLICY "modules_all_policy" ON modules FOR ALL TO authenticated USING (true);
CREATE POLICY "lessons_all_policy" ON lessons FOR ALL TO authenticated USING (true);
CREATE POLICY "tasks_all_policy" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "profiles_all_policy" ON profiles FOR ALL TO authenticated USING (true);

-- ============================================
-- 4. INSERT SAMPLE DATA
-- ============================================

-- Insert admin user
INSERT INTO profiles (id, email, name, role, progress, status) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@speakceo.com', 'Admin User', 'admin', 100, 'active')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  progress = EXCLUDED.progress,
  status = EXCLUDED.status;

-- Insert sample students
INSERT INTO profiles (id, email, name, role, progress, status) VALUES
('00000000-0000-0000-0000-000000000002', 'student1@example.com', 'Alice Johnson', 'student', 65, 'active'),
('00000000-0000-0000-0000-000000000003', 'student2@example.com', 'Bob Smith', 'student', 45, 'active'),
('00000000-0000-0000-0000-000000000004', 'student3@example.com', 'Carol Davis', 'student', 80, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (id, title, description, is_active, level, duration, price, instructor) VALUES
('10000000-0000-0000-0000-000000000001', 'Public Speaking Mastery', 'Learn the fundamentals of effective public speaking and presentation skills', true, 'Beginner', '6 weeks', 199.99, 'Dr. Sarah Mitchell'),
('10000000-0000-0000-0000-000000000002', 'Advanced Leadership Communication', 'Develop executive presence and leadership communication skills', true, 'Advanced', '8 weeks', 299.99, 'Prof. Michael Chen'),
('10000000-0000-0000-0000-000000000003', 'Business Presentation Bootcamp', 'Master business presentations and corporate communication', true, 'Intermediate', '4 weeks', 149.99, 'Jennifer Williams')
ON CONFLICT (id) DO NOTHING;

-- Insert sample modules
INSERT INTO modules (id, title, description, course_id, "order") VALUES
('20000000-0000-0000-0000-000000000001', 'Foundation of Public Speaking', 'Introduction to public speaking fundamentals', '10000000-0000-0000-0000-000000000001', 1),
('20000000-0000-0000-0000-000000000002', 'Voice and Delivery Techniques', 'Master vocal techniques and delivery methods', '10000000-0000-0000-0000-000000000001', 2),
('20000000-0000-0000-0000-000000000003', 'Leadership Presence', 'Develop executive presence and authority', '10000000-0000-0000-0000-000000000002', 1),
('20000000-0000-0000-0000-000000000004', 'Business Communication Essentials', 'Core business presentation skills', '10000000-0000-0000-0000-000000000003', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (id, title, description, module_id, "order", content, video_url) VALUES
('30000000-0000-0000-0000-000000000001', 'Understanding Your Audience', 'Learn to analyze and connect with your audience', '20000000-0000-0000-0000-000000000001', 1, 'Understanding your audience is the first step...', 'https://example.com/video1'),
('30000000-0000-0000-0000-000000000002', 'Structuring Your Speech', 'Create compelling speech structures', '20000000-0000-0000-0000-000000000001', 2, 'A well-structured speech follows...', 'https://example.com/video2'),
('30000000-0000-0000-0000-000000000003', 'Breathing and Voice Control', 'Master proper breathing techniques', '20000000-0000-0000-0000-000000000002', 1, 'Proper breathing is essential...', 'https://example.com/video3'),
('30000000-0000-0000-0000-000000000004', 'Executive Body Language', 'Command presence through body language', '20000000-0000-0000-0000-000000000003', 1, 'Body language communicates...', 'https://example.com/video4'),
('30000000-0000-0000-0000-000000000005', 'PowerPoint Best Practices', 'Create effective business presentations', '20000000-0000-0000-0000-000000000004', 1, 'Effective slides support...', 'https://example.com/video5')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, week_number, points, course_id) VALUES
('40000000-0000-0000-0000-000000000001', 'Record 2-minute Introduction', 'Record yourself giving a 2-minute personal introduction', 1, 20, '10000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', 'Analyze a Great Speech', 'Watch and analyze a famous speech, submit 500-word analysis', 2, 15, '10000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000003', 'Voice Exercise Recording', 'Complete voice exercises and submit recording', 3, 10, '10000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000004', 'Leadership Presentation', 'Create 5-minute leadership presentation', 1, 25, '10000000-0000-0000-0000-000000000002'),
('40000000-0000-0000-0000-000000000005', 'Business Pitch Deck', 'Design professional business pitch deck', 1, 30, '10000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert sample live classes
INSERT INTO live_classes (id, title, description, scheduled_at, instructor, zoom_link) VALUES
('50000000-0000-0000-0000-000000000001', 'Weekly Q&A Session', 'Ask questions about course material', '2024-06-15 19:00:00+00', 'Dr. Sarah Mitchell', 'https://zoom.us/j/123456789'),
('50000000-0000-0000-0000-000000000002', 'Practice Presentation Session', 'Present in front of the group and get feedback', '2024-06-22 19:00:00+00', 'Prof. Michael Chen', 'https://zoom.us/j/987654321'),
('50000000-0000-0000-0000-000000000003', 'Masterclass: Executive Presence', 'Special session on developing executive presence', '2024-06-29 19:00:00+00', 'Jennifer Williams', 'https://zoom.us/j/456789123')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user enrollments
INSERT INTO user_enrollments (user_id, course_id, status, progress) VALUES
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'active', 65),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'active', 45),
('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'active', 80),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'active', 30)
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id, is_pinned) VALUES
('Welcome to SpeakCEO!', 'Welcome to our comprehensive public speaking program. We are excited to have you on this journey!', '00000000-0000-0000-0000-000000000001', true),
('New Course Available', 'We have just launched our Advanced Leadership Communication course. Check it out!', '00000000-0000-0000-0000-000000000001', false),
('Live Session This Week', 'Don''t forget about our live Q&A session this Friday at 7 PM EST.', '00000000-0000-0000-0000-000000000001', false)
ON CONFLICT DO NOTHING;

-- Insert sample user progress
INSERT INTO user_progress (user_id, course_id, module_id, lesson_id, completed) VALUES
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', true),
('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', true),
('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================

-- Show what was created
SELECT 'PROFILES' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'COURSES', COUNT(*) FROM courses
UNION ALL
SELECT 'MODULES', COUNT(*) FROM modules
UNION ALL
SELECT 'LESSONS', COUNT(*) FROM lessons
UNION ALL
SELECT 'TASKS', COUNT(*) FROM tasks
UNION ALL
SELECT 'LIVE_CLASSES', COUNT(*) FROM live_classes
UNION ALL
SELECT 'USER_ENROLLMENTS', COUNT(*) FROM user_enrollments
UNION ALL
SELECT 'ANNOUNCEMENTS', COUNT(*) FROM announcements
UNION ALL
SELECT 'USER_PROGRESS', COUNT(*) FROM user_progress;

-- Show course structure
SELECT 
  c.title as course_title,
  m.title as module_title,
  COUNT(l.id) as lesson_count
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
GROUP BY c.id, c.title, m.id, m.title
ORDER BY c.title, m."order";

-- Show student enrollments
SELECT 
  p.name as student_name,
  c.title as course_title,
  ue.progress
FROM user_enrollments ue
JOIN profiles p ON ue.user_id = p.id
JOIN courses c ON ue.course_id = c.id
ORDER BY p.name; 