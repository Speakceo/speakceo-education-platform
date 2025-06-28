import { supabase } from '../supabase';

// Fetch upcoming live classes
export async function getUpcomingLiveClasses() {
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
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming live classes:', error);
    throw new Error('Failed to fetch upcoming live classes');
  }
}

// Fetch live (ongoing) classes
export async function getLiveNowClasses() {
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
      .eq('status', 'live')
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching live now classes:', error);
    throw new Error('Failed to fetch live now classes');
  }
}

// Fetch past classes with recordings
export async function getPastLiveClasses() {
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
      .eq('status', 'completed')
      .lt('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching past live classes:', error);
    throw new Error('Failed to fetch past live classes');
  }
}

// Register for a live class
export async function registerForLiveClass(classId: string, userId: string) {
  try {
    // First, check if the user is already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('class_registrations')
      .select('*')
      .eq('class_id', classId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected if not registered
      throw checkError;
    }
    
    if (existingRegistration) {
      // User is already registered
      return { success: true, message: 'Already registered for this class' };
    }
    
    // Register the user for the class
    const { error: registerError } = await supabase
      .from('class_registrations')
      .insert({
        class_id: classId,
        user_id: userId,
        registered_at: new Date().toISOString()
      });
    
    if (registerError) throw registerError;
    
    // Increment attendees count in the live class
    const { error: updateError } = await supabase.rpc('increment_class_attendees', {
      class_id: classId
    });
    
    if (updateError) throw updateError;
    
    return { success: true, message: 'Successfully registered for the class' };
  } catch (error) {
    console.error('Error registering for live class:', error);
    throw new Error('Failed to register for the class');
  }
}

// Get user's registered classes
export async function getUserRegisteredClasses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('class_registrations')
      .select(`
        class_id,
        registered_at,
        live_classes (
          *,
          instructor:profiles!instructor_id (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.map(item => ({
      ...item.live_classes,
      registered_at: item.registered_at
    })) || [];
  } catch (error) {
    console.error('Error fetching user registered classes:', error);
    throw new Error('Failed to fetch registered classes');
  }
} 