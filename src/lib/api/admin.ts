import { supabase } from '../supabase';
import type { User, Module, Lesson, LessonContent } from '../types/courses';

// User Management
export async function getUsers(filters?: {
  status?: string;
  course_type?: string;
}) {
  try {
    let query = supabase.from('profiles').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.course_type) {
      query = query.eq('course_type', filters.course_type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function updateUser(id: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Course Management
export async function getModulesWithLessons() {
  try {
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .order('order', { ascending: true });
    
    if (modulesError) throw modulesError;
    
    // For each module, fetch its lessons
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', module.id)
          .order('order', { ascending: true });
        
        if (lessonsError) throw lessonsError;
        
        return {
          ...module,
          lessons: lessons || []
        };
      })
    );
    
    return modulesWithLessons;
  } catch (error) {
    console.error('Error fetching modules with lessons:', error);
    throw new Error('Failed to fetch modules with lessons');
  }
}

export async function createModule(module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('modules')
      .insert(module)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'create',
      resource_type: 'module',
      resource_id: data.id,
      details: { module_title: module.title }
    });
    
    return data;
  } catch (error) {
    console.error('Error creating module:', error);
    throw new Error('Failed to create module');
  }
}

export async function updateModule(id: string, updates: Partial<Module>) {
  try {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'update',
      resource_type: 'module',
      resource_id: id,
      details: { module_title: updates.title }
    });
    
    return data;
  } catch (error) {
    console.error('Error updating module:', error);
    throw new Error('Failed to update module');
  }
}

export async function deleteModule(id: string) {
  try {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'delete',
      resource_type: 'module',
      resource_id: id
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw new Error('Failed to delete module');
  }
}

export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'create',
      resource_type: 'lesson',
      resource_id: data.id,
      details: { lesson_title: lesson.title, module_id: lesson.module_id }
    });
    
    return data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw new Error('Failed to create lesson');
  }
}

export async function updateLesson(id: string, updates: Partial<Lesson>) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'update',
      resource_type: 'lesson',
      resource_id: id,
      details: { lesson_title: updates.title }
    });
    
    return data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw new Error('Failed to update lesson');
  }
}

export async function deleteLesson(id: string) {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'delete',
      resource_type: 'lesson',
      resource_id: id
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw new Error('Failed to delete lesson');
  }
}

export async function createLessonContent(content: Omit<LessonContent, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Get the current user's role
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Supabase error checking user role:', profileError);
      throw new Error('Failed to check user role');
    }
    
    // Verify the user is an admin
    if (profile.role !== 'admin') {
      throw new Error('Only admins can create lesson content');
    }
    
    // Create the lesson content
    const { data, error } = await supabase
      .from('lesson_content')
      .insert(content)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating lesson content:', error);
      throw new Error(`Failed to create lesson content: ${error.message}`);
    }
    
    // Log admin action
    await logAdminAction({
      admin_id: session.user.id,
      action_type: 'create',
      resource_type: 'content',
      resource_id: data.id,
      details: { content_type: content.type, lesson_id: content.lesson_id }
    });
    
    return data;
  } catch (error) {
    console.error('Error creating lesson content:', error);
    throw new Error('Failed to create lesson content');
  }
}

export async function updateLessonContent(id: string, content: Partial<LessonContent>) {
  try {
    const { data, error } = await supabase
      .from('lesson_content')
      .update(content)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'update',
      resource_type: 'content',
      resource_id: id,
      details: { content_type: content.type }
    });
    
    return data;
  } catch (error) {
    console.error('Error updating lesson content:', error);
    throw new Error('Failed to update lesson content');
  }
}

export async function deleteLessonContent(id: string) {
  try {
    const { error } = await supabase
      .from('lesson_content')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error deleting lesson content:', error);
      throw new Error(`Failed to delete lesson content: ${error.message}`);
    }
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'delete',
      resource_type: 'content',
      resource_id: id
    });
  } catch (error) {
    console.error('Error deleting lesson content:', error);
    throw new Error('Failed to delete lesson content');
  }
}

// Get user's course progress
export async function getUserCourseProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    throw new Error('Failed to fetch user course progress');
  }
}

