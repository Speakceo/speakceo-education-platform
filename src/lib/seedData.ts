import { supabase } from './supabase';

// Sample module data
const modules = [
  {
    id: '1',
    title: 'Entrepreneurial Mindset',
    description: 'Learn the foundations of entrepreneurial thinking and problem-solving.',
    order: 1,
    duration: '2 weeks',
    image_url: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    status: 'published'
  },
  {
    id: '2',
    title: 'Business Fundamentals',
    description: 'Master the core concepts that drive successful businesses.',
    order: 2,
    duration: '3 weeks',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    status: 'published'
  },
  {
    id: '3',
    title: 'Public Speaking & Presentation',
    description: 'Develop confidence and skills to communicate your ideas effectively.',
    order: 3,
    duration: '2 weeks',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    status: 'published'
  }
];

// Sample lesson data
const lessons = [
  // Module 1 Lessons
  {
    id: '101',
    module_id: '1',
    title: 'Introduction to Entrepreneurship',
    description: 'What it means to be an entrepreneur in today\'s world.',
    type: 'video',
    duration: '30 minutes',
    order: 1,
    points: 10,
    status: 'published',
    content: 'This is a sample content for the introduction lesson.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '102',
    module_id: '1',
    title: 'Growth Mindset vs Fixed Mindset',
    description: 'Understanding the psychology of success and failure.',
    type: 'document',
    duration: '45 minutes',
    order: 2,
    points: 15,
    status: 'published',
    content: 'This is a sample content about growth mindset and fixed mindset.',
    url: null
  },
  {
    id: '103',
    module_id: '1',
    title: 'Problem Identification Workshop',
    description: 'Learn to spot opportunities in everyday problems.',
    type: 'assignment',
    duration: '60 minutes',
    order: 3,
    points: 20,
    status: 'published',
    content: null,
    url: 'https://docs.google.com/document/d/example'
  },
  
  // Module 2 Lessons
  {
    id: '201',
    module_id: '2',
    title: 'Business Model Canvas',
    description: 'A strategic tool to visualize business components.',
    type: 'video',
    duration: '35 minutes',
    order: 1,
    points: 10,
    status: 'published',
    content: null,
    url: 'https://www.youtube.com/watch?v=QoAOzMTLP5s'
  },
  {
    id: '202',
    module_id: '2',
    title: 'Customer Segments & Value Proposition',
    description: 'Understanding who your customers are and what they need.',
    type: 'document',
    duration: '40 minutes',
    order: 2,
    points: 15,
    status: 'published',
    content: 'Sample content about customer segments and value propositions.',
    url: null
  },
  {
    id: '203',
    module_id: '2',
    title: 'Revenue Streams & Cost Structure',
    description: 'How to make money and manage expenses.',
    type: 'video',
    duration: '50 minutes',
    order: 3,
    points: 15,
    status: 'published',
    content: null,
    url: 'https://www.youtube.com/watch?v=VfgmIEBZG3A'
  },
  
  // Module 3 Lessons
  {
    id: '301',
    module_id: '3',
    title: 'Overcoming Stage Fright',
    description: 'Techniques to manage nerves and build confidence.',
    type: 'video',
    duration: '25 minutes',
    order: 1,
    points: 10,
    status: 'published',
    content: null,
    url: 'https://www.youtube.com/watch?v=Q5itAPzPPbU'
  },
  {
    id: '302',
    module_id: '3',
    title: 'Crafting Your Story',
    description: 'Using storytelling to engage your audience.',
    type: 'document',
    duration: '35 minutes',
    order: 2,
    points: 15,
    status: 'published',
    content: 'Sample content about crafting your story and engaging your audience.',
    url: null
  },
  {
    id: '303',
    module_id: '3',
    title: 'Practice Pitch Session',
    description: 'Record and review your first business pitch.',
    type: 'assignment',
    duration: '60 minutes',
    order: 3,
    points: 25,
    status: 'published',
    content: null,
    url: 'https://docs.google.com/document/d/example-pitch'
  }
];

