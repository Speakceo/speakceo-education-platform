/*
  # Create Demo User Account

  1. Creates a demo user with:
    - Basic profile information
    - Premium course access
    - Sample progress and points
    - Pre-configured settings

  2. Security
    - Password is hashed
    - Account is pre-confirmed
    - Regular user role (not admin)
*/

-- Create function to create demo user
CREATE OR REPLACE FUNCTION create_demo_user(
  demo_email text,
  demo_password text,
  demo_name text,
  demo_avatar_url text
)
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO new_user_id
  FROM auth.users 
  WHERE auth.users.email = demo_email;
  
  -- If user doesn't exist, create new user
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
      demo_email,
      crypt(demo_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object(
        'name', demo_name,
        'avatar_url', demo_avatar_url
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
    demo_name,
    demo_avatar_url,
    'user',
    'Premium',
    35,
    750
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = demo_name,
    avatar_url = demo_avatar_url,
    role = 'user',
    course_type = 'Premium',
    progress = 35,
    points = 750;

  -- Create or update user progress
  INSERT INTO public.user_progress (
    user_id,
    completed_lessons,
    completed_tasks,
    last_activity,
    streak,
    total_points,
    tool_usage
  )
  VALUES (
    new_user_id,
    '{}',
    '{}',
    now(),
    0,
    750,
    '{}'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    last_activity = now(),
    streak = 0,
    total_points = 750;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create demo user
SELECT create_demo_user(
  'demo@speakceo.com',
  'Demo123!',
  'Demo User',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80'
);