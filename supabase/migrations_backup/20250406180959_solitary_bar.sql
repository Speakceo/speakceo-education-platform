/*
  # Fix leads table RLS policies

  1. Security Changes
    - Add policy to allow inserting leads from career guide
    - Keep existing policies intact
    
  2. Notes
    - This ensures the career guide can create leads while maintaining security
*/

-- Add policy for career guide lead creation
CREATE POLICY "Allow career guide lead creation"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (
  source = 'career_guide'
);