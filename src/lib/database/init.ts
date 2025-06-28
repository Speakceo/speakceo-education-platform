import { supabase } from '../supabase';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Check if tables exist by trying to query one
    const { data: existingData, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (!checkError && existingData !== null) {
      console.log('Database already initialized');
      return { success: true, message: 'Database already initialized' };
    }
    
    // If we get here, tables don't exist or there's an issue
    console.log('Setting up database tables and data...');
    
    // Create admin user first using Supabase auth if needed
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'admin@speakceo.ai',
      password: 'Admin123!',
      options: {
        data: {
          name: 'Admin User',
          role: 'admin'
        }
      }
    });
    
    if (authError && !authError.message.includes('already registered')) {
      console.error('Error creating admin user:', authError);
    }
    
    // Since we can't run DDL directly through Supabase client,
    // we'll create the initial data that the components expect
    
    // Check if we can insert sample data
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
      }
    ];
    
    // Try to insert sample users
    const { error: usersError } = await supabase
      .from('profiles')
      .upsert(sampleUsers, { onConflict: 'id' });
    
    if (usersError) {
      console.error('Error inserting sample users:', usersError);
    } else {
      console.log('Sample users inserted successfully');
    }
    
    // Insert sample modules
    const sampleModules = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Startup Fundamentals',
        description: 'Learn the essential concepts of starting and running a successful business',
        order: 1,
        duration: '2 weeks',
        image_url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400',
        status: 'active'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Business Planning',
        description: 'Create comprehensive business plans and strategies',
        order: 2,
        duration: '3 weeks',
        image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        status: 'active'
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        title: 'Financial Management',
        description: 'Master financial planning and management for entrepreneurs',
        order: 3,
        duration: '2 weeks',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        status: 'active'
      }
    ];
    
    const { error: modulesError } = await supabase
      .from('modules')
      .upsert(sampleModules, { onConflict: 'id' });
    
    if (modulesError) {
      console.error('Error inserting sample modules:', modulesError);
    } else {
      console.log('Sample modules inserted successfully');
    }
    
    // Insert sample lessons
    const sampleLessons = [
      {
        id: 'lesson01-0000-0000-0000-000000000001',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Introduction to Entrepreneurship',
        type: 'video',
        duration: '45 min',
        description: 'Overview of entrepreneurial mindset and opportunities',
        order: 1,
        status: 'active',
        points: 50,
        content: 'This lesson covers the fundamental concepts of entrepreneurship...'
      },
      {
        id: 'lesson02-0000-0000-0000-000000000002',
        module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Identifying Market Opportunities',
        type: 'text',
        duration: '30 min',
        description: 'Learn how to spot and evaluate business opportunities',
        order: 2,
        status: 'active',
        points: 75,
        content: 'Market research and opportunity identification techniques...'
      },
      {
        id: 'lesson03-0000-0000-0000-000000000003',
        module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Writing a Business Plan',
        type: 'document',
        duration: '90 min',
        description: 'Step-by-step guide to creating effective business plans',
        order: 1,
        status: 'active',
        points: 100,
        content: 'Business plan components and best practices...'
      }
    ];
    
    const { error: lessonsError } = await supabase
      .from('lessons')
      .upsert(sampleLessons, { onConflict: 'id' });
    
    if (lessonsError) {
      console.error('Error inserting sample lessons:', lessonsError);
    } else {
      console.log('Sample lessons inserted successfully');
    }
    
    // Insert sample live classes
    const sampleLiveClasses = [
      {
        id: 'liveclass1-0000-0000-0000-000000000001',
        title: 'Business Strategy Masterclass',
        description: 'Learn the fundamentals of building a successful business strategy',
        instructor_id: '00000000-0000-0000-0000-000000000001',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        start_time: '14:00',
        end_time: '15:30',
        duration: '1 hour 30 minutes',
        duration_minutes: 90,
        category: 'Business Strategy',
        level: 'Intermediate',
        tags: ['strategy', 'planning', 'business'],
        max_attendees: 30,
        attendees: 8,
        status: 'scheduled',
        join_url: 'https://meet.example.com/business-strategy'
      },
      {
        id: 'liveclass2-0000-0000-0000-000000000002',
        title: 'Financial Planning Workshop',
        description: 'Master the art of financial planning for entrepreneurs',
        instructor_id: '00000000-0000-0000-0000-000000000001',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        start_time: '10:00',
        end_time: '12:00',
        duration: '2 hours',
        duration_minutes: 120,
        category: 'Finance',
        level: 'Beginner',
        tags: ['finance', 'planning', 'budgeting'],
        max_attendees: 25,
        attendees: 15,
        status: 'scheduled',
        join_url: 'https://meet.example.com/financial-planning'
      }
    ];
    
    const { error: liveClassesError } = await supabase
      .from('live_classes')
      .upsert(sampleLiveClasses, { onConflict: 'id' });
    
    if (liveClassesError) {
      console.error('Error inserting sample live classes:', liveClassesError);
    } else {
      console.log('Sample live classes inserted successfully');
    }
    
    // Insert sample tasks
    const sampleTasks = [
      {
        id: 'task0001-0000-0000-0000-000000000001',
        title: 'Business Idea Validation',
        description: 'Research and validate your business idea using customer interviews and market analysis',
        type: 'assignment',
        week_number: 1,
        points: 100,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: true,
        status: 'active'
      },
      {
        id: 'task0002-0000-0000-0000-000000000002',
        title: 'Create Your Business Model Canvas',
        description: 'Develop a comprehensive business model canvas for your startup idea',
        type: 'file_upload',
        week_number: 2,
        points: 150,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        status: 'active'
      },
      {
        id: 'task0003-0000-0000-0000-000000000003',
        title: 'Financial Projections Quiz',
        description: 'Test your understanding of financial projections and forecasting',
        type: 'multiple_choice',
        week_number: 3,
        points: 75,
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        live_discussion: false,
        status: 'active'
      }
    ];
    
    const { error: tasksError } = await supabase
      .from('tasks')
      .upsert(sampleTasks, { onConflict: 'id' });
    
    if (tasksError) {
      console.error('Error inserting sample tasks:', tasksError);
    } else {
      console.log('Sample tasks inserted successfully');
    }
    
    console.log('Database initialization completed successfully');
    return { success: true, message: 'Database initialized with sample data' };
    
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, message: 'Failed to initialize database', error };
  }
}

export async function checkDatabaseHealth() {
  try {
    // Test each table
    const tables = ['profiles', 'modules', 'lessons', 'live_classes', 'tasks'];
    const results: Record<string, any> = {};
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          results[table] = { status: 'error', error: error.message };
        } else {
          results[table] = { status: 'ok', count };
        }
      } catch (err) {
        results[table] = { status: 'error', error: 'Table not accessible' };
      }
    }
    
    return { success: true, tables: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
} 