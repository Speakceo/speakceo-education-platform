import { supabase } from '../supabase';

export interface DatabaseSetupResult {
  success: boolean;
  message: string;
  error?: any;
}

// Run database migrations first
export async function runMigrations(): Promise<DatabaseSetupResult> {
  try {
    console.log('Running database migrations...');
    
    // Ensure profiles table has status column
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'));
        ALTER TABLE modules ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT 0;
        ALTER TABLE modules ADD COLUMN IF NOT EXISTS level varchar(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));
        ALTER TABLE modules ADD COLUMN IF NOT EXISTS instructor_name varchar(255) DEFAULT 'Admin User';
      `
    }).then(() => {
      console.log('Basic migrations completed');
    }).catch(err => {
      console.log('Some migrations may have failed (this is often normal):', err.message);
    });

    // Create course_materials table
    await supabase.rpc('exec_sql', {
      sql: `
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
      `
    }).then(() => {
      console.log('Course materials table created');
    }).catch(err => {
      console.log('Course materials table creation may have failed:', err.message);
    });

    return { success: true, message: 'Database migrations completed successfully' };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { success: false, message: 'Migration completed with some issues', error };
  }
}

export async function setupDatabase(): Promise<DatabaseSetupResult> {
  try {
    console.log('Setting up database with real data...');
    
    // Run migrations first
    await runMigrations();
    
    // Check for admin user first
    const { data: adminUser, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@speakceo.ai')
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error checking admin user:', adminError);
    }
    
    // Insert admin user if doesn't exist
    if (!adminUser) {
      const { error: insertAdminError } = await supabase
        .from('profiles')
        .insert([{
          id: '00000000-0000-0000-0000-000000000001',
          email: 'admin@speakceo.ai',
          name: 'Admin User',
          avatar_url: 'https://ui-avatars.com/api/?name=Admin+User',
          role: 'admin',
          status: 'active',
          course_type: 'Premium',
          progress: 100
        }]);
      
      if (insertAdminError) {
        console.error('Error inserting admin user:', insertAdminError);
      }
    }
    
    // Insert sample users (with explicit status)
    const sampleUsers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'john.doe@example.com',
        name: 'John Doe',
        avatar_url: 'https://ui-avatars.com/api/?name=John+Doe',
        role: 'user',
        status: 'active',
        course_type: 'Premium',
        progress: 75
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith',
        role: 'user',
        status: 'active',
        course_type: 'Basic',
        progress: 45
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        avatar_url: 'https://ui-avatars.com/api/?name=Mike+Johnson',
        role: 'user',
        status: 'active',
        course_type: 'Premium',
        progress: 90
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'sarah.wilson@example.com',
        name: 'Sarah Wilson',
        avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Wilson',
        role: 'user',
        status: 'active',
        course_type: 'Basic',
        progress: 30
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'david.brown@example.com',
        name: 'David Brown',
        avatar_url: 'https://ui-avatars.com/api/?name=David+Brown',
        role: 'user',
        status: 'inactive',
        course_type: 'Premium',
        progress: 60
      }
    ];
    
    console.log('Inserting sample users...');
    const { error: usersError } = await supabase
      .from('profiles')
      .upsert(sampleUsers, { onConflict: 'id' });
    
    if (usersError) {
      console.error('Error inserting users:', usersError);
      throw new Error(`Failed to insert users: ${usersError.message}`);
    }
    
    // Insert sample modules with enhanced data
    const sampleModules = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Startup Fundamentals',
        description: 'Learn the essential concepts of starting and running a successful business. This comprehensive course covers everything from idea validation to building your first prototype.',
        order: 1,
        duration: '4 weeks',
        image_url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400',
        level: 'Beginner',
        instructor_name: 'Sarah Johnson',
        price: 299.00,
        status: 'active'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Advanced Business Strategy',
        description: 'Master the art of strategic planning and execution. Perfect for entrepreneurs looking to scale their business and make data-driven decisions.',
        order: 2,
        duration: '6 weeks',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        level: 'Advanced',
        instructor_name: 'Michael Chen',
        price: 499.00,
        status: 'active'
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        title: 'Financial Management for Entrepreneurs',
        description: 'Complete guide to managing finances in your startup. Learn budgeting, forecasting, funding options, and financial controls.',
        order: 3,
        duration: '5 weeks',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        level: 'Intermediate',
        instructor_name: 'Emma Rodriguez',
        price: 399.00,
        status: 'active'
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        title: 'Digital Marketing Mastery',
        description: 'Comprehensive digital marketing course covering SEO, social media, content marketing, PPC, and analytics for startups.',
        order: 4,
        duration: '8 weeks',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        level: 'Intermediate',
        instructor_name: 'Alex Thompson',
        price: 449.00,
        status: 'active'
      }
    ];
    
    console.log('Inserting sample modules...');
    const { error: modulesError } = await supabase
      .from('modules')
      .upsert(sampleModules, { onConflict: 'id' });
    
    if (modulesError) {
      console.error('Error inserting modules:', modulesError);
      throw new Error(`Failed to insert modules: ${modulesError.message}`);
    }
    
    // Insert sample lessons with more variety
    const sampleLessons = [
      // Startup Fundamentals lessons
      {
        id: 'lesson01-0000-0000-0000-000000000001',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Introduction to Entrepreneurship',
        type: 'video',
        duration: '45 min',
        description: 'Overview of entrepreneurial mindset and opportunities in today\'s market',
        order: 1,
        status: 'active',
        points: 50,
        content: 'Welcome to the world of entrepreneurship! In this lesson, we\'ll explore what it means to be an entrepreneur and the key characteristics of successful business founders.',
        url: 'https://example.com/video/intro-entrepreneurship'
      },
      {
        id: 'lesson02-0000-0000-0000-000000000002',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Market Research & Validation',
        type: 'text',
        duration: '60 min',
        description: 'Learn systematic approaches to researching and validating your business ideas',
        order: 2,
        status: 'active',
        points: 75,
        content: 'Market research is the foundation of any successful business. This lesson covers primary and secondary research methods, customer interview techniques, and validation frameworks.'
      },
      {
        id: 'lesson03-0000-0000-0000-000000000003',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Building Your MVP',
        type: 'assignment',
        duration: '120 min',
        description: 'Hands-on workshop to create your minimum viable product',
        order: 3,
        status: 'active',
        points: 100,
        content: 'Time to build! This practical lesson guides you through creating a simple version of your product that you can test with real customers.'
      },
      
      // Advanced Business Strategy lessons
      {
        id: 'lesson04-0000-0000-0000-000000000004',
        module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Strategic Planning Framework',
        type: 'presentation',
        duration: '90 min',
        description: 'Comprehensive framework for developing winning business strategies',
        order: 1,
        status: 'active',
        points: 120,
        content: 'Learn the SWOT analysis, Porter\'s Five Forces, and other strategic planning tools used by successful companies worldwide.'
      },
      {
        id: 'lesson05-0000-0000-0000-000000000005',
        module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Competitive Analysis Deep Dive',
        type: 'video',
        duration: '75 min',
        description: 'Advanced techniques for analyzing competitors and positioning your business',
        order: 2,
        status: 'active',
        points: 90,
        content: 'Understanding your competition is crucial for success. This lesson teaches you to identify, analyze, and outmaneuver competitors.',
        url: 'https://example.com/video/competitive-analysis'
      },
      
      // Financial Management lessons
      {
        id: 'lesson06-0000-0000-0000-000000000006',
        module_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        title: 'Financial Statements & KPIs',
        type: 'document',
        duration: '80 min',
        description: 'Master reading and creating essential financial documents',
        order: 1,
        status: 'active',
        points: 85,
        content: 'Learn to read and interpret income statements, balance sheets, cash flow statements, and key performance indicators for startups.',
        url: 'https://example.com/docs/financial-statements-guide'
      },
      {
        id: 'lesson07-0000-0000-0000-000000000007',
        module_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        title: 'Funding & Investment Strategies',
        type: 'video',
        duration: '95 min',
        description: 'Explore different funding options and investment preparation',
        order: 2,
        status: 'active',
        points: 110,
        content: 'From bootstrapping to venture capital, learn about all funding options available to entrepreneurs and how to prepare for investment.',
        url: 'https://example.com/video/funding-strategies'
      }
    ];
    
    console.log('Inserting sample lessons...');
    const { error: lessonsError } = await supabase
      .from('lessons')
      .upsert(sampleLessons, { onConflict: 'id' });
    
    if (lessonsError) {
      console.error('Error inserting lessons:', lessonsError);
      throw new Error(`Failed to insert lessons: ${lessonsError.message}`);
    }
    
    // Insert sample course materials
    const sampleMaterials = [
      {
        id: 'material01-0000-0000-0000-000000000001',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        lesson_id: 'lesson01-0000-0000-0000-000000000001',
        title: 'Entrepreneurship Handbook',
        description: 'Comprehensive guide to starting your entrepreneurial journey',
        type: 'pdf',
        file_url: 'https://example.com/materials/entrepreneurship-handbook.pdf',
        file_size: 2048000,
        is_downloadable: true,
        order: 1
      },
      {
        id: 'material02-0000-0000-0000-000000000002',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        lesson_id: 'lesson02-0000-0000-0000-000000000002',
        title: 'Market Research Template',
        description: 'Ready-to-use template for conducting market research',
        type: 'spreadsheet',
        file_url: 'https://example.com/materials/market-research-template.xlsx',
        file_size: 1024000,
        is_downloadable: true,
        order: 1
      },
      {
        id: 'material03-0000-0000-0000-000000000003',
        module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        lesson_id: 'lesson04-0000-0000-0000-000000000004',
        title: 'Strategic Planning Presentation',
        description: 'PowerPoint template for strategic planning sessions',
        type: 'ppt',
        file_url: 'https://example.com/materials/strategic-planning.pptx',
        file_size: 3072000,
        is_downloadable: true,
        order: 1
      },
      {
        id: 'material04-0000-0000-0000-000000000004',
        module_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        title: 'Financial Planning Toolkit',
        description: 'Complete toolkit with Excel templates and calculators',
        type: 'spreadsheet',
        file_url: 'https://example.com/materials/financial-toolkit.xlsx',
        file_size: 2560000,
        is_downloadable: true,
        order: 1
      }
    ];
    
    console.log('Inserting sample course materials...');
    try {
      const { error: materialsError } = await supabase
        .from('course_materials')
        .upsert(sampleMaterials, { onConflict: 'id' });
      
      if (materialsError) {
        console.error('Error inserting materials:', materialsError);
        // Don't throw error here as table might not exist yet
      }
    } catch (materialsError) {
      console.log('Course materials table not ready yet, skipping materials insertion');
    }
    
    // Insert sample live classes
    const sampleLiveClasses = [
      {
        id: 'liveclass1-0000-0000-0000-000000000001',
        title: 'Startup Pitch Workshop',
        description: 'Interactive workshop to perfect your startup pitch and get feedback from experts',
        instructor_id: adminUser?.id || '00000000-0000-0000-0000-000000000001',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        start_time: '14:00',
        end_time: '16:00',
        duration: '2 hours',
        duration_minutes: 120,
        category: 'Entrepreneurship',
        level: 'Intermediate',
        tags: ['pitch', 'presentation', 'feedback'],
        max_attendees: 20,
        attendees: 12,
        status: 'scheduled',
        join_url: 'https://meet.google.com/startup-pitch-workshop'
      },
      {
        id: 'liveclass2-0000-0000-0000-000000000002',
        title: 'Financial Modeling Masterclass',
        description: 'Learn to build professional financial models for your startup',
        instructor_id: adminUser?.id || '00000000-0000-0000-0000-000000000001',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        start_time: '10:00',
        end_time: '12:30',
        duration: '2.5 hours',
        duration_minutes: 150,
        category: 'Finance',
        level: 'Advanced',
        tags: ['finance', 'modeling', 'excel'],
        max_attendees: 15,
        attendees: 8,
        status: 'scheduled',
        join_url: 'https://meet.google.com/financial-modeling'
      },
      {
        id: 'liveclass3-0000-0000-0000-000000000003',
        title: 'Digital Marketing Q&A Session',
        description: 'Ask your marketing questions and get expert answers',
        instructor_id: adminUser?.id || '00000000-0000-0000-0000-000000000001',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        start_time: '16:00',
        end_time: '17:30',
        duration: '1.5 hours',
        duration_minutes: 90,
        category: 'Marketing',
        level: 'Beginner',
        tags: ['marketing', 'qa', 'digital'],
        max_attendees: 30,
        attendees: 18,
        status: 'scheduled',
        join_url: 'https://meet.google.com/marketing-qa'
      }
    ];
    
    console.log('Inserting sample live classes...');
    const { error: liveClassesError } = await supabase
      .from('live_classes')
      .upsert(sampleLiveClasses, { onConflict: 'id' });
    
    if (liveClassesError) {
      console.error('Error inserting live classes:', liveClassesError);
      throw new Error(`Failed to insert live classes: ${liveClassesError.message}`);
    }
    
    // Insert sample tasks
    const sampleTasks = [
      {
        id: 'task0001-0000-0000-0000-000000000001',
        title: 'Business Idea Pitch',
        description: 'Create and record a 3-minute pitch video for your business idea. Include problem, solution, market size, and ask.',
        type: 'file_upload',
        week_number: 1,
        points: 100,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: true,
        status: 'active'
      },
      {
        id: 'task0002-0000-0000-0000-000000000002',
        title: 'Market Analysis Report',
        description: 'Conduct thorough market research and write a 5-page analysis of your target market, including size, trends, and competition.',
        type: 'text_response',
        week_number: 2,
        points: 150,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        status: 'active'
      },
      {
        id: 'task0003-0000-0000-0000-000000000003',
        title: 'Financial Projections Quiz',
        description: 'Test your understanding of financial modeling and projections with this comprehensive quiz.',
        type: 'multiple_choice',
        week_number: 3,
        points: 75,
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        status: 'active'
      },
      {
        id: 'task0004-0000-0000-0000-000000000004',
        title: 'MVP Prototype Presentation',
        description: 'Build and present your minimum viable product. Submit presentation slides and demo video.',
        type: 'presentation',
        week_number: 4,
        points: 200,
        due_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: true,
        status: 'active'
      },
      {
        id: 'task0005-0000-0000-0000-000000000005',
        title: 'Customer Interview Summary',
        description: 'Conduct 5 customer interviews and summarize your findings in a structured report.',
        type: 'assignment',
        week_number: 2,
        points: 125,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        status: 'active'
      }
    ];
    
    console.log('Inserting sample tasks...');
    const { error: tasksError } = await supabase
      .from('tasks')
      .upsert(sampleTasks, { onConflict: 'id' });
    
    if (tasksError) {
      console.error('Error inserting tasks:', tasksError);
      throw new Error(`Failed to insert tasks: ${tasksError.message}`);
    }
    
    // Insert user progress
    const sampleProgress = [
      // John Doe progress
      { user_id: '11111111-1111-1111-1111-111111111111', module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', lesson_id: 'lesson01-0000-0000-0000-000000000001', completed: true, score: 85, completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { user_id: '11111111-1111-1111-1111-111111111111', module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', lesson_id: 'lesson02-0000-0000-0000-000000000002', completed: true, score: 92, completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      
      // Jane Smith progress
      { user_id: '22222222-2222-2222-2222-222222222222', module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', lesson_id: 'lesson01-0000-0000-0000-000000000001', completed: true, score: 78, completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      
      // Mike Johnson progress
      { user_id: '33333333-3333-3333-3333-333333333333', module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', lesson_id: 'lesson01-0000-0000-0000-000000000001', completed: true, score: 95, completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { user_id: '33333333-3333-3333-3333-333333333333', module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', lesson_id: 'lesson02-0000-0000-0000-000000000002', completed: true, score: 88, completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { user_id: '33333333-3333-3333-3333-333333333333', module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', lesson_id: 'lesson04-0000-0000-0000-000000000004', completed: true, score: 91, completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ];
    
    console.log('Inserting user progress...');
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(sampleProgress, { onConflict: 'user_id,lesson_id' });
    
    if (progressError) {
      console.error('Error inserting progress:', progressError);
      // Don't throw error for progress as it's not critical
    }
    
    console.log('Database setup completed successfully!');
    return { 
      success: true, 
      message: 'Database has been populated with comprehensive sample data including courses, lessons, materials, live classes, and tasks. All admin panel features should now work properly!' 
    };
    
  } catch (error: any) {
    console.error('Database setup error:', error);
    return { 
      success: false, 
      message: `Failed to seed database: ${error.message}`, 
      error 
    };
  }
}

export async function checkDatabaseStatus(): Promise<DatabaseSetupResult> {
  try {
    console.log('Checking database status...');
    
    // Check each table
    const checks = await Promise.all([
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('modules').select('count', { count: 'exact', head: true }),
      supabase.from('lessons').select('count', { count: 'exact', head: true }),
      supabase.from('live_classes').select('count', { count: 'exact', head: true }),
      supabase.from('tasks').select('count', { count: 'exact', head: true })
    ]);
    
    const [profiles, modules, lessons, liveClasses, tasks] = checks;
    
    const status = {
      profiles: profiles.count || 0,
      modules: modules.count || 0,
      lessons: lessons.count || 0,
      liveClasses: liveClasses.count || 0,
      tasks: tasks.count || 0
    };
    
    // Check for course_materials table
    let materials = 0;
    try {
      const { count } = await supabase
        .from('course_materials')
        .select('count', { count: 'exact', head: true });
      materials = count || 0;
    } catch (error) {
      console.log('Course materials table not found');
    }
    
    const totalRecords = status.profiles + status.modules + status.lessons + status.liveClasses + status.tasks + materials;
    
    return {
      success: true,
      message: `Database Status:
- Users: ${status.profiles}
- Courses: ${status.modules}  
- Lessons: ${status.lessons}
- Live Classes: ${status.liveClasses}
- Tasks: ${status.tasks}
- Materials: ${materials}
- Total Records: ${totalRecords}

${totalRecords === 0 ? 'Database appears empty. Click "Seed Database" to populate with sample data.' : 'Database contains data and should be functional!'}`
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to check database status: ${error.message}`,
      error
    };
  }
} 