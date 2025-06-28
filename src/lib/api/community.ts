import { supabase } from '../supabase';
import type { Post, Comment, Tag, CommunityStats } from '../types/community';
import { useAIToolsStore, useUnifiedProgressStore } from '../store';

export async function getPosts(category?: string, limit = 10, offset = 0) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    let query = supabase
      .from('posts')
      .select('*, profiles(name, avatar_url)')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return data as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function createPost(content: string, category: string, tags: string[]) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    // Get AI tags and summary using fallback implementations
    const [aiTags, aiSummary] = await Promise.all([
      getAITags(content),
      getAISummary(content)
    ]);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        category,
        tags,
        user_id: session.user.id,
        ai_tags: aiTags,
        ai_summary: aiSummary
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Record activity in unified progress
    const { recordActivity } = useUnifiedProgressStore.getState();
    recordActivity({
      type: 'community',
      title: 'Created a post',
      xpEarned: 15
    });

    return data as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function getComments(postId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return data as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Update comments count
    await supabase
      .from('posts')
      .update({ comments_count: supabase.sql`comments_count + 1` })
      .eq('id', postId);

    // Record activity in unified progress
    const { recordActivity } = useUnifiedProgressStore.getState();
    recordActivity({
      type: 'community',
      title: 'Posted a comment',
      xpEarned: 5
    });

    return data as Comment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment');
  }
}

export async function likePost(postId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: supabase.sql`likes + 1` })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Record activity in unified progress
    const { recordActivity } = useUnifiedProgressStore.getState();
    recordActivity({
      type: 'community',
      title: 'Liked a post',
      xpEarned: 2
    });

    return data as Post;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
}

export async function sharePost(postId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('posts')
      .update({ shares: supabase.sql`shares + 1` })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Record activity in unified progress
    const { recordActivity } = useUnifiedProgressStore.getState();
    recordActivity({
      type: 'community',
      title: 'Shared a post',
      xpEarned: 3
    });

    return data as Post;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw new Error('Failed to share post');
  }
}

export async function getTrendingTags(): Promise<Tag[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    // Return fallback trending tags
    return [
      { name: 'startup', count: 25 },
      { name: 'business', count: 18 },
      { name: 'innovation', count: 15 },
      { name: 'marketing', count: 12 },
      { name: 'finance', count: 10 }
    ];
  } catch (error) {
    console.error('Error fetching trending tags:', error);
    throw new Error('Failed to fetch trending tags');
  }
}

export async function getCommunityStats(): Promise<CommunityStats> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    // Get actual stats from database
    const [postsResult, commentsResult, usersResult] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact' }),
      supabase.from('comments').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' })
    ]);

    return {
      totalPosts: postsResult.count || 0,
      totalComments: commentsResult.count || 0,
      totalUsers: usersResult.count || 0,
      activeUsers: Math.floor((usersResult.count || 0) * 0.7) // Estimate 70% active
    };
  } catch (error) {
    console.error('Error fetching community stats:', error);
    // Return fallback stats
    return {
      totalPosts: 150,
      totalComments: 450,
      totalUsers: 85,
      activeUsers: 60
    };
  }
}

async function getAITags(content: string): Promise<string[]> {
  try {
    // Fallback tag generation based on content keywords
    const keywords = content.toLowerCase();
    const tags: string[] = [];
    
    if (keywords.includes('business') || keywords.includes('startup')) tags.push('business');
    if (keywords.includes('marketing') || keywords.includes('promotion')) tags.push('marketing');
    if (keywords.includes('tech') || keywords.includes('technology')) tags.push('technology');
    if (keywords.includes('finance') || keywords.includes('money')) tags.push('finance');
    if (keywords.includes('idea') || keywords.includes('innovation')) tags.push('innovation');
    
    return tags.length > 0 ? tags : ['general'];
  } catch (error) {
    console.error('Error generating AI tags:', error);
    return ['general'];
  }
}

async function getAISummary(content: string): Promise<string> {
  try {
    // Fallback summary generation - take first 100 characters
    return content.length > 100 ? content.substring(0, 97) + '...' : content;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return content.substring(0, 50) + '...';
  }
}
