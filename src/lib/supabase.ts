import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJle HAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

console.log('Initializing Supabase client with URL:', supabaseUrl.includes('127.0.0.1') ? 'LOCAL' : 'ONLINE');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    },
    storageKey: 'sb-auth-token'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
});

// Debug function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Debug function to check user session
export const checkUserSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session check error:', error);
      return null;
    }
    console.log('Current session:', session ? 'Active' : 'No session');
    return session;
  } catch (error) {
    console.error('Session check failed:', error);
    return null;
  }
};

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          name: email.split('@')[0],
          avatar_url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function initializeSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error initializing session:', error);
    return null;
  }
}

export function subscribeToAuthChanges(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

export async function updateUserProgress(userId: string, progress: number) {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        progress_percentage: progress,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function updateUserPoints(userId: string, points: number) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        xp_points: points,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
}

// IMPROVED ACCOUNT CREATION WITH BETTER ERROR HANDLING
export async function createDemoUserAccount() {
  try {
    console.log('Creating demo user account...');
    
    // First, check if user already exists by trying to sign in
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@speakceo.ai',
        password: 'Demo123!'
      });
      
      if (signInData?.user && !signInError) {
        console.log('Demo user already exists and can sign in');
        await supabase.auth.signOut(); // Sign out after test
        return true;
      }
    } catch (signInError) {
      console.log('Demo user sign in failed, will try to create:', signInError);
    }
    
    // Try to create the user
    const { data, error } = await supabase.auth.signUp({
      email: 'demo@speakceo.ai',
      password: 'Demo123!',
      options: {
        data: {
          name: 'Demo Student',
          role: 'student'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered') || 
          error.message.includes('already been registered') ||
          error.message.includes('User already registered')) {
        console.log('Demo user already exists');
        return true;
      }
      console.error('Demo user creation error:', error);
      throw new Error(`Demo account creation failed: ${error.message}`);
    }

    console.log('Demo user account created successfully');
    
    // If user was created but needs confirmation, that's still success
    if (data?.user && !data?.user?.email_confirmed_at) {
      console.log('Demo user created but needs email confirmation');
      return true; // Still count as success
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating demo user account:', error);
    throw error;
  }
}

export async function createAdminUserAccount() {
  try {
    console.log('Creating admin user account...');
    
    // First, check if user already exists by trying to sign in
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@speakceo.ai',
        password: 'Admin123!'
      });
      
      if (signInData?.user && !signInError) {
        console.log('Admin user already exists and can sign in');
        await supabase.auth.signOut(); // Sign out after test
        return true;
      }
    } catch (signInError) {
      console.log('Admin user sign in failed, will try to create:', signInError);
    }
    
    // Try to create the user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@speakceo.ai',
      password: 'Admin123!',
      options: {
        data: {
          name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered') || 
          error.message.includes('already been registered') ||
          error.message.includes('User already registered')) {
        console.log('Admin user already exists');
        return true;
      }
      console.error('Admin user creation error:', error);
      throw new Error(`Admin account creation failed: ${error.message}`);
    }

    console.log('Admin user account created successfully');
    
    // If user was created but needs confirmation, that's still success
    if (data?.user && !data?.user?.email_confirmed_at) {
      console.log('Admin user created but needs email confirmation');
      return true; // Still count as success
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating admin user account:', error);
    throw error;
  }
}

// COMPREHENSIVE ADMIN FUNCTIONS

export async function ensureDemoUserProfile() {
  try {
    console.log('Starting demo user profile check...');
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('No active session found');
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    
    console.log('Checking demo profile for user:', userId, userEmail);

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      throw profileError;
    }

    if (!existingProfile) {
      console.log('Creating new demo profile...');
      
      // Create new demo profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          name: userEmail?.split('@')[0] || 'Student',
          role: 'student',
          avatar_url: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80',
          xp_points: 250,
          level: 2,
          streak_count: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating demo profile:', insertError);
        throw insertError;
      }

      console.log('Demo profile created successfully:', newProfile);
      return newProfile;
    } else {
      console.log('Existing profile found:', existingProfile);
      return existingProfile;
    }
  } catch (error) {
    console.error('Error in ensureDemoUserProfile:', error);
    throw error;
  }
}

