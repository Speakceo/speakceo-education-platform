/*
  # Fix leads table RLS policies

  1. Changes
    - Add new RLS policy to allow career guide lead creation
    - Modify existing policies to handle career guide leads

  2. Security
    - Maintains existing RLS policies
    - Adds specific policy for career guide leads
    - Ensures proper access control
*/

-- Drop existing policy for career guide lead creation if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'leads' 
    AND policyname = 'Allow career guide lead creation'
  ) THEN
    DROP POLICY "Allow career guide lead creation" ON public.leads;
  END IF;
END $$;

-- Create new policy for career guide lead creation
CREATE POLICY "Allow career guide lead creation"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  source = 'career_guide'
);

-- Update existing policy for assigned users to handle career guide leads
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'leads' 
    AND policyname = 'Assigned users can insert leads'
  ) THEN
    DROP POLICY "Assigned users can insert leads" ON public.leads;
  END IF;
END $$;

CREATE POLICY "Assigned users can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  assigned_to = auth.uid() OR
  source = 'career_guide'
);