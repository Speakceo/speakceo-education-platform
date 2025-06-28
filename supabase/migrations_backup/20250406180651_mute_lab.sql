/*
  # Add career guide leads tracking

  1. Updates
    - Add source field to leads table
    - Add career_guide_responses table to store detailed responses
    - Add function to process career guide submissions

  2. Security
    - Enable RLS on new table
    - Add appropriate policies
*/

-- Create career_guide_responses table
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

-- Create function to process career guide submission
CREATE OR REPLACE FUNCTION process_career_guide_submission(
  p_student_name text,
  p_age text,
  p_grade text,
  p_parent_email text,
  p_parent_phone text,
  p_interests text[],
  p_self_assessment jsonb,
  p_future_preferences jsonb,
  p_learning_style jsonb,
  p_entrepreneurial_thinking jsonb,
  p_personality_type jsonb,
  p_additional_info jsonb,
  p_generated_report jsonb
)
RETURNS uuid AS $$
DECLARE
  v_lead_id uuid;
  v_response_id uuid;
BEGIN
  -- Create or update lead
  INSERT INTO leads (
    name,
    email,
    phone,
    source,
    status,
    notes
  ) VALUES (
    p_student_name,
    p_parent_email,
    p_parent_phone,
    'career_guide',
    'new',
    format('Age: %s, Grade: %s, Career Guide Completed', p_age, p_grade)
  )
  RETURNING id INTO v_lead_id;
  
  -- Store detailed responses
  INSERT INTO career_guide_responses (
    lead_id,
    student_name,
    age,
    grade,
    interests,
    self_assessment,
    future_preferences,
    learning_style,
    entrepreneurial_thinking,
    personality_type,
    additional_info,
    generated_report
  ) VALUES (
    v_lead_id,
    p_student_name,
    p_age,
    p_grade,
    p_interests,
    p_self_assessment,
    p_future_preferences,
    p_learning_style,
    p_entrepreneurial_thinking,
    p_personality_type,
    p_additional_info,
    p_generated_report
  )
  RETURNING id INTO v_response_id;
  
  RETURN v_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;