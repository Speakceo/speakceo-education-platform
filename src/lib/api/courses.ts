import { supabase } from '../supabase';
import type { Module, Lesson, LessonContent, CourseProgress } from '../types/courses';

// Get all modules
export async function getModules(): Promise<Module[]> {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Module[];
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw new Error('Failed to fetch modules');
  }
}

// Get lessons for a module
export async function getLessons(moduleId: string): Promise<Lesson[]> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Lesson[];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw new Error('Failed to fetch lessons');
  }
}

// Get content for a lesson
export async function getLessonContent(lessonId: string): Promise<LessonContent[]> {
  try {
    const { data, error } = await supabase
      .from('lesson_content')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as LessonContent[];
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    throw new Error('Failed to fetch lesson content');
  }
}

// Create a new module
export async function createModule(module: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<Module> {
  try {
    const { data, error } = await supabase
      .from('modules')
      .insert(module)
      .select()
      .single();
    
    if (error) throw error;
    return data as Module;
  } catch (error) {
    console.error('Error creating module:', error);
    throw new Error('Failed to create module');
  }
}

// Update a module
export async function updateModule(id: string, module: Partial<Module>): Promise<Module> {
  try {
    const { data, error } = await supabase
      .from('modules')
      .update(module)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Module;
  } catch (error) {
    console.error('Error updating module:', error);
    throw new Error('Failed to update module');
  }
}

// Delete a module
export async function deleteModule(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw new Error('Failed to delete module');
  }
}

// Create a new lesson
export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw new Error('Failed to create lesson');
  }
}

// Update a lesson
export async function updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update(lesson)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw new Error('Failed to update lesson');
  }
}

// Delete a lesson
export async function deleteLesson(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw new Error('Failed to delete lesson');
  }
}

// Create lesson content
export async function createLessonContent(content: Omit<LessonContent, 'id' | 'created_at' | 'updated_at'>): Promise<LessonContent> {
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
    
    return data as LessonContent;
  } catch (error) {
    console.error('Error creating lesson content:', error);
    throw new Error('Failed to create lesson content');
  }
}

// Update lesson content
export async function updateLessonContent(id: string, content: Partial<LessonContent>): Promise<LessonContent> {
  try {
    const { data, error } = await supabase
      .from('lesson_content')
      .update(content)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as LessonContent;
  } catch (error) {
    console.error('Error updating lesson content:', error);
    throw new Error('Failed to update lesson content');
  }
}

// Delete lesson content
export async function deleteLessonContent(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('lesson_content')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error deleting lesson content:', error);
      throw new Error(`Failed to delete lesson content: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting lesson content:', error);
    throw new Error('Failed to delete lesson content');
  }
}

// Get user's course progress
export async function getUserCourseProgress(userId: string): Promise<CourseProgress[]> {
  try {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as CourseProgress[];
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    throw new Error('Failed to fetch user course progress');
  }
}

// Update user's course progress
export async function updateUserCourseProgress(progress: Omit<CourseProgress, 'last_accessed'>): Promise<CourseProgress> {
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
    return data as CourseProgress;
  } catch (error) {
    console.error('Error updating user course progress:', error);
    throw new Error('Failed to update user course progress');
  }
}