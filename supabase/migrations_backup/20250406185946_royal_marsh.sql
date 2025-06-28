/*
  # Update leads table RLS policies

  1. Changes
    - Add new RLS policy to allow authenticated users to insert leads from career guide
    - Modify existing policy to be more permissive for authenticated users

  2. Security
    - Maintains RLS enabled on leads table
    - Ensures users can only create leads with appropriate source
    - Preserves admin access to all leads
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow career guide lead creation" ON leads;
DROP POLICY IF EXISTS "Assigned users can insert leads" ON leads;

-- Create new policies with updated permissions
CREATE POLICY "Allow career guide lead creation"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (
  source = 'career_guide'
);

CREATE POLICY "Assigned users can insert leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (
  (assigned_to = auth.uid()) OR (source = 'career_guide')
);

-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;