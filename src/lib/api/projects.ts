import { supabase } from '../supabase';
import type { 
  Project, 
  ProjectMetrics, 
  ProjectMilestone, 
  ProjectFeedback 
} from '../types/projects';

export async function createProject(project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    // Get AI feedback and suggestions using fallback implementations
    const [aiFeedback, aiSuggestions] = await Promise.all([
      getAIFeedback(project),
      getAISuggestions(project)
    ]);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        user_id: session.user.id,
        ai_feedback: aiFeedback,
        ai_suggestions: aiSuggestions
      })
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

export async function getProject(id: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
}

export async function updateProject(id: string, updates: Partial<Project>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

export async function getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_metrics')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) throw error;
    return data as ProjectMetrics;
  } catch (error) {
    console.error('Error fetching project metrics:', error);
    throw new Error('Failed to fetch project metrics');
  }
}

export async function updateProjectMetrics(
  projectId: string,
  metrics: Partial<ProjectMetrics>
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_metrics')
      .upsert({ project_id: projectId, ...metrics })
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMetrics;
  } catch (error) {
    console.error('Error updating project metrics:', error);
    throw new Error('Failed to update project metrics');
  }
}

export async function createMilestone(milestone: Omit<ProjectMilestone, 'id'>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMilestone;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw new Error('Failed to create milestone');
  }
}

export async function getMilestones(projectId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as ProjectMilestone[];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw new Error('Failed to fetch milestones');
  }
}

export async function createFeedback(feedback: Omit<ProjectFeedback, 'id' | 'created_at'>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_feedback')
      .insert({
        ...feedback,
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProjectFeedback;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw new Error('Failed to create feedback');
  }
}

export async function getFeedback(projectId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('project_feedback')
      .select('*, profiles(name, avatar_url)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProjectFeedback[];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
}

async function getAIFeedback(project: Partial<Project>): Promise<string> {
  try {
    // Fallback AI feedback based on project properties
    const feedback = [];
    
    if (project.title) {
      feedback.push(`Great project title: "${project.title}" is clear and engaging.`);
    }
    
    if (project.description) {
      if (project.description.length > 100) {
        feedback.push('Your project description is comprehensive and detailed.');
      } else {
        feedback.push('Consider expanding your project description to provide more details.');
      }
    }
    
    if (project.category) {
      feedback.push(`Excellent choice focusing on ${project.category} - this is a growing field.`);
    }
    
    feedback.push('Keep up the great work! Remember to set clear milestones and track your progress.');
    
    return feedback.join(' ');
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return 'Great project! Keep working on it and you\'ll see amazing results.';
  }
}

async function getAISuggestions(project: Partial<Project>): Promise<string[]> {
  try {
    const suggestions = [];
    
    if (!project.description || project.description.length < 50) {
      suggestions.push('Add a more detailed project description');
    }
    
    if (!project.target_audience) {
      suggestions.push('Define your target audience clearly');
    }
    
    if (!project.goals || project.goals.length === 0) {
      suggestions.push('Set specific, measurable goals');
    }
    
    suggestions.push('Create a timeline with milestones');
    suggestions.push('Consider potential challenges and solutions');
    suggestions.push('Think about how to measure success');
    
    return suggestions.slice(0, 5); // Return max 5 suggestions
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [
      'Set clear goals and milestones',
      'Define your target audience',
      'Create a detailed project plan',
      'Consider potential challenges',
      'Think about measuring success'
    ];
  }
}