// Update user's course progress
export async function updateUserCourseProgress(progress: any) {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .upsert({
        ...progress,
        last_accessed: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user course progress:', error);
    throw new Error('Failed to update user course progress');
  }
}

// Live Classes Management
export async function getLiveClasses() {
  try {
    const { data, error } = await supabase
      .from('live_classes')
      .select(`
        *,
        instructor:profiles!instructor_id (
          id,
          name,
          avatar_url
        )
      `)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching live classes:', error);
    throw new Error('Failed to fetch live classes');
  }
}

export async function createLiveClass(liveClass: any) {
  try {
    // Remove attendees from the payload since it's managed by the database
    const { attendees, ...classData } = liveClass;
    
    const { data, error } = await supabase
      .from('live_classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'create',
      resource_type: 'class',
      resource_id: data.id,
      details: { class_title: liveClass.title }
    });
    
    return data;
  } catch (error) {
    console.error('Error creating live class:', error);
    throw new Error('Failed to create live class');
  }
}

export async function updateLiveClass(id: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('live_classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'update',
      resource_type: 'class',
      resource_id: id,
      details: { class_title: updates.title }
    });
    
    return data;
  } catch (error) {
    console.error('Error updating live class:', error);
    throw new Error('Failed to update live class');
  }
}

export async function deleteLiveClass(id: string) {
  try {
    // Validate UUID format before attempting deletion
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid UUID format: ${id}`);
    }
    
    const { error } = await supabase
      .from('live_classes')
      .delete()
      .eq('id', id);
    
    if (error) {
      // Handle specific UUID error
      if (error.code === '22P02') {
        throw new Error(`Invalid UUID format for live class ID: ${id}`);
      }
      throw error;
    }
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'delete',
      resource_type: 'class',
      resource_id: id
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting live class:', error);
    
    // Provide more specific error messages
    if (error.message.includes('Invalid UUID')) {
      throw new Error(`Invalid ID format: The class ID must be a valid UUID.`);
    }
    
    throw new Error('Failed to delete live class');
  }
}

// User Access Management
export async function updateUserAccess(userId: string, updates: {
  course_type?: 'Basic' | 'Premium';
  role?: 'student' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
}) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log admin action
    await logAdminAction({
      admin_id: (await supabase.auth.getSession()).data.session?.user.id || '',
      action_type: 'update',
      resource_type: 'user',
      resource_id: userId,
      details: updates
    });
    
    return data;
  } catch (error) {
    console.error('Error updating user access:', error);
    throw new Error('Failed to update user access');
  }
}

// Analytics and Reporting
export async function getUserStats() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('course_type, count(*)')
      .group('course_type');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw new Error('Failed to fetch user stats');
  }
}

export async function getCompletionStats() {
  try {
    // This is a simplified example - in a real app, you would have a more complex query
    const { data, error } = await supabase
      .from('profiles')
      .select('progress')
      .gte('progress', 0);
    
    if (error) throw error;
    
    // Calculate average completion rate
    const avgProgress = data.reduce((sum, user) => sum + user.progress, 0) / data.length;
    
    return {
      averageProgress: avgProgress,
      totalUsers: data.length,
      completedUsers: data.filter(user => user.progress === 100).length
    };
  } catch (error) {
    console.error('Error fetching completion stats:', error);
    throw new Error('Failed to fetch completion stats');
  }
}

// Admin Action Logging
export async function logAdminAction(action: {
  admin_id: string;
  action_type: 'create' | 'update' | 'delete';
  resource_type: 'module' | 'lesson' | 'content' | 'user' | 'class';
  resource_id: string;
  details?: any;
}) {
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .insert({
        ...action,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error logging admin action:', error);
      // Don't throw here, just log the error
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw here, just log the error
    return null;
  }
}

// Real-time subscription setup
export function setupRealtimeSubscriptions(callback: (payload: any) => void) {
  const channels = [
    supabase.channel('modules-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'modules'
    }, callback),
    
    supabase.channel('lessons-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'lessons'
    }, callback),
    
    supabase.channel('lesson-content-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'lesson_content'
    }, callback),
    
    supabase.channel('live-classes-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'live_classes'
    }, callback),
    
    supabase.channel('profiles-changes').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles'
    }, callback)
  ];
  
  // Subscribe to all channels
  channels.forEach(channel => channel.subscribe());
  
  // Return a function to unsubscribe from all channels
  return () => {
    channels.forEach(channel => supabase.removeChannel(channel));
  };
}