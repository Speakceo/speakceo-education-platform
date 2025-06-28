/*
  # Create Career Guide Responses Table

  1. New Tables
    - `career_guide_responses`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, references leads)
      - `student_name` (text)
      - `age` (text)
      - `grade` (text)
      - `interests` (text[])
      - `self_assessment` (jsonb)
      - `future_preferences` (jsonb)
      - `learning_style` (jsonb)
      - `entrepreneurial_thinking` (jsonb)
      - `personality_type` (jsonb)
      - `additional_info` (jsonb)
      - `generated_report` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policy for authenticated users to create responses
*/

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'career_guide_responses' 
    AND policyname = 'Admins can access all career guide responses'
  ) THEN
    -- Create policy for admins
    CREATE POLICY "Admins can access all career guide responses"
      ON career_guide_responses
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Allow career guide lead creation'
  ) THEN
    -- Add policy for leads to allow career guide lead creation
    CREATE POLICY "Allow career guide lead creation"
      ON leads
      FOR INSERT
      TO authenticated
      WITH CHECK (
        source = 'career_guide'
      );
  END IF;
END $$;