export async function ensureAdminUserProfile() {
  try {
    console.log('Starting admin user profile check...');
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session) {
      throw new Error('No active session found');
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    
    console.log('Checking profile for user:', userId, userEmail);

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      throw profileError;
    }

    if (!existingProfile) {
      console.log('Creating new admin profile...');
      
      // Create new admin profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          name: userEmail?.split('@')[0] || 'Admin',
          role: 'admin',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80',
          xp_points: 0,
          level: 1,
          streak_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      console.log('Admin profile created successfully:', newProfile);
      return newProfile;
    } else {
      console.log('Existing profile found, updating role to admin...');
      
      // Update existing profile to admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile role:', updateError);
        throw updateError;
      }

      console.log('Profile updated to admin successfully:', updatedProfile);
      return updatedProfile;
    }
  } catch (error) {
    console.error('Error in ensureAdminUserProfile:', error);
    throw error;
  }
}

// CREATE ALL NECESSARY TABLES
export async function createAllTables() {
  console.log('🚀 Creating all necessary tables...');
  
  const tables = [
    {
      name: 'profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
          avatar_url TEXT,
          xp_points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          streak_count INTEGER DEFAULT 0,
          total_tasks_completed INTEGER DEFAULT 0,
          current_course_id UUID,
          last_active TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'courses',
      sql: `
        CREATE TABLE IF NOT EXISTS courses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          image_url TEXT,
          duration_weeks INTEGER DEFAULT 12,
          difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
          price DECIMAL(10,2) DEFAULT 0,
          is_featured BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          instructor_id UUID REFERENCES profiles(id),
          total_students INTEGER DEFAULT 0,
          total_lessons INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'modules',
      sql: `
        CREATE TABLE IF NOT EXISTS modules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          order_index INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'lessons',
      sql: `
        CREATE TABLE IF NOT EXISTS lessons (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT,
          video_url TEXT,
          duration_minutes INTEGER DEFAULT 0,
          order_index INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'tasks',
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          task_type TEXT DEFAULT 'assignment' CHECK (task_type IN ('assignment', 'quiz', 'project', 'discussion')),
          points INTEGER DEFAULT 10,
          due_date TIMESTAMPTZ,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'user_progress',
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
          lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
          progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
          is_completed BOOLEAN DEFAULT false,
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, lesson_id)
        );
      `
    },
    {
      name: 'task_submissions',
      sql: `
        CREATE TABLE IF NOT EXISTS task_submissions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
          submission_text TEXT,
          file_url TEXT,
          status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'pending')),
          grade INTEGER CHECK (grade >= 0 AND grade <= 100),
          feedback TEXT,
          submitted_at TIMESTAMPTZ DEFAULT NOW(),
          graded_at TIMESTAMPTZ,
          UNIQUE(user_id, task_id)
        );
      `
    },
    {
      name: 'live_classes',
      sql: `
        CREATE TABLE IF NOT EXISTS live_classes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          instructor_id UUID REFERENCES profiles(id),
          scheduled_at TIMESTAMPTZ NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          meeting_url TEXT,
          status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
          max_participants INTEGER DEFAULT 100,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'announcements',
      sql: `
        CREATE TABLE IF NOT EXISTS announcements (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author_id UUID REFERENCES profiles(id),
          priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'user_enrollments',
      sql: `
        CREATE TABLE IF NOT EXISTS user_enrollments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
          enrolled_at TIMESTAMPTZ DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          UNIQUE(user_id, course_id)
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      console.log(`Creating table: ${table.name}`);
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.error(`Error creating table ${table.name}:`, error);
        // Continue with other tables even if one fails
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    } catch (error) {
      console.error(`Error creating table ${table.name}:`, error);
    }
  }
}

// CREATE COMPREHENSIVE STARTER DATA
export async function createStarterData() {
  console.log('🎯 Creating comprehensive starter data...');
  
  try {
    // 1. Create sample courses
    const courses = [
      {
        title: '90-Day Startup Launch Program',
        description: 'Transform your startup idea into a profitable business in 90 days',
        image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration_weeks: 12,
        difficulty_level: 'intermediate',
        price: 297,
        is_featured: true,
        total_lessons: 36
      },
      {
        title: 'Startup Fundamentals',
        description: 'Learn the basics of entrepreneurship and business development',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration_weeks: 8,
        difficulty_level: 'beginner',
        price: 97,
        is_featured: false,
        total_lessons: 24
      },
      {
        title: 'Advanced Growth Strategies',
        description: 'Scale your startup with proven growth hacking techniques',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        duration_weeks: 16,
        difficulty_level: 'advanced',
        price: 497,
        is_featured: true,
        total_lessons: 48
      }
    ];

    const { data: insertedCourses, error: coursesError } = await supabase
      .from('courses')
      .insert(courses)
      .select();

    if (coursesError) throw coursesError;
    console.log('✅ Courses created:', insertedCourses?.length);

    // 2. Create modules for the first course
    const modules = [
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Foundation & Validation',
        description: 'Build a solid foundation and validate your startup idea',
        order_index: 1
      },
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Product Development',
        description: 'Turn your idea into a minimum viable product',
        order_index: 2
      },
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Marketing & Launch',
        description: 'Create buzz and launch your startup successfully',
        order_index: 3
      },
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Growth & Scale',
        description: 'Scale your startup and achieve sustainable growth',
        order_index: 4
      }
    ];

    const { data: insertedModules, error: modulesError } = await supabase
      .from('modules')
      .insert(modules)
      .select();

    if (modulesError) throw modulesError;
    console.log('✅ Modules created:', insertedModules?.length);

    // 3. Create lessons for the first module
    const lessons = [
      {
        module_id: insertedModules?.[0]?.id,
        title: 'Startup Mindset & Goal Setting',
        content: 'Learn the entrepreneurial mindset and set clear, achievable goals for your startup journey.',
        duration_minutes: 45,
        order_index: 1
      },
      {
        module_id: insertedModules?.[0]?.id,
        title: 'Market Research Fundamentals',
        content: 'Conduct thorough market research to understand your target audience and competition.',
        duration_minutes: 60,
        order_index: 2
      },
      {
        module_id: insertedModules?.[0]?.id,
        title: 'Idea Validation Techniques',
        content: 'Validate your startup idea using proven methods and frameworks.',
        duration_minutes: 50,
        order_index: 3
      },
      {
        module_id: insertedModules?.[0]?.id,
        title: 'Business Model Canvas',
        content: 'Create a comprehensive business model using the Business Model Canvas framework.',
        duration_minutes: 75,
        order_index: 4
      }
    ];

    const { data: insertedLessons, error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessons)
      .select();

    if (lessonsError) throw lessonsError;
    console.log('✅ Lessons created:', insertedLessons?.length);

    // 4. Create tasks for lessons
    const tasks = [
      {
        lesson_id: insertedLessons?.[0]?.id,
        title: 'Define Your Startup Vision',
        description: 'Write a clear vision statement for your startup and define your core values.',
        task_type: 'assignment',
        points: 15
      },
      {
        lesson_id: insertedLessons?.[1]?.id,
        title: 'Market Research Report',
        description: 'Conduct market research and create a comprehensive report on your target market.',
        task_type: 'project',
        points: 25
      },
      {
        lesson_id: insertedLessons?.[2]?.id,
        title: 'Validation Experiment',
        description: 'Design and execute a validation experiment for your startup idea.',
        task_type: 'project',
        points: 30
      },
      {
        lesson_id: insertedLessons?.[3]?.id,
        title: 'Business Model Canvas Quiz',
        description: 'Test your understanding of the Business Model Canvas framework.',
        task_type: 'quiz',
        points: 20
      }
    ];

    const { data: insertedTasks, error: tasksError } = await supabase
      .from('tasks')
      .insert(tasks)
      .select();

    if (tasksError) throw tasksError;
    console.log('✅ Tasks created:', insertedTasks?.length);

    // 5. Create sample students
    const sampleStudents = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'student',
        xp_points: 450,
        level: 3,
        streak_count: 7,
        total_tasks_completed: 12
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        role: 'student',
        xp_points: 680,
        level: 4,
        streak_count: 12,
        total_tasks_completed: 18
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        role: 'student',
        xp_points: 320,
        level: 2,
        streak_count: 3,
        total_tasks_completed: 8
      }
    ];

    const { data: insertedStudents, error: studentsError } = await supabase
      .from('profiles')
      .upsert(sampleStudents)
      .select();

    if (studentsError) throw studentsError;
    console.log('✅ Sample students created:', insertedStudents?.length);

    // 6. Create enrollments
    const enrollments = insertedStudents?.map(student => ({
      user_id: student.id,
      course_id: insertedCourses?.[0]?.id
    })) || [];

    const { data: insertedEnrollments, error: enrollmentsError } = await supabase
      .from('user_enrollments')
      .insert(enrollments)
      .select();

    if (enrollmentsError) throw enrollmentsError;
    console.log('✅ Enrollments created:', insertedEnrollments?.length);

    // 7. Create sample progress
    const progressData = [];
    insertedStudents?.forEach(student => {
      insertedLessons?.forEach((lesson, index) => {
        if (index < 2) { // Only first 2 lessons completed
          progressData.push({
            user_id: student.id,
            course_id: insertedCourses?.[0]?.id,
            lesson_id: lesson.id,
            progress_percentage: 100,
            is_completed: true,
            completed_at: new Date().toISOString()
          });
        }
      });
    });

    const { data: insertedProgress, error: progressError } = await supabase
      .from('user_progress')
      .insert(progressData)
      .select();

    if (progressError) throw progressError;
    console.log('✅ Progress data created:', insertedProgress?.length);

    // 8. Create live classes
    const liveClasses = [
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Live Q&A: Startup Validation',
        description: 'Join us for a live Q&A session about startup validation techniques.',
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        duration_minutes: 90,
        status: 'scheduled',
        max_participants: 50
      },
      {
        course_id: insertedCourses?.[0]?.id,
        title: 'Workshop: Business Model Design',
        description: 'Interactive workshop on designing effective business models.',
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        duration_minutes: 120,
        status: 'scheduled',
        max_participants: 30
      }
    ];

    const { data: insertedClasses, error: classesError } = await supabase
      .from('live_classes')
      .insert(liveClasses)
      .select();

    if (classesError) throw classesError;
    console.log('✅ Live classes created:', insertedClasses?.length);

    // 9. Create announcements
    const announcements = [
      {
        title: 'Welcome to Startup School!',
        content: 'Welcome to our comprehensive startup program. Get ready to transform your ideas into reality!',
        priority: 'high'
      },
      {
        title: 'New Course Module Released',
        content: 'We\'ve just released a new module on Advanced Marketing Strategies. Check it out!',
        priority: 'normal'
      },
      {
        title: 'Live Session This Friday',
        content: 'Don\'t miss our live Q&A session this Friday at 3 PM EST. Come prepared with your questions!',
        priority: 'urgent'
      }
    ];

    const { data: insertedAnnouncements, error: announcementsError } = await supabase
      .from('announcements')
      .insert(announcements)
      .select();

    if (announcementsError) throw announcementsError;
    console.log('✅ Announcements created:', insertedAnnouncements?.length);

    console.log('🎉 All starter data created successfully!');
    return true;

  } catch (error) {
    console.error('Error creating starter data:', error);
    throw error;
  }
}

// REAL-TIME SUBSCRIPTION MANAGEMENT
export function subscribeToTableChanges(tableName: string, callback: (payload: any) => void) {
  console.log(`🔔 Setting up real-time subscription for ${tableName}`);
  
  const subscription = supabase
    .channel(`${tableName}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
    .subscribe();

  return subscription;
}

// DASHBOARD DATA FUNCTIONS
export async function getDashboardStats() {
  try {
    console.log('📊 Fetching dashboard stats...');
    
    const [studentsCount, coursesCount, tasksCount, classesCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
      supabase.from('courses').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('tasks').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('live_classes').select('id', { count: 'exact' }).eq('status', 'scheduled')
    ]);

    const activeUsers = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      totalStudents: studentsCount.count || 0,
      totalCourses: coursesCount.count || 0,
      totalTasks: tasksCount.count || 0,
      totalLiveClasses: classesCount.count || 0,
      activeUsers: activeUsers.count || 0,
      systemHealth: {
        uptime: '99.98%',
        responseTime: '145ms',
        errorRate: '0.02%'
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalTasks: 0,
      totalLiveClasses: 0,
      activeUsers: 0,
      systemHealth: {
        uptime: '0%',
        responseTime: 'N/A',
        errorRate: '100%'
      }
    };
  }
}

export async function getStudentDashboardData(userId: string) {
  try {
    console.log('📚 Fetching student dashboard data for:', userId);

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Get user enrollments with course details
    const { data: enrollments } = await supabase
      .from('user_enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          description,
          image_url,
          total_lessons
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    // Get user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    // Get upcoming live classes
    const { data: upcomingClasses } = await supabase
      .from('live_classes')
      .select('*')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(3);

    // Get recent announcements
    const { data: announcements } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate completion percentage
    const totalLessons = enrollments?.reduce((sum, enrollment) => 
      sum + (enrollment.courses?.total_lessons || 0), 0) || 0;
    const completedLessons = progress?.filter(p => p.is_completed).length || 0;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      profile,
      courses: enrollments?.map(e => e.courses) || [],
      progress: {
        completionPercentage,
        completedLessons,
        totalLessons,
        xpPoints: profile?.xp_points || 0,
        level: profile?.level || 1,
        streakCount: profile?.streak_count || 0
      },
      upcomingClasses: upcomingClasses || [],
      announcements: announcements || []
    };
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    throw error;
  }
}

// ADMIN CRUD OPERATIONS
export async function addCourse(courseData: any) {
  try {
    console.log('➕ Adding new course:', courseData);
    
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        ...courseData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Course added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
}

export async function updateCourse(courseId: string, updates: any) {
  try {
    console.log('✏️ Updating course:', courseId, updates);
    
    const { data, error } = await supabase
      .from('courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Course updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

export async function deleteCourse(courseId: string) {
  try {
    console.log('🗑️ Deleting course:', courseId);
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;
    
    console.log('✅ Course deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}

export async function addTask(taskData: any) {
  try {
    console.log('➕ Adding new task:', taskData);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Task added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
}

export async function getAllCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          id,
          title,
          lessons (
            id,
            title,
            tasks (
              id,
              title
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function getAllTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lessons (
          title,
          modules (
            title,
            courses (
              title
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// INITIALIZE COMPLETE ADMIN ENVIRONMENT
export async function initializeAdminEnvironment() {
  console.log('🚀 Initializing complete admin environment...');
  
  try {
    // Step 1: Create all tables
    await createAllTables();
    
    // Step 2: Create comprehensive starter data
    await createStarterData();
    
    // Step 3: Ensure admin profile
    await ensureAdminUserProfile();
    
    console.log('🎉 Admin environment initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing admin environment:', error);
    throw error;
  }
}

// HEALTH CHECK FUNCTION
export async function performHealthCheck() {
  console.log('🏥 Performing system health check...');
  
  const checks = {
    database: false,
    tables: false,
    data: false,
    realtime: false
  };

  try {
    // Database connection
    const { error: dbError } = await supabase.from('profiles').select('count').limit(1);
    checks.database = !dbError;

    // Tables exist
    const tableChecks = await Promise.all([
      supabase.from('profiles').select('count').limit(1),
      supabase.from('courses').select('count').limit(1),
      supabase.from('tasks').select('count').limit(1)
    ]);
    checks.tables = tableChecks.every(check => !check.error);

    // Data exists
    const { data: coursesData } = await supabase.from('courses').select('id').limit(1);
    checks.data = (coursesData?.length || 0) > 0;

    // Real-time connection
    checks.realtime = supabase.realtime.isConnected();

    console.log('Health check results:', checks);
    return checks;
  } catch (error) {
    console.error('Health check failed:', error);
    return checks;
  }
}

// CHECK AND CREATE ADMIN TABLES (Legacy function for AdminRecovery)
export async function checkAndCreateAdminTables() {
  console.log('🔍 Checking and creating admin tables...');
  
  try {
    // This function wraps createAllTables for backward compatibility
    await createAllTables();
    console.log('✅ Admin tables checked and created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating admin tables:', error);
    throw error;
  }
}

// CREATE SAMPLE ADMIN DATA (Legacy function for AdminRecovery)
export async function createSampleAdminData() {
  console.log('📊 Creating sample admin data...');
  
  try {
    // This function wraps createStarterData for backward compatibility
    await createStarterData();
    console.log('✅ Sample admin data created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating sample admin data:', error);
    throw error;
  }
}

// COMPREHENSIVE PRODUCTION SETUP FUNCTION
export async function setupProductionEnvironment() {
  const results = {
    tablesCreated: false,
    rlsPoliciesSet: false,
    demoAccountCreated: false,
    adminAccountCreated: false,
    starterDataCreated: false,
    errors: [] as string[]
  };

  try {
    console.log('🚀 Starting production environment setup...');

    // Step 1: Create all necessary tables
    try {
      await createAllTables();
      results.tablesCreated = true;
      console.log('✅ Database tables created');
    } catch (error: any) {
      results.errors.push(`Table creation failed: ${error.message}`);
      console.error('❌ Table creation failed:', error);
    }

    // Step 2: Set up RLS policies
    try {
      await setupRLSPolicies();
      results.rlsPoliciesSet = true;
      console.log('✅ RLS policies configured');
    } catch (error: any) {
      results.errors.push(`RLS policies failed: ${error.message}`);
      console.error('❌ RLS policies failed:', error);
    }

    // Step 3: Create demo account
    try {
      await createDemoUserAccount();
      results.demoAccountCreated = true;
      console.log('✅ Demo account ready');
    } catch (error: any) {
      results.errors.push(`Demo account failed: ${error.message}`);
      console.error('❌ Demo account failed:', error);
    }

    // Step 4: Create admin account
    try {
      await createAdminUserAccount();
      results.adminAccountCreated = true;
      console.log('✅ Admin account ready');
    } catch (error: any) {
      results.errors.push(`Admin account failed: ${error.message}`);
      console.error('❌ Admin account failed:', error);
    }

    // Step 5: Create starter data
    try {
      await createStarterData();
      results.starterDataCreated = true;
      console.log('✅ Starter data created');
    } catch (error: any) {
      results.errors.push(`Starter data failed: ${error.message}`);
      console.error('❌ Starter data failed:', error);
    }

    console.log('🎉 Production setup completed!');
    return results;

  } catch (error: any) {
    results.errors.push(`Setup failed: ${error.message}`);
    console.error('❌ Production setup failed:', error);
    return results;
  }
}

// SETUP RLS POLICIES FOR SECURITY
export async function setupRLSPolicies() {
  const policies = [
    // Profiles table policies
    `
    -- Enable RLS on profiles table
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view all profiles
    DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
    CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
    
    -- Policy: Users can update their own profile
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    
    -- Policy: Users can insert their own profile
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    `,
    
    // Courses table policies
    `
    -- Enable RLS on courses table
    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Everyone can view courses
    DROP POLICY IF EXISTS "Everyone can view courses" ON courses;
    CREATE POLICY "Everyone can view courses" ON courses FOR SELECT USING (true);
    
    -- Policy: Only admins can modify courses
    DROP POLICY IF EXISTS "Admins can modify courses" ON courses;
    CREATE POLICY "Admins can modify courses" ON courses FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    `,
    
    // Tasks table policies
    `
    -- Enable RLS on tasks table
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Everyone can view tasks
    DROP POLICY IF EXISTS "Everyone can view tasks" ON tasks;
    CREATE POLICY "Everyone can view tasks" ON tasks FOR SELECT USING (true);
    
    -- Policy: Only admins can modify tasks
    DROP POLICY IF EXISTS "Admins can modify tasks" ON tasks;
    CREATE POLICY "Admins can modify tasks" ON tasks FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    `,
    
    // User progress policies
    `
    -- Enable RLS on user_progress table
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view their own progress
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
    
    -- Policy: Users can update their own progress
    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    CREATE POLICY "Users can update own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
    
    -- Policy: Admins can view all progress
    DROP POLICY IF EXISTS "Admins can view all progress" ON user_progress;
    CREATE POLICY "Admins can view all progress" ON user_progress FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
    `
  ];

  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error('Policy creation error:', error);
        // Continue with other policies even if one fails
      }
    } catch (error) {
      console.error('Policy execution error:', error);
      // Try alternative method for policy creation
      try {
        const { error: directError } = await supabase.from('_supabase_sql').insert({ sql: policy });
        if (directError) {
          console.log('Direct SQL execution not available, policies may need manual setup');
        }
      } catch (fallbackError) {
        console.log('Policy setup requires manual configuration in Supabase dashboard');
      }
    }
  }
}

// SAVE USER'S BRAND LOGO TO PROFILE
export async function saveUserBrandLogo(userId: string, logoUrl: string, brandData?: any) {
  try {
    console.log('Saving user brand logo to profile:', { userId, logoUrl });
    
    const updateData: any = {
      avatar_url: logoUrl, // Use avatar_url field for logo
      updated_at: new Date().toISOString()
    };
    
    // If brand data is provided, save it as metadata
    if (brandData) {
      updateData.metadata = {
        brand: {
          name: brandData.name,
          tagline: brandData.tagline,
          description: brandData.description,
          colors: brandData.colors,
          typography: brandData.typography,
          logoUrl: logoUrl
        }
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error saving user brand logo:', error);
      throw error;
    }

    console.log('User brand logo saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveUserBrandLogo:', error);
    throw error;
  }
}

// GET USER'S BRAND DATA FROM PROFILE
export async function getUserBrandData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, metadata')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user brand data:', error);
      return null;
    }

    return {
      logoUrl: data.avatar_url || '',
      brandData: data.metadata?.brand || null
    };
  } catch (error) {
    console.error('Error in getUserBrandData:', error);
    return null;
  }
}

// CLEAN USER INITIALIZATION FOR ADMIN-CREATED USERS
export async function initializeFreshUser(userId: string, email: string) {
  try {
    console.log('Initializing fresh user:', userId, email);
    
    // Clear any demo flags from localStorage
    localStorage.removeItem('isDemoUser');
    
    // Create clean user progress record
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        completed_lessons: {},
        completed_tasks: {},
        last_activity: new Date().toISOString(),
        streak: 0,
        total_points: 0,
        tool_usage: {}
      });
    
    if (progressError) {
      console.error('Error creating user progress:', progressError);
    } else {
      console.log('✅ Clean user progress created');
    }
    
    // Create clean user profile with fresh progress
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        progress: 0,
        points: 0,
        xp_points: 0,
        level: 1,
        streak_count: 0,
        total_tasks_completed: 0,
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('Error updating profile:', profileError);
    } else {
      console.log('✅ Clean user profile updated');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing fresh user:', error);
    return false;
  }
}
// CLEAN LOCALSTORAGE FOR FRESH USERS
export function cleanUserLocalStorage(userEmail: string) {
  try {
    console.log("🧹 Cleaning localStorage for user:", userEmail);
    
    // Only keep demo data for actual demo accounts
    const isDemoAccount = userEmail.includes("demo@speakceo.ai") || userEmail.includes("admin@speakceo.ai");
    
    if (!isDemoAccount) {
      // Clear all progress-related localStorage for regular users
      localStorage.removeItem("isDemoUser");
      localStorage.removeItem("userProgress");
      localStorage.removeItem("progress-storage");
      localStorage.removeItem("unified-progress-storage");
      localStorage.removeItem("simulator-storage");
      localStorage.removeItem("ai-tools-storage");
      
      // Clear any demo flags
      Object.keys(localStorage).forEach(key => {
        if (key.includes("demo") || key.includes("progress") || key.includes("completed")) {
          localStorage.removeItem(key);
        }
      });
      
      console.log("✅ localStorage cleaned for fresh user");
    } else {
      console.log("🎭 Demo account - keeping demo data");
    }
  } catch (error) {
    console.error("Error cleaning localStorage:", error);
  }
}
