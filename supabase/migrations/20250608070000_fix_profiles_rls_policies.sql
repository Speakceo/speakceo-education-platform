-- Fix infinite recursion in profiles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create simpler policies that don't cause recursion

-- Allow admin users (based on JWT email) to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    -- Check if user email is admin email
    auth.jwt() ->> 'email' = 'admin@speakceo.ai'
  );

-- Allow admin users to update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    -- Check if user email is admin email
    auth.jwt() ->> 'email' = 'admin@speakceo.ai'
  );

-- Add policy for admin inserts
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@speakceo.ai'
    OR
    -- Allow users to create their own profile
    auth.uid() = id
  );

-- Add policy for admin deletes
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (
    auth.jwt() ->> 'email' = 'admin@speakceo.ai'
  ); 