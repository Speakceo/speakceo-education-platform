-- 90-Day Young CEO Program Database Schema
-- Complete learning management system for young entrepreneurs

-- Courses table
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

-- Course weeks table
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

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'video', 'pdf', 'ppt', 'interactive'
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

-- Course quizzes table
CREATE TABLE IF NOT EXISTS course_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL, -- Array of quiz questions
  passing_score INTEGER DEFAULT 80,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER DEFAULT 10,
  xp_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course tasks table
CREATE TABLE IF NOT EXISTS course_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  submission_type VARCHAR(50) NOT NULL, -- 'file', 'text', 'video', 'image'
  max_file_size_mb INTEGER DEFAULT 10,
  allowed_file_types TEXT[],
  xp_reward INTEGER DEFAULT 75,
  is_required BOOLEAN DEFAULT true,
  due_days_after_unlock INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User course enrollment
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

-- User lesson progress
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
  last_watched_position INTEGER DEFAULT 0, -- For video lessons
  UNIQUE(user_id, lesson_id)
);

-- User quiz attempts
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

-- User task submissions
CREATE TABLE IF NOT EXISTS user_task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES course_tasks(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_urls TEXT[],
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'needs_revision'
  feedback TEXT,
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  UNIQUE(user_id, task_id)
);

-- Weekly progress summary
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

-- Course achievements and badges
CREATE TABLE IF NOT EXISTS course_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(255),
  badge_color VARCHAR(50),
  xp_reward INTEGER DEFAULT 100,
  criteria JSONB NOT NULL, -- Achievement criteria
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements earned
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES course_achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  week_earned INTEGER,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- AI chat history for lessons
CREATE TABLE IF NOT EXISTS lesson_ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  message_history JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 90-Day Young CEO Program
INSERT INTO courses (id, title, description, duration_weeks, total_xp, target_age_min, target_age_max, course_image) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 '90-Day Young CEO Program', 
 'A comprehensive entrepreneurship journey designed for young minds aged 8-18. Learn business fundamentals, develop leadership skills, and launch your first venture in just 90 days!',
 13, 
 1950, -- Total XP: 13 weeks × 150 XP per week
 8, 
 18,
 '/course-images/young-ceo-program.jpg');

-- Insert all 13 weeks
INSERT INTO course_weeks (course_id, week_number, title, description, learning_objectives, unlock_after_days) VALUES
('550e8400-e29b-41d4-a716-446655440000', 1, 'Discovering Entrepreneurship', 'Learn what entrepreneurship means and explore the mindset of successful entrepreneurs', ARRAY['Understand entrepreneurship basics', 'Identify entrepreneur traits', 'Develop entrepreneurial thinking'], 0),
('550e8400-e29b-41d4-a716-446655440000', 2, 'Idea Generation & Validation', 'Discover how to generate business ideas and validate them with real feedback', ARRAY['Generate creative business ideas', 'Learn validation techniques', 'Practice idea pitching'], 7),
('550e8400-e29b-41d4-a716-446655440000', 3, 'Understanding Business Models', 'Master the Business Model Canvas and design your first business model', ARRAY['Understand business model components', 'Use Business Model Canvas', 'Design your business model'], 14),
('550e8400-e29b-41d4-a716-446655440000', 4, 'Knowing Your Customers', 'Learn to identify, understand, and connect with your target customers', ARRAY['Create customer personas', 'Map customer journey', 'Define target audience'], 21),
('550e8400-e29b-41d4-a716-446655440000', 5, 'Branding Basics', 'Build a strong brand identity that resonates with your audience', ARRAY['Understand branding principles', 'Create brand identity', 'Design logos and taglines'], 28),
('550e8400-e29b-41d4-a716-446655440000', 6, 'Basic Marketing Concepts', 'Explore marketing channels and create your first marketing campaign', ARRAY['Learn marketing fundamentals', 'Use social media effectively', 'Create marketing campaigns'], 35),
('550e8400-e29b-41d4-a716-446655440000', 7, 'Money Matters', 'Understand business finances, profit, and basic accounting principles', ARRAY['Understand profit and loss', 'Learn financial basics', 'Use P&L tools'], 42),
('550e8400-e29b-41d4-a716-446655440000', 8, 'Communication Mastery', 'Develop public speaking skills and master the art of pitching', ARRAY['Improve public speaking', 'Master body language', 'Create elevator pitches'], 49),
('550e8400-e29b-41d4-a716-446655440000', 9, 'Problem Solving & Leadership', 'Build leadership skills and learn creative problem-solving techniques', ARRAY['Develop leadership skills', 'Learn problem-solving', 'Practice decision making'], 56),
('550e8400-e29b-41d4-a716-446655440000', 10, 'Tech for Founders', 'Explore technology tools that modern entrepreneurs use to build businesses', ARRAY['Understand startup tech', 'Learn design basics', 'Explore coding concepts'], 63),
('550e8400-e29b-41d4-a716-446655440000', 11, 'Pitch Practice & Feedback', 'Perfect your pitch and learn to handle investor questions', ARRAY['Master pitch presentations', 'Handle Q&A sessions', 'Get feedback effectively'], 70),
('550e8400-e29b-41d4-a716-446655440000', 12, 'Refine & Prepare to Launch', 'Polish your business idea and prepare for launch', ARRAY['Refine business concept', 'Plan launch strategy', 'Build social proof'], 77),
('550e8400-e29b-41d4-a716-446655440000', 13, 'Launch Week', 'Execute your launch plan and celebrate your entrepreneurial journey', ARRAY['Execute launch plan', 'Share success story', 'Graduate as Young CEO'], 84);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_course_enrollment_user_id ON user_course_enrollment(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_task_submissions_user_id ON user_task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_week_id ON lessons(week_id);
CREATE INDEX IF NOT EXISTS idx_course_weeks_course_id ON course_weeks(course_id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_week_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public courses are viewable by everyone" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public weeks are viewable by everyone" ON course_weeks FOR SELECT USING (is_active = true);
CREATE POLICY "Public lessons are viewable by everyone" ON lessons FOR SELECT USING (is_active = true);
CREATE POLICY "Public quizzes are viewable by everyone" ON course_quizzes FOR SELECT USING (is_active = true);
CREATE POLICY "Public tasks are viewable by everyone" ON course_tasks FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own enrollment" ON user_course_enrollment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollment" ON user_course_enrollment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own enrollment" ON user_course_enrollment FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own lesson progress" ON user_lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own quiz attempts" ON user_quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own task submissions" ON user_task_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own week progress" ON user_week_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can do everything on courses" ON courses FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can do everything on course_weeks" ON course_weeks FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can do everything on lessons" ON lessons FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can do everything on quizzes" ON course_quizzes FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can do everything on tasks" ON course_tasks FOR ALL USING (auth.jwt() ->> 'role' = 'admin'); 