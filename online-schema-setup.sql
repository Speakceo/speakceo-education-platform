-- ==========================================
-- SUPABASE ONLINE DATABASE SCHEMA SETUP
-- Copy and paste this entire script into your Supabase SQL Editor
-- ==========================================

-- 1. Create missing tables
-- ==========================================

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  module_id UUID,
  lesson_id UUID,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID,
  price DECIMAL(10,2),
  duration_weeks INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_enrollments table
CREATE TABLE IF NOT EXISTS user_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  course_id UUID,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress DECIMAL(5,2) DEFAULT 0,
  status TEXT CHECK (status IN ('enrolled', 'completed', 'dropped')) DEFAULT 'enrolled'
);

-- 2. Add missing columns to existing tables
-- ==========================================

-- Add missing columns to profiles table (if they don't exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('admin', 'student', 'instructor')) DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Add missing columns to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS "order" INTEGER;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add missing columns to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS "order" INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'video';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS url TEXT;

-- Add missing columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'assignment';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type TEXT DEFAULT 'assignment';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS live_discussion BOOLEAN DEFAULT FALSE;

-- Add missing columns to live_classes table
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS instructor_id UUID;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled';

-- Add missing columns to task_submissions table
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- 3. Enable Row Level Security (RLS) on all tables
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_enrollments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Permissive for authenticated users)
-- ==========================================

-- Profiles policies
CREATE POLICY "Enable all access for authenticated users" ON profiles FOR ALL USING (true);

-- Modules policies
CREATE POLICY "Enable all access for authenticated users" ON modules FOR ALL USING (true);

-- Lessons policies
CREATE POLICY "Enable all access for authenticated users" ON lessons FOR ALL USING (true);

-- Tasks policies
CREATE POLICY "Enable all access for authenticated users" ON tasks FOR ALL USING (true);

-- Live classes policies
CREATE POLICY "Enable all access for authenticated users" ON live_classes FOR ALL USING (true);

-- User progress policies
CREATE POLICY "Enable all access for authenticated users" ON user_progress FOR ALL USING (true);

-- Task submissions policies
CREATE POLICY "Enable all access for authenticated users" ON task_submissions FOR ALL USING (true);

-- Courses policies
CREATE POLICY "Enable all access for authenticated users" ON courses FOR ALL USING (true);

-- Announcements policies
CREATE POLICY "Enable all access for authenticated users" ON announcements FOR ALL USING (true);

-- User enrollments policies
CREATE POLICY "Enable all access for authenticated users" ON user_enrollments FOR ALL USING (true);

-- 5. Insert sample data
-- ==========================================

-- Insert admin profile
INSERT INTO profiles (id, email, name, role, status, progress, points) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@speakceo.com',
  'Admin User',
  'admin',
  'active',
  100,
  1000
) ON CONFLICT (id) DO NOTHING;

-- Insert sample student profiles
INSERT INTO profiles (id, email, name, role, status, progress, points) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john@example.com', 'John Smith', 'student', 'active', 65, 320),
  ('22222222-2222-2222-2222-222222222222', 'sarah@example.com', 'Sarah Johnson', 'student', 'active', 80, 450),
  ('33333333-3333-3333-3333-333333333333', 'mike@example.com', 'Mike Chen', 'student', 'active', 45, 230)
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id, price, duration_weeks, difficulty_level) VALUES
  ('Startup Fundamentals', 'Learn the basics of starting a business', '00000000-0000-0000-0000-000000000001', 299.99, 8, 'beginner'),
  ('Marketing Mastery', 'Master digital marketing strategies', '00000000-0000-0000-0000-000000000001', 199.99, 6, 'intermediate'),
  ('Product Development', 'Build products that customers love', '00000000-0000-0000-0000-000000000001', 399.99, 10, 'advanced');

-- Insert sample modules
INSERT INTO modules (title, description, "order", status) VALUES
  ('Introduction to Entrepreneurship', 'Getting started with your startup journey', 1, 'active'),
  ('Market Research & Validation', 'Validate your business idea', 2, 'active'),
  ('Business Planning', 'Create a solid business plan', 3, 'active'),
  ('Funding & Investment', 'Secure funding for your startup', 4, 'active');

-- Insert sample tasks
INSERT INTO tasks (title, description, type, task_type, week_number, points, status, live_discussion) VALUES
  ('Business Idea Presentation', 'Create a 5-minute presentation about your business idea', 'presentation', 'presentation', 1, 100, 'active', true),
  ('Market Research Report', 'Submit a comprehensive market research document', 'file_upload', 'assignment', 2, 150, 'active', false),
  ('Customer Interview Summary', 'Write a summary of customer interviews conducted', 'text_response', 'assignment', 3, 75, 'active', false),
  ('Financial Projections', 'Create 3-year financial projections for your startup', 'file_upload', 'assignment', 4, 125, 'active', false),
  ('Pitch Deck Creation', 'Design a compelling pitch deck for investors', 'file_upload', 'project', 5, 200, 'active', true);

-- Insert sample live classes
INSERT INTO live_classes (title, description, instructor_id, scheduled_at, duration_minutes, max_participants, status) VALUES
  ('Startup Pitch Workshop', 'Learn how to pitch your startup effectively', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '7 days', 90, 50, 'scheduled'),
  ('Q&A with Successful Entrepreneurs', 'Interactive session with industry experts', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '14 days', 60, 100, 'scheduled'),
  ('Fundraising Masterclass', 'Deep dive into raising capital for your startup', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '21 days', 120, 75, 'scheduled');

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id, priority) VALUES
  ('Welcome to Startup School!', 'Welcome to our comprehensive startup program. Get ready to transform your ideas into reality!', '00000000-0000-0000-0000-000000000001', 'high'),
  ('New Course Module Released', 'We have just released a new module on Digital Marketing. Check it out in your dashboard!', '00000000-0000-0000-0000-000000000001', 'medium'),
  ('Weekly Office Hours', 'Join us every Friday at 3 PM for open office hours where you can ask questions and get feedback.', '00000000-0000-0000-0000-000000000001', 'low');

-- 6. Final verification
-- ==========================================

-- Check table counts
SELECT 
  'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'modules', COUNT(*) FROM modules  
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'live_classes', COUNT(*) FROM live_classes
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'announcements', COUNT(*) FROM announcements
ORDER BY table_name;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status; 