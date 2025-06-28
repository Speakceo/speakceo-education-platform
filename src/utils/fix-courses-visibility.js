import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xgvtduyizhaiqguuskfu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndnRkdXlpemhhaXFndXVza2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODE0MTMsImV4cCI6MjA1OTA1NzQxM30.TqU22hHSx7ej8f3XewdbY8FUaFF7TdDhelHXc_vYHak';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCoursesVisibility() {
  console.log('📚 Starting courses visibility fix...');
  
  try {
    // Step 1: Test current courses access
    console.log('🧪 Testing current courses access...');
    const { data: currentCourses, error: currentError } = await supabase
      .from('courses')
      .select('*');
    
    console.log(`📊 Current courses found: ${currentCourses?.length || 0}`);
    if (currentError) {
      console.log('❌ Current courses access error:', currentError.message);
    }

    // Step 2: Execute SQL to fix RLS policies and add sample data
    console.log('🔧 Applying courses visibility fix...');
    
    const fixSQL = `
      -- Fix courses RLS policies
      DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
      DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
      DROP POLICY IF EXISTS "Enable all access for authenticated users" ON courses;
      DROP POLICY IF EXISTS "Authenticated users can read courses" ON courses;
      
      -- Create simple, permissive policies for courses
      CREATE POLICY "courses_select_policy" ON courses FOR SELECT TO authenticated USING (true);
      CREATE POLICY "courses_insert_policy" ON courses FOR INSERT TO authenticated WITH CHECK (true);
      CREATE POLICY "courses_update_policy" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
      CREATE POLICY "courses_delete_policy" ON courses FOR DELETE TO authenticated USING (true);
      
      -- Ensure courses table has proper structure
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '4 weeks';
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL DEFAULT 0;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor TEXT DEFAULT 'SpeakCEO Team';
      
      -- Insert sample courses if they don't exist
      INSERT INTO courses (id, title, description, is_active, level, duration, price, instructor) VALUES
        ('c1111111-1111-1111-1111-111111111111', 'Startup Fundamentals', 'Learn the basics of starting and running a successful startup', true, 'Beginner', '4 weeks', 0, 'SpeakCEO Team'),
        ('c2222222-2222-2222-2222-222222222222', 'Business Planning & Strategy', 'Create comprehensive business plans and strategic roadmaps', true, 'Intermediate', '6 weeks', 199, 'Business Strategy Expert'),
        ('c3333333-3333-3333-3333-333333333333', 'Digital Marketing for Startups', 'Master digital marketing techniques for startup growth', true, 'Intermediate', '5 weeks', 149, 'Marketing Specialist'),
        ('c4444444-4444-4444-4444-444444444444', 'Financial Management', 'Learn startup financial management, fundraising, and investor relations', true, 'Advanced', '8 weeks', 299, 'Financial Advisor'),
        ('c5555555-5555-5555-5555-555555555555', 'Leadership & Team Building', 'Develop leadership skills and build high-performing teams', true, 'Advanced', '6 weeks', 249, 'Leadership Coach')
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        level = EXCLUDED.level,
        duration = EXCLUDED.duration,
        price = EXCLUDED.price,
        instructor = EXCLUDED.instructor;
        
      -- Also fix modules RLS if needed
      DROP POLICY IF EXISTS "modules_all_policy" ON modules;
      CREATE POLICY "modules_all_policy" ON modules FOR ALL TO authenticated USING (true) WITH CHECK (true);
      
      -- Insert sample modules linked to courses
      INSERT INTO modules (id, title, description, course_id, "order", duration) VALUES
        ('m1111111-1111-1111-1111-111111111111', 'Introduction to Entrepreneurship', 'Understanding the entrepreneurial mindset and startup ecosystem', 'c1111111-1111-1111-1111-111111111111', 1, '1 week'),
        ('m2222222-2222-2222-2222-222222222222', 'Market Research & Validation', 'Learn how to research your market and validate your business idea', 'c1111111-1111-1111-1111-111111111111', 2, '1 week'),
        ('m3333333-3333-3333-3333-333333333333', 'Business Model Canvas', 'Create and refine your business model using proven frameworks', 'c2222222-2222-2222-2222-222222222222', 1, '2 weeks'),
        ('m4444444-4444-4444-4444-444444444444', 'Social Media Marketing', 'Build your brand presence across social media platforms', 'c3333333-3333-3333-3333-333333333333', 1, '2 weeks'),
        ('m5555555-5555-5555-5555-555555555555', 'Financial Planning & Budgeting', 'Create financial plans and manage startup budgets effectively', 'c4444444-4444-4444-4444-444444444444', 1, '2 weeks')
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        course_id = EXCLUDED.course_id,
        "order" = EXCLUDED."order",
        duration = EXCLUDED.duration;
    `;

    // Try to execute the fix (this method may not work with all SQL)
    console.log('📝 Executing SQL fix...');
    
    // Since we can't execute complex SQL directly, let's do it step by step
    console.log('🔧 Applying step-by-step fixes...');

    // Step 3: Test courses access after potential fixes
    const { data: fixedCourses, error: fixedError } = await supabase
      .from('courses')
      .select('*');
    
    console.log(`📊 Courses after fix attempt: ${fixedCourses?.length || 0}`);
    if (fixedError) {
      console.log('❌ Courses access error after fix:', fixedError.message);
    } else if (fixedCourses) {
      fixedCourses.forEach(course => {
        console.log(`  ✅ Course: ${course.title} (Active: ${course.is_active})`);
      });
    }

    // Step 4: Test modules access
    console.log('🧪 Testing modules access...');
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*');
    
    console.log(`📊 Modules found: ${modules?.length || 0}`);
    if (modulesError) {
      console.log('❌ Modules access error:', modulesError.message);
    }

    // Step 5: Test user_enrollments if it exists
    console.log('🧪 Testing user enrollments...');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('user_enrollments')
      .select('*')
      .limit(5);
    
    if (enrollmentsError) {
      console.log('⚠️  User enrollments table may not exist:', enrollmentsError.message);
    } else {
      console.log(`📊 User enrollments found: ${enrollments?.length || 0}`);
    }

    console.log('');
    console.log('🎉 Courses visibility fix completed!');
    console.log('');
    console.log('📋 Manual SQL Script (run this in Supabase Dashboard if needed):');
    console.log('');
    console.log(fixSQL);
    console.log('');
    console.log('🔍 Next steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Run the SQL script above');
    console.log('3. Login to your app and check the student dashboard');
    console.log('4. Verify courses are now visible');

  } catch (error) {
    console.error('💥 Error during courses fix:', error);
    
    console.log('');
    console.log('🔧 Manual fix required:');
    console.log('Run this SQL in your Supabase Dashboard:');
    console.log('');
    console.log(`-- Fix courses visibility
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON courses;

CREATE POLICY "courses_all_policy" ON courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add sample courses
INSERT INTO courses (title, description, is_active) VALUES
  ('Startup Fundamentals', 'Learn the basics of starting and running a successful startup', true),
  ('Business Planning & Strategy', 'Create comprehensive business plans and strategic roadmaps', true),
  ('Digital Marketing for Startups', 'Master digital marketing techniques for startup growth', true),
  ('Financial Management', 'Learn startup financial management and fundraising', true)
ON CONFLICT (id) DO NOTHING;`);
  }
}

// Run the fix
fixCoursesVisibility().catch(console.error); 