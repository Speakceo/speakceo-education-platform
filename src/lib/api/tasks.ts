import { supabase } from '../supabase';
import type { Task, TaskSubmission, TaskStats } from '../types/tasks';

export async function getTasks() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('No data returned from tasks query');
    }

    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTaskSubmissions(userId: string) {
  try {
    if (!userId) throw new Error('User ID is required');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('task_submissions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from task submissions query');
    }

    return data as TaskSubmission[];
  } catch (error) {
    console.error('Error fetching task submissions:', error);
    throw new Error('Failed to fetch task submissions');
  }
}

export async function submitTask(
  taskId: string,
  submission: { content?: string; file_url?: string }
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('task_submissions')
      .upsert({
        task_id: taskId,
        user_id: session.user.id,
        submission_text: submission.content,
        file_url: submission.file_url,
        status: 'submitted'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from task submission');
    }

    return data as TaskSubmission;
  } catch (error) {
    console.error('Error submitting task:', error);
    throw new Error('Failed to submit task');
  }
}

export async function getTaskStats(userId: string): Promise<TaskStats> {
  try {
    if (!userId) throw new Error('User ID is required');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const [{ data: tasks }, { data: submissions }] = await Promise.all([
      supabase.from('tasks').select('points'),
      supabase
        .from('task_submissions')
        .select('grade')
        .eq('user_id', userId)
        .eq('status', 'graded')
    ]);

    if (!tasks || !submissions) {
      throw new Error('Failed to fetch task stats');
    }

    const total_tasks = tasks.length;
    const completed_tasks = submissions.length;
    const total_points = tasks.reduce((sum, task) => sum + (task.points || 0), 0);
    const points_earned = submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);

    return {
      total_tasks,
      completed_tasks,
      total_points,
      points_earned,
      completion_rate: total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching task stats:', error);
    throw new Error('Failed to fetch task stats');
  }
}