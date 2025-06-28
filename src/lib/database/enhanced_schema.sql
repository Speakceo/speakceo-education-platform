-- Enhanced Database Schema with Document Management
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

-- Modules table (courses)
CREATE TABLE IF NOT EXISTS modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255) NOT NULL,
    description text,
    "order" integer NOT NULL DEFAULT 0,
    duration varchar(100),
    image_url text,
    price decimal(10,2) DEFAULT 0,
    level varchar(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    instructor_name varchar(255) DEFAULT 'Admin User',
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    type varchar(50) NOT NULL DEFAULT 'text' CHECK (type IN ('video', 'text', 'quiz', 'assignment', 'document', 'presentation', 'spreadsheet')),
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

-- Course materials/documents table
CREATE TABLE IF NOT EXISTS course_materials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description text,
    type varchar(50) NOT NULL CHECK (type IN ('pdf', 'ppt', 'doc', 'video', 'audio', 'image', 'link', 'spreadsheet', 'zip')),
    file_url text NOT NULL,
    file_size bigint DEFAULT 0,
    download_count integer DEFAULT 0,
    is_downloadable boolean DEFAULT true,
    "order" integer DEFAULT 0,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
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
    type varchar(50) NOT NULL DEFAULT 'text' CHECK (type IN ('text_response', 'file_upload', 'multiple_choice', 'essay', 'presentation', 'assignment')),
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
    file_name varchar(255),
    file_type varchar(50),
    status varchar(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'approved', 'rejected')),
    score integer DEFAULT 0,
    feedback text,
    submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, task_id)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone,
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    certificate_issued boolean DEFAULT false,
    certificate_url text,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, module_id)
);

-- File uploads table for general file management
CREATE TABLE IF NOT EXISTS file_uploads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name varchar(255) NOT NULL,
    file_name varchar(255) NOT NULL,
    file_path text NOT NULL,
    file_size bigint NOT NULL,
    file_type varchar(100) NOT NULL,
    mime_type varchar(100),
    uploaded_by uuid REFERENCES profiles(id),
    entity_type varchar(50), -- 'course', 'lesson', 'task', 'user_submission', etc.
    entity_id uuid,
    is_public boolean DEFAULT false,
    download_count integer DEFAULT 0,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
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

-- Course categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(100) NOT NULL UNIQUE,
    description text,
    color varchar(7) DEFAULT '#3B82F6', -- hex color code
    icon varchar(50),
    "order" integer DEFAULT 0,
    status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Course category assignments
CREATE TABLE IF NOT EXISTS module_categories (
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    category_id uuid REFERENCES course_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (module_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules("order");
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons("order");
CREATE INDEX IF NOT EXISTS idx_course_materials_module_id ON course_materials(module_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_lesson_id ON course_materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_date ON live_classes(date);
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON live_classes(status);
CREATE INDEX IF NOT EXISTS idx_tasks_week_number ON tasks(week_number);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_user_id ON task_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_module_id ON course_enrollments(module_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
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
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_modules ON modules;
CREATE TRIGGER set_timestamp_modules BEFORE UPDATE ON modules FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_lessons ON lessons;
CREATE TRIGGER set_timestamp_lessons BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_course_materials ON course_materials;
CREATE TRIGGER set_timestamp_course_materials BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_live_classes ON live_classes;
CREATE TRIGGER set_timestamp_live_classes BEFORE UPDATE ON live_classes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_tasks ON tasks;
CREATE TRIGGER set_timestamp_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_user_progress ON user_progress;
CREATE TRIGGER set_timestamp_user_progress BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_task_submissions ON task_submissions;
CREATE TRIGGER set_timestamp_task_submissions BEFORE UPDATE ON task_submissions FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_course_enrollments ON course_enrollments;
CREATE TRIGGER set_timestamp_course_enrollments BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_file_uploads ON file_uploads;
CREATE TRIGGER set_timestamp_file_uploads BEFORE UPDATE ON file_uploads FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_course_categories ON course_categories;
CREATE TRIGGER set_timestamp_course_categories BEFORE UPDATE ON course_categories FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Insert default course categories
INSERT INTO course_categories (id, name, description, color, icon, "order") VALUES
('cat-business-0000-0000-0000-000000000001', 'Business Strategy', 'Strategic planning and business development courses', '#3B82F6', 'briefcase', 1),
('cat-finance-0000-0000-0000-000000000002', 'Finance & Accounting', 'Financial management and accounting fundamentals', '#10B981', 'dollar-sign', 2),
('cat-marketing-0000-0000-0000-000000000003', 'Marketing & Sales', 'Digital marketing and sales strategy courses', '#F59E0B', 'trending-up', 3),
('cat-technology-0000-0000-0000-000000000004', 'Technology & Innovation', 'Tech entrepreneurship and innovation courses', '#8B5CF6', 'cpu', 4),
('cat-leadership-0000-0000-0000-000000000005', 'Leadership & Management', 'Team leadership and management skills', '#EF4444', 'users', 5)
ON CONFLICT (id) DO NOTHING; 