export async function seedModulesAndLessons() {
  try {
    // Check if modules table exists, create it if it doesn't
    const { error: modulesTableError } = await supabase.from('modules').select('id').limit(1);
    
    if (modulesTableError && modulesTableError.code === '42P01') {
      console.log('Creating modules table...');
      await createTablesIfNeeded();
    }
    
    // Insert modules
    console.log('Inserting modules...');
    const { error: modulesError } = await supabase.from('modules').upsert(modules);
    if (modulesError) throw modulesError;
    
    // Insert lessons
    console.log('Inserting lessons...');
    const { error: lessonsError } = await supabase.from('lessons').upsert(lessons);
    if (lessonsError) throw lessonsError;
    
    console.log('Seed data inserted successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
}

export async function createTablesIfNeeded() {
  try {
    console.log('Creating tables if needed...');
    
    // Create modules table if it doesn't exist
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.modules (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          order INTEGER,
          duration TEXT,
          image_url TEXT,
          status TEXT DEFAULT 'draft',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create lessons table if it doesn't exist
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.lessons (
          id TEXT PRIMARY KEY,
          module_id TEXT REFERENCES public.modules(id),
          title TEXT NOT NULL,
          description TEXT,
          type TEXT,
          duration TEXT,
          order INTEGER,
          points INTEGER DEFAULT 0,
          status TEXT DEFAULT 'draft',
          content TEXT,
          url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    // Create user_progress table if it doesn't exist
    await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          completed_lessons JSONB DEFAULT '{}',
          completed_tasks JSONB DEFAULT '{}',
          streak INTEGER DEFAULT 0,
          total_points INTEGER DEFAULT 0,
          last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `
    });

    // Also check if the 'points' column exists in the lessons table, add it if not
    await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'lessons' AND column_name = 'points'
          ) THEN
            ALTER TABLE public.lessons ADD COLUMN points INTEGER DEFAULT 0;
          END IF;
        END
        $$;
      `
    });
    
    console.log('Tables created successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, error };
  }
}

// Function to reset and restore course data
export async function resetAndRestoreCourseData() {
  try {
    console.log('Starting course data reset and restore process...');
    
    // Step 1: Check if tables exist, create them if they don't
    const tablesResult = await createTablesIfNeeded();
    if (!tablesResult.success) {
      throw new Error('Failed to create required tables');
    }
    
    // Step 2: Clear existing data if present
    console.log('Clearing existing course data...');
    // Delete lessons first due to foreign key constraints
    await supabase.rpc('execute_sql', {
      sql_query: `
        DELETE FROM public.lessons;
      `
    });
    
    // Then delete modules
    await supabase.rpc('execute_sql', {
      sql_query: `
        DELETE FROM public.modules;
      `
    });
    
    // Step 3: Insert modules with proper structure
    console.log('Adding modules...');
    const { error: modulesError } = await supabase
      .from('modules')
      .upsert(modules);
    
    if (modulesError) {
      console.error('Error inserting modules:', modulesError);
      throw modulesError;
    }
    
    // Step 4: Insert lessons with proper structure
    console.log('Adding lessons...');
    const { error: lessonsError } = await supabase
      .from('lessons')
      .upsert(lessons);
    
    if (lessonsError) {
      console.error('Error inserting lessons:', lessonsError);
      throw lessonsError;
    }
    
    // Step 5: Verify data was inserted correctly
    const { data: moduleCount, error: countError } = await supabase
      .from('modules')
      .select('id', { count: 'exact' });
    
    if (countError) {
      console.error('Error verifying data insertion:', countError);
      throw countError;
    }
    
    console.log(`Successfully restored course data. Modules: ${moduleCount?.length || 0}`);
    return { 
      success: true, 
      moduleCount: moduleCount?.length || 0 
    };
  } catch (error) {
    console.error('Error resetting and restoring course data:', error);
    return { success: false, error };
  }
} 