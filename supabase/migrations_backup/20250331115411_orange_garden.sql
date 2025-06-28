/*
  # Create messages and polls tables

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `content` (text)
      - `ai_response` (text)
      - `upvotes` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `polls`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `options` (jsonb)
      - `correct_option` (integer)
      - `explanation` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

    - `poll_responses`
      - `id` (uuid, primary key)
      - `poll_id` (uuid) - References polls
      - `user_id` (uuid) - References profiles
      - `selected_option` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  ai_response text,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create polls table
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

-- Create poll_responses table
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
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();