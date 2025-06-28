import { supabase } from './supabase';

// Sample task data
const sampleTasks = [
  {
    id: '1',
    title: 'Complete Business Plan Draft',
    description: 'Create a draft of your business plan including executive summary, market analysis, and financial projections.',
    type: 'file_upload',
    week_number: 1,
    points: 100,
    due_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    live_discussion: true,
    user_id: null // Will be populated with the user's ID when fetching
  },
  {
    id: '2',
    title: 'Market Research Analysis',
    description: 'Conduct research on your target market and analyze the data to identify trends and opportunities.',
    type: 'text',
    week_number: 1,
    points: 75,
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(), // day after tomorrow
    live_discussion: false,
    user_id: null
  },
  {
    id: '3',
    title: 'Competitive Analysis',
    description: 'Identify and analyze your main competitors, their strengths, weaknesses, and market positioning.',
    type: 'file_upload',
    week_number: 2,
    points: 100,
    due_date: new Date(Date.now() + 5 * 86400000).toISOString(), // 5 days from now
    live_discussion: true,
    user_id: null
  },
  {
    id: '4',
    title: 'Brand Identity Design',
    description: 'Create a logo, color scheme, and brand guidelines for your business.',
    type: 'file_upload',
    week_number: 2,
    points: 120,
    due_date: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
    live_discussion: false,
    user_id: null
  },
  {
    id: '5',
    title: 'Financial Projections',
    description: 'Develop a financial model with revenue projections, costs, and break-even analysis.',
    type: 'file_upload',
    week_number: 3,
    points: 150,
    due_date: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days from now
    live_discussion: true,
    user_id: null
  }
];

export async function createTasksTable() {
  try {
    // Check if tasks table exists
    const { error: checkError } = await supabase.from('tasks').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating tasks table...');
      
      // Create tasks table
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            week_number INTEGER NOT NULL,
            points INTEGER NOT NULL,
            due_date TIMESTAMP WITH TIME ZONE,
            live_discussion BOOLEAN DEFAULT false,
            user_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createError) throw createError;
      
      // Create task_submissions table
      const { error: createSubmissionsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.task_submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id TEXT REFERENCES public.tasks(id),
            user_id UUID REFERENCES auth.users(id),
            content TEXT,
            file_url TEXT,
            status TEXT DEFAULT 'pending',
            feedback TEXT,
            points_earned INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(task_id, user_id)
          );
        `
      });
      
      if (createSubmissionsError) throw createSubmissionsError;
    }
    
    console.log('Tables created successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error creating tasks tables:', error);
    return { success: false, error };
  }
}

export async function seedTasksForUser(userId: string) {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }
  
  try {
    // Assign the user ID to sample tasks
    const tasksWithUserId = sampleTasks.map(task => ({
      ...task,
      user_id: userId
    }));
    
    // Insert sample tasks
    const { error: insertError } = await supabase
      .from('tasks')
      .upsert(tasksWithUserId);
    
    if (insertError) throw insertError;
    
    console.log('Sample tasks added successfully for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error seeding tasks:', error);
    return { success: false, error };
  }
} 