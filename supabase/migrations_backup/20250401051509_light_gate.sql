/*
  # Add admin role and create demo admin account

  1. Updates
    - Add role column to profiles table
    - Create demo admin user
    - Add admin-specific policies

  2. Security
    - Only admins can access admin features
    - Admin role is protected by RLS
*/

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'::text
CHECK (role IN ('user', 'admin'));

-- Create function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text,
  admin_password text,
  admin_name text,
  admin_avatar_url text
)
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create auth user
  new_user_id := (
    SELECT id FROM auth.users 
    WHERE auth.users.email = admin_email
  );
  
  IF new_user_id IS NULL THEN
    new_user_id := (
      SELECT id FROM auth.users
      WHERE auth.users.email = (
        SELECT current_setting('request.jwt.claim.email', true)
      )
    );
    
    IF new_user_id IS NULL THEN
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        json_build_object(
          'name', admin_name,
          'avatar_url', admin_avatar_url
        ),
        now(),
        now(),
        '',
        '',
        '',
        ''
      )
      RETURNING id INTO new_user_id;
    END IF;
  END IF;

  -- Create or update profile
  INSERT INTO public.profiles (
    id,
    name,
    avatar_url,
    role,
    course_type,
    progress,
    points
  )
  VALUES (
    new_user_id,
    admin_name,
    admin_avatar_url,
    'admin',
    'Premium',
    100,
    5000
  )
  ON CONFLICT (id) DO UPDATE
  SET
    role = 'admin',
    course_type = 'Premium',
    progress = 100,
    points = 5000;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create demo admin user
SELECT create_admin_user(
  'admin@speakceo.com',
  'Admin123!',
  'Admin User',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80'
);

-- Update existing policies to include admin access
DROP POLICY IF EXISTS "Admins can access all leads" ON leads;
CREATE POLICY "Admins can access all leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR assigned_to = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can access all orders" ON orders;
CREATE POLICY "Admins can access all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = orders.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can access all activities" ON activities;
CREATE POLICY "Admins can access all activities"
  ON activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = activities.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can access all follow_ups" ON follow_ups;
CREATE POLICY "Admins can access all follow_ups"
  ON follow_ups
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = follow_ups.lead_id
      AND leads.assigned_to = auth.uid()
    )
  );

-- Add admin-specific policies for tasks
DROP POLICY IF EXISTS "Admins can manage tasks" ON tasks;
CREATE POLICY "Admins can manage tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add admin-specific policies for task submissions
DROP POLICY IF EXISTS "Admins can access all submissions" ON task_submissions;
CREATE POLICY "Admins can access all submissions"
  ON task_submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );