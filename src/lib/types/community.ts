export interface Post {
  id: string;
  user_id: string;
  content: string;
  category: 'general' | 'question' | 'project' | 'idea' | 'event';
  tags: string[];
  likes: number;
  comments_count: number;
  shares: number;
  created_at: string;
  updated_at: string;
  ai_tags?: string[];
  ai_summary?: string;
  profiles?: {
    name: string;
    avatar_url: string;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  post_count: number;
}

export interface CommunityStats {
  total_posts: number;
  total_comments?: number;
  trending_tags?: Tag[];
  active_users: number;
}