-- Fix critical schema issues for admin panel functionality
-- This migration ensures all columns referenced in seed data exist

-- 1. Fix profiles table - add missing status column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- 2. Fix modules table - add missing columns referenced in seed data
ALTER TABLE modules ADD COLUMN IF NOT EXISTS "order" INTEGER;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'));

-- Copy order_index to order column for backward compatibility
UPDATE modules SET "order" = order_index WHERE "order" IS NULL;

-- Make order_index nullable for seed data compatibility
ALTER TABLE modules ALTER COLUMN order_index DROP NOT NULL;

-- 3. Fix lessons table - add missing columns referenced in seed data
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS "order" INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'video' CHECK (type IN ('video', 'text', 'document', 'spreadsheet', 'audio'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'));
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS url TEXT;

-- Copy order_index to order column for backward compatibility
UPDATE lessons SET "order" = order_index WHERE "order" IS NULL;

-- Rename content to match seed data expectations
ALTER TABLE lessons RENAME COLUMN content TO content_old;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content TEXT;
UPDATE lessons SET content = content_old WHERE content IS NULL;
ALTER TABLE lessons DROP COLUMN IF EXISTS content_old;

-- Rename video_url to match seed data expectations  
ALTER TABLE lessons RENAME COLUMN video_url TO video_url_old;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
UPDATE lessons SET video_url = video_url_old WHERE video_url IS NULL;
ALTER TABLE lessons DROP COLUMN IF EXISTS video_url_old;

-- Rename duration_minutes to duration to match seed data
ALTER TABLE lessons RENAME COLUMN duration_minutes TO duration_old;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration TEXT;
UPDATE lessons SET duration = duration_old::TEXT || ' min' WHERE duration IS NULL AND duration_old IS NOT NULL;
ALTER TABLE lessons DROP COLUMN IF EXISTS duration_old;

-- 4. Fix tasks table - add missing columns and update constraints
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'assignment';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'));

-- Update task type constraint to match seed data values
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_task_type_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_task_type_check 
  CHECK (task_type IN ('assignment', 'quiz', 'project', 'discussion', 'file_upload', 'text_response', 'multiple_choice', 'presentation'));

-- Copy task_type to type for compatibility
UPDATE tasks SET type = task_type WHERE type = 'assignment';

-- Remove lesson_id dependency as seed data doesn't use it
ALTER TABLE tasks ALTER COLUMN lesson_id DROP NOT NULL;

-- 5. Fix live_classes table - add missing columns referenced in seed data
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'beginner';
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT 50;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS attendees INTEGER DEFAULT 0;
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS join_url TEXT;

-- Rename scheduled_at columns to match seed data expectations
UPDATE live_classes SET 
  date = scheduled_at::DATE,
  start_time = scheduled_at::TIME
WHERE date IS NULL;

-- Update status constraint to match seed data
ALTER TABLE live_classes DROP CONSTRAINT IF EXISTS live_classes_status_check;
ALTER TABLE live_classes ADD CONSTRAINT live_classes_status_check
  CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled'));

-- Rename meeting_url to join_url for consistency
UPDATE live_classes SET join_url = meeting_url WHERE join_url IS NULL;

-- 6. Fix user_progress table - add missing columns and constraints
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE CASCADE;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS score INTEGER;

-- Rename is_completed to completed for seed data compatibility
UPDATE user_progress SET completed = is_completed WHERE completed IS NULL;

-- Remove unique constraint that conflicts with seed data structure
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_lesson_id_key;

-- Add new unique constraint that matches seed data expectations
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_lesson_unique 
  UNIQUE(user_id, lesson_id);

-- 7. Fix task_submissions table - add missing columns
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Update status constraint to match seed data values
ALTER TABLE task_submissions DROP CONSTRAINT IF EXISTS task_submissions_status_check;
ALTER TABLE task_submissions ADD CONSTRAINT task_submissions_status_check
  CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected', 'pending'));

-- Copy existing columns to new names for compatibility
UPDATE task_submissions SET 
  content = submission_text,
  score = grade,
  submitted_at = COALESCE(submitted_at, NOW())
WHERE content IS NULL;

-- 8. Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules("order");
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons("order");
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(type);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_week_number ON tasks(week_number);
CREATE INDEX IF NOT EXISTS idx_live_classes_date ON live_classes(date);
CREATE INDEX IF NOT EXISTS idx_live_classes_category ON live_classes(category);
CREATE INDEX IF NOT EXISTS idx_live_classes_level ON live_classes(level);
CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_score ON task_submissions(score);

-- 9. Update RLS policies for new columns
-- No changes needed as existing policies cover the new columns

-- 10. Add missing foreign key relationships that seed data expects
-- Remove course_id requirement from live_classes as seed data doesn't use it
ALTER TABLE live_classes ALTER COLUMN course_id DROP NOT NULL; 