import { supabase } from '../supabase';
import type { Lead, Order, Activity, FollowUp, DashboardStats } from '../types/crm';

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  assigned_to?: string;
}) {
  let query = supabase.from('leads').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.source) {
    query = query.eq('source', filters.source);
  }
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('leads').insert(lead).select().single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function getOrders(filters?: {
  status?: string;
  payment_status?: string;
  lead_id?: string;
}) {
  let query = supabase.from('orders').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.payment_status) {
    query = query.eq('payment_status', filters.payment_status);
  }
  if (filters?.lead_id) {
    query = query.eq('lead_id', filters.lead_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) throw error;
  return data as Order;
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Order;
}

export async function createActivity(
  activity: Omit<Activity, 'id' | 'created_at'>
) {
  const { data, error } = await supabase.from('activities').insert(activity).select().single();
  if (error) throw error;
  return data as Activity;
}

export async function getActivities(lead_id: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', lead_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Activity[];
}

export async function createFollowUp(
  followUp: Omit<FollowUp, 'id' | 'created_at'>
) {
  const { data, error } = await supabase.from('follow_ups').insert(followUp).select().single();
  if (error) throw error;
  return data as FollowUp;
}

export async function updateFollowUp(id: string, updates: Partial<FollowUp>) {
  const { data, error } = await supabase
    .from('follow_ups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as FollowUp;
}

export async function getFollowUps(filters?: {
  lead_id?: string;
  status?: string;
  user_id?: string;
}) {
  let query = supabase.from('follow_ups').select('*');

  if (filters?.lead_id) {
    query = query.eq('lead_id', filters.lead_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { data, error } = await query.order('scheduled_at', { ascending: true });
  if (error) throw error;
  return data as FollowUp[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    { data: leads },
    { data: orders },
    { data: activities },
    { data: followUps }
  ] = await Promise.all([
    supabase.from('leads').select('status'),
    supabase.from('orders').select('status, amount'),
    supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('follow_ups')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_at', { ascending: true })
      .limit(5)
  ]);

  if (!leads || !orders || !activities || !followUps) {
    throw new Error('Failed to fetch dashboard stats');
  }

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    won: leads.filter(l => l.status === 'won').length,
    lost: leads.filter(l => l.status === 'lost').length
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  };

  return {
    leads: leadStats,
    orders: orderStats,
    recentActivities: activities as Activity[],
    upcomingFollowUps: followUps as FollowUp[]
  };
}

// Enhanced lead creation with analytics
export async function createEnhancedLead(leadData: any, analytics: any) {
  try {
    // Create the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();
    
    if (leadError) throw leadError;

    // Store enhanced analytics separately
    const { error: analyticsError } = await supabase
      .from('lead_analytics')
      .insert({
        lead_id: lead.id,
        form_version: 'enhanced_v2',
        time_spent: analytics.timeSpent,
        interests_selected: analytics.interests,
        urgency_level: analytics.urgency,
        budget_preference: analytics.budget,
        conversion_score: analytics.conversionScore || 85, // High score for enhanced form completion
        source_details: analytics.sourceDetails
      });

    if (analyticsError) {
      console.warn('Analytics storage failed:', analyticsError);
      // Don't fail the lead creation if analytics fails
    }

    return lead;
  } catch (error) {
    console.error('Enhanced lead creation failed:', error);
    // Fallback to standard lead creation
    return createLead(leadData);
  }
}