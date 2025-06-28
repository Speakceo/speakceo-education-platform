-- 90-Day Young CEO Program Database Schema
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INTEGER DEFAULT 13,
  total_xp INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target_age_min INTEGER DEFAULT 8,
  target_age_max INTEGER DEFAULT 18,
  difficulty_level VARCHAR(50) DEFAULT 'beginner',
  course_image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  learning_objectives TEXT[],
  week_xp INTEGER DEFAULT 150,
  unlock_after_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, week_number)
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL,
  video_url VARCHAR(500),
  pdf_path VARCHAR(500),
  ppt_path VARCHAR(500),
  content_html TEXT,
  duration_minutes INTEGER DEFAULT 10,
  xp_reward INTEGER DEFAULT 25,
  unlock_after_lesson UUID REFERENCES lessons(id),
  is_active BOOLEAN DEFAULT true,
  has_ai_assistant BOOLEAN DEFAULT true,
  ai_assistant_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(week_id, lesson_number)
);

CREATE TABLE IF NOT EXISTS course_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  passing_score INTEGER DEFAULT 80,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER DEFAULT 10,
  xp_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  submission_type VARCHAR(50) NOT NULL,
  max_file_size_mb INTEGER DEFAULT 10,
  allowed_file_types TEXT[],
  xp_reward INTEGER DEFAULT 75,
  is_required BOOLEAN DEFAULT true,
  due_days_after_unlock INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_course_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_week INTEGER DEFAULT 1,
  total_xp_earned INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  xp_earned INTEGER DEFAULT 0,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  last_watched_position INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES course_quizzes(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  time_taken_minutes INTEGER,
  passed BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS user_task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES course_tasks(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_urls TEXT[],
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'submitted',
  feedback TEXT,
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  UNIQUE(user_id, task_id)
);

CREATE TABLE IF NOT EXISTS user_week_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  lessons_completed INTEGER DEFAULT 0,
  lessons_total INTEGER DEFAULT 5,
  quiz_completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  task_submitted BOOLEAN DEFAULT false,
  task_approved BOOLEAN DEFAULT false,
  week_xp_earned INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, week_id)
);

-- Insert the 90-Day Young CEO Program
INSERT INTO courses (id, title, description, duration_weeks, total_xp, target_age_min, target_age_max, course_image) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 '90-Day Young CEO Program', 
 'A comprehensive entrepreneurship journey designed for young minds aged 8-18. Learn business fundamentals, develop leadership skills, and launch your first venture in just 90 days!',
 13, 
 1950,
 8, 
 18,
 '/course-images/young-ceo-program.jpg'); 