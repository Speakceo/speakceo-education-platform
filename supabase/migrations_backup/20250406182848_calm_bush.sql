/*
  # Add career guide responses table and policies

  1. New Tables
    - `career_guide_responses`
      - Stores detailed responses from career guide questionnaire
      - Links to leads table for CRM integration
      - Includes AI-generated report data

  2. Security
    - Enable RLS on career_guide_responses table
    - Add policies for admin access and creation
*/

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'career_guide_responses' 
    AND policyname = 'Admins can access all career guide responses'
  ) THEN
    -- Create career_guide_responses table if it doesn't exist
    CREATE TABLE IF NOT EXISTS career_guide_responses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id uuid REFERENCES leads(id),
      student_name text NOT NULL,
      age text NOT NULL,
      grade text NOT NULL,
      interests text[] DEFAULT '{}',
      self_assessment jsonb,
      future_preferences jsonb,
      learning_style jsonb,
      entrepreneurial_thinking jsonb,
      personality_type jsonb,
      additional_info jsonb,
      generated_report jsonb,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE career_guide_responses ENABLE ROW LEVEL SECURITY;

    -- Create policies for career_guide_responses
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
    WHERE tablename = 'career_guide_responses' 
    AND policyname = 'Authenticated users can create career guide responses'
  ) THEN
    -- Add policy for authenticated users to create career guide responses
    CREATE POLICY "Authenticated users can create career guide responses"
      ON career_guide_responses
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
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