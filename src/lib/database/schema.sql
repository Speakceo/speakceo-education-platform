-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (users)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email varchar(255) UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    avatar_url text,
    role varchar(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    course_type varchar(20) DEFAULT 'Basic' CHECK (course_type IN ('Basic', 'Premium')),
    progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255) NOT NULL,
    description text,
    "order" integer NOT NULL DEFAULT 0,
    duration varchar(100),
    image_url text,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    type varchar(50) NOT NULL DEFAULT 'text',
    duration varchar(100),
    description text,
    "order" integer NOT NULL DEFAULT 0,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    points integer DEFAULT 0,
    content text,
    url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Live classes table
CREATE TABLE IF NOT EXISTS live_classes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255) NOT NULL,
    description text,
    instructor_id uuid REFERENCES profiles(id),
    date timestamp with time zone NOT NULL,
    start_time varchar(10) NOT NULL,
    end_time varchar(10) NOT NULL,
    duration varchar(100),
    duration_minutes integer DEFAULT 60,
    category varchar(100),
    level varchar(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    tags text[] DEFAULT '{}',
    max_attendees integer DEFAULT 30,
    attendees integer DEFAULT 0,
    status varchar(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    join_url text,
    recording_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255) NOT NULL,
    description text,
    type varchar(50) NOT NULL DEFAULT 'text',
    week_number integer NOT NULL CHECK (week_number >= 1 AND week_number <= 12),
    points integer DEFAULT 0,
    due_date timestamp with time zone,
    live_discussion boolean DEFAULT false,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    completed boolean DEFAULT false,
    score integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- Task submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
    content text,
    file_url text,
    status varchar(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected')),
    score integer DEFAULT 0,
    feedback text,
    submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, task_id)
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id uuid REFERENCES profiles(id),
    action_type varchar(50) NOT NULL,
    resource_type varchar(50) NOT NULL,
    resource_id uuid NOT NULL,
    details jsonb,
    timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules("order");
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons("order");
CREATE INDEX IF NOT EXISTS idx_live_classes_date ON live_classes(date);
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON live_classes(status);
CREATE INDEX IF NOT EXISTS idx_tasks_week_number ON tasks(week_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_id ON task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_modules BEFORE UPDATE ON modules FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_lessons BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_live_classes BEFORE UPDATE ON live_classes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_user_progress BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_task_submissions BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp(); 