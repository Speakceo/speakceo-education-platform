/*
  # Create Messages and Polls System with Safe Policy Creation
  
  1. Create tables if not exist:
    - messages
    - polls
    - poll_responses
  
  2. Enable RLS and create policies safely
  3. Add sample poll data
*/

-- Create messages table if not exists
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  ai_response text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create polls table if not exists
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  options jsonb NOT NULL,
  correct_option integer NOT NULL,
  explanation text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create poll_responses table if not exists
CREATE TABLE IF NOT EXISTS poll_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id),
  user_id uuid REFERENCES profiles(id),
  selected_option integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;

-- Safely create policies by dropping existing ones first
DROP POLICY IF EXISTS "Users can read all messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can read active polls" ON polls;
DROP POLICY IF EXISTS "Users can read their own responses" ON poll_responses;
DROP POLICY IF EXISTS "Users can create responses" ON poll_responses;

-- Create policies for messages
CREATE POLICY "Users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for polls
CREATE POLICY "Users can read active polls"
  ON polls
  FOR SELECT
  TO authenticated
  USING (active = true OR expires_at > now());

-- Create policies for poll_responses
CREATE POLICY "Users can read their own responses"
  ON poll_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create responses"
  ON poll_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
DECLARE
  _now timestamptz := now();
BEGIN
  NEW.updated_at := _now;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for messages
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample polls if they don't exist
INSERT INTO polls (title, description, options, correct_option, explanation, expires_at)
SELECT
  'Market Research Strategy',
  'A new competitor has entered your market. What''s your first step?',
  '["Analyze competitor''s pricing", "Survey current customers", "Launch a promotional campaign", "Ignore them and focus on your business"]'::jsonb,
  1,
  'Understanding your customers'' needs and preferences helps you make informed decisions about how to respond to competition.',
  now() + interval '7 days'
WHERE NOT EXISTS (
  SELECT 1 FROM polls WHERE title = 'Market Research Strategy'
);

INSERT INTO polls (title, description, options, correct_option, explanation, expires_at)
SELECT
  'Financial Decision Making',
  'You have ₹10,000 to invest in your business. What''s the best use?',
  '["Buy new equipment", "Invest in marketing", "Save for emergencies", "Hire part-time help"]'::jsonb,
  2,
  'Marketing can help increase sales and grow your customer base, leading to more revenue that can fund other business needs.',
  now() + interval '7 days'
WHERE NOT EXISTS (
  SELECT 1 FROM polls WHERE title = 'Financial Decision Making'
);

INSERT INTO polls (title, description, options, correct_option, explanation, expires_at)
SELECT
  'Customer Service Challenge',
  'A customer is unhappy with your product. What do you do first?',
  '["Offer a refund immediately", "Listen to their complaint fully", "Defend your product quality", "Refer them to your policy"]'::jsonb,
  1,
  'Active listening helps understand the customer''s issue and shows you value their feedback, leading to better resolution.',
  now() + interval '7 days'
WHERE NOT EXISTS (
  SELECT 1 FROM polls WHERE title = 'Customer Service Challenge'
);