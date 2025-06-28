/*
  # Reset Demo User Progress

  1. Updates
    - Reset progress to 0% for demo user
    - Reset points to 0
    - Clear any existing progress data
    - Set course_type to 'Basic'

  2. Purpose
    - Allow demo users to experience the full onboarding flow
    - Enable interaction with all dashboard features from the beginning
    - Provide a clean slate for testing and demonstration
*/

-- Create function to reset demo user
CREATE OR REPLACE FUNCTION reset_demo_user()
RETURNS void AS $$
DECLARE
  demo_user_id uuid;
BEGIN
  -- Get demo user ID by name
  SELECT id INTO demo_user_id
  FROM profiles
  WHERE name = 'Demo User'
  LIMIT 1;
  
  -- If demo user exists, reset their progress
  IF demo_user_id IS NOT NULL THEN
    -- Reset profile
    UPDATE profiles
    SET 
      progress = 0,
      points = 0,
      course_type = 'Basic'
    WHERE id = demo_user_id;
    
    -- Delete any task submissions
    DELETE FROM task_submissions
    WHERE user_id = demo_user_id;
    
    -- Delete any poll responses
    DELETE FROM poll_responses
    WHERE user_id = demo_user_id;
    
    -- Delete any messages
    DELETE FROM messages
    WHERE user_id = demo_user_id;
    
    -- Delete any posts
    DELETE FROM posts
    WHERE user_id = demo_user_id;
    
    -- Delete any comments
    DELETE FROM comments
    WHERE user_id = demo_user_id;
    
    -- Delete any project data
    DELETE FROM projects
    WHERE user_id = demo_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to reset demo user
SELECT reset_demo_user();