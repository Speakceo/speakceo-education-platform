import { supabase } from './supabase';

// Lead Types and Interfaces
export interface Lead {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  child_name?: string;
  child_age?: number;
  source: LeadSource;
  status: LeadStatus;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  last_contacted_at?: string;
  next_follow_up?: string;
}

export enum LeadSource {
  WEBSITE = 'website',
  ENROLLMENT_POPUP = 'enrollment_popup',
  CAREER_GUIDE = 'career_guide',
  NEWSLETTER = 'newsletter',
  CONTACT_FORM = 'contact_form',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  PAID_ADS = 'paid_ads',
  ORGANIC_SEARCH = 'organic_search'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  INTERESTED = 'interested',
  ENROLLED = 'enrolled',
  NOT_INTERESTED = 'not_interested',
  LOST = 'lost'
}

export interface LeadFormData {
  email: string;
  name?: string;
  phone?: string;
  child_name?: string;
  child_age?: number;
  source: LeadSource;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notes?: string;
}

// Database Setup
export async function setupLeadsDatabase() {
  try {
    // Create leads table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS leads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          phone VARCHAR(50),
          child_name VARCHAR(255),
          child_age INTEGER,
          source VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'new',
          utm_source VARCHAR(255),
          utm_medium VARCHAR(255),
          utm_campaign VARCHAR(255),
          notes TEXT,
          tags TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_contacted_at TIMESTAMP WITH TIME ZONE,
          next_follow_up TIMESTAMP WITH TIME ZONE,
          UNIQUE(email)
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
        CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
        CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
        CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
      `
    });

    if (tableError) {
      console.error('Error creating leads table:', tableError);
    } else {
      console.log('Leads database setup completed');
    }
  } catch (error) {
    console.error('Error setting up leads database:', error);
  }
}

// Lead Management Functions
export async function createLead(leadData: LeadFormData): Promise<Lead> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        status: LeadStatus.NEW,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function getAllLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (status === LeadStatus.CONTACTED) {
      updateData.last_contacted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
}

// Utility Functions
export function getLeadSourceLabel(source: LeadSource): string {
  const labels: Record<LeadSource, string> = {
    [LeadSource.WEBSITE]: 'Website',
    [LeadSource.ENROLLMENT_POPUP]: 'Enrollment Popup',
    [LeadSource.CAREER_GUIDE]: 'Career Guide Download',
    [LeadSource.NEWSLETTER]: 'Newsletter Signup',
    [LeadSource.CONTACT_FORM]: 'Contact Form',
    [LeadSource.SOCIAL_MEDIA]: 'Social Media',
    [LeadSource.REFERRAL]: 'Referral',
    [LeadSource.PAID_ADS]: 'Paid Advertising',
    [LeadSource.ORGANIC_SEARCH]: 'Organic Search'
  };
  return labels[source];
}

export function getUTMParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined
  };
}
