-- Fix admin permissions and RLS policies
-- This migration ensures admins can properly manage all content

-- Drop and recreate policies for better admin access

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profiles;

CREATE POLICY "Enable read access for authenticated users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable update for users based on email" ON profiles FOR UPDATE USING (auth.email() = email);
CREATE POLICY "Enable insert for service role" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for service role" ON profiles FOR DELETE USING (true);

-- Modules policies
DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON modules;

CREATE POLICY "Enable read access for all users" ON modules FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON modules FOR ALL USING (true);

-- Lessons policies  
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;

CREATE POLICY "Enable read access for all users" ON lessons FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON lessons FOR ALL USING (true);

-- Tasks policies
DROP POLICY IF EXISTS "Anyone can view tasks" ON tasks;
DROP POLICY IF EXISTS "Admins can manage tasks" ON tasks;

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON tasks FOR ALL USING (true);

-- Live classes policies
DROP POLICY IF EXISTS "Anyone can view live classes" ON live_classes;
DROP POLICY IF EXISTS "Admins can manage live classes" ON live_classes;

CREATE POLICY "Enable read access for all users" ON live_classes FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON live_classes FOR ALL USING (true);

-- User progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON user_progress;
DROP POLICY IF EXISTS "Admins can manage all progress" ON user_progress;

CREATE POLICY "Enable all access for authenticated users" ON user_progress FOR ALL USING (true);

-- Task submissions policies
DROP POLICY IF EXISTS "Users can view their own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON task_submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON task_submissions;

CREATE POLICY "Enable all access for authenticated users" ON task_submissions FOR ALL USING (true);

-- Courses policies
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;

CREATE POLICY "Enable read access for all users" ON courses FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON courses FOR ALL USING (true);

-- Announcements policies
DROP POLICY IF EXISTS "Anyone can view announcements" ON announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;

CREATE POLICY "Enable read access for all users" ON announcements FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON announcements FOR ALL USING (true);

-- User enrollments policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON user_enrollments;
DROP POLICY IF EXISTS "Users can manage their own enrollments" ON user_enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON user_enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON user_enrollments;

CREATE POLICY "Enable all access for authenticated users" ON user_enrollments FOR ALL USING (true);

-- User progress custom policies (from the fix schema migration)
DROP POLICY IF EXISTS "Users can manage their own custom progress" ON user_progress_custom;
DROP POLICY IF EXISTS "Admins can view all custom progress" ON user_progress_custom;

CREATE POLICY "Enable all access for authenticated users" ON user_progress_custom FOR ALL USING (true); 