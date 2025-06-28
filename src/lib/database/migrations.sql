-- Migrations script created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure profiles table has status column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));

-- Add missing columns to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT 0;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS level varchar(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));
ALTER TABLE modules ADD COLUMN IF NOT EXISTS instructor_name varchar(255) DEFAULT 'Admin User';

-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description text,
    type varchar(50) NOT NULL,
    file_url text NOT NULL,
    file_size bigint DEFAULT 0,
    download_count integer DEFAULT 0,
    is_downloadable boolean DEFAULT true,
    "order" integer DEFAULT 0,
    status varchar(20) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create file_uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name varchar(255) NOT NULL,
    file_name varchar(255) NOT NULL,
    file_path text NOT NULL,
    file_size bigint NOT NULL,
    file_type varchar(100) NOT NULL,
    mime_type varchar(100),
    uploaded_by uuid REFERENCES profiles(id),
    entity_type varchar(50),
    entity_id uuid,
    is_public boolean DEFAULT false,
    download_count integer DEFAULT 0,
    status varchar(20) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone,
    progress_percentage integer DEFAULT 0,
    certificate_issued boolean DEFAULT false,
    certificate_url text,
    status varchar(20) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, module_id)
);

-- Add task_submissions enhancements
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS file_name varchar(255);
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS file_type varchar(50);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_materials_module_id ON course_materials(module_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_lesson_id ON course_materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);

-- Create function for course materials table
CREATE OR REPLACE FUNCTION create_course_materials_table()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Course materials table ready';
END;
$$ LANGUAGE plpgsql;
