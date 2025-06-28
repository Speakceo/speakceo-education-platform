import { supabase } from '../supabase';
import type { Message, Poll, PollResponse, PollStats } from '../types/messages';

// Message functions
export async function getMessages(limit = 10, offset = 0) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from messages query');
    }

    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

export async function createMessage(content: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('messages')
      .insert({ content, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from message creation');
    }

    return data as Message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  }
}

export async function upvoteMessage(id: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('messages')
      .update({ upvotes: supabase.sql`upvotes + 1` })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from message upvote');
    }

    return data as Message;
  } catch (error) {
    console.error('Error upvoting message:', error);
    throw new Error('Failed to upvote message');
  }
}

// Poll functions
export async function getActivePolls() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from polls query');
    }

    return data as Poll[];
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw new Error('Failed to fetch polls');
  }
}

export async function getPollResponses(poll_id: string): Promise<PollStats> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data: responses, error: responsesError } = await supabase
      .from('poll_responses')
      .select('selected_option')
      .eq('poll_id', poll_id);

    if (responsesError) {
      console.error('Supabase error:', responsesError);
      throw new Error(responsesError.message);
    }

    if (!responses) {
      throw new Error('No data returned from poll responses query');
    }

    const total_responses = responses.length;
    const option_counts: Record<number, number> = {};
    let correct_count = 0;

    responses.forEach((response) => {
      option_counts[response.selected_option] = (option_counts[response.selected_option] || 0) + 1;
    });

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('correct_option')
      .eq('id', poll_id)
      .single();

    if (pollError) {
      console.error('Supabase error:', pollError);
      throw new Error(pollError.message);
    }

    if (poll) {
      correct_count = option_counts[poll.correct_option] || 0;
    }

    return {
      total_responses,
      option_counts,
      correct_percentage: total_responses > 0 ? (correct_count / total_responses) * 100 : 0
    };
  } catch (error) {
    console.error('Error fetching poll responses:', error);
    throw new Error('Failed to fetch poll responses');
  }
}

export async function submitPollResponse(poll_id: string, selected_option: number) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('poll_responses')
      .insert({
        poll_id,
        user_id: session.user.id,
        selected_option
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from poll response submission');
    }

    return data as PollResponse;
  } catch (error) {
    console.error('Error submitting poll response:', error);
    throw new Error('Failed to submit poll response');
  }
}

export async function getUserPollResponses(user_id: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('poll_responses')
      .select('poll_id')
      .eq('user_id', user_id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from user poll responses query');
    }

    return data.map(response => response.poll_id);
  } catch (error) {
    console.error('Error fetching user poll responses:', error);
    throw new Error('Failed to fetch user poll responses');
  }
}