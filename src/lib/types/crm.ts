export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  assigned_to: string | null;
  last_contacted: string | null;
  notes: string | null;
  child_name?: string;
  parent_name?: string;
  child_age?: string;
  city?: string;
  interests?: string[];
  aspirations?: string;
  urgency?: string;
  budget_range?: string;
  previous_experience?: string;
  heard_about_us?: string;
  preferred_contact?: string;
  form_completion_time?: number;
  conversion_score?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  lead_id: string;
  course_type: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'completed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id: string;
  user_id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  created_at: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  user_id: string;
  scheduled_at: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  won: number;
  lost: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  revenue: number;
}

export interface DashboardStats {
  leads: LeadStats;
  orders: OrderStats;
  recentActivities: Activity[];
  upcomingFollowUps: FollowUp[];
}