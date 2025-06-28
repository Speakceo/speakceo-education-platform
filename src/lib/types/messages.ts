export interface Message {
  id: string;
  user_id: string;
  content: string;
  ai_response: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  options: string[];
  correct_option: number;
  explanation: string | null;
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface PollResponse {
  id: string;
  poll_id: string;
  user_id: string;
  selected_option: number;
  created_at: string;
}

export interface PollStats {
  total_responses: number;
  option_counts: Record<number, number>;
  correct_percentage: number;
}