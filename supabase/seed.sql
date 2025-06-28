-- Basic seed data with real database integration

-- Insert admin user
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@speakceo.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","role":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert sample auth users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES 
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'john.doe@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"John Doe","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'jane.smith@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Jane Smith","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'mike.johnson@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Mike Johnson","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'sarah.wilson@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Sarah Wilson","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'david.brown@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"David Brown","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'emily.davis@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Emily Davis","role":"student"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated', 'chris.miller@example.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Chris Miller","role":"student"}', NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
INSERT INTO profiles (id, email, name, avatar_url, role, status, course_type, progress, points) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@speakceo.com', 'Admin User', 'https://ui-avatars.com/api/?name=Admin+User', 'admin', 'active', 'Premium', 100, 0)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Insert sample users
INSERT INTO profiles (id, email, name, avatar_url, role, status, course_type, progress, points) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', 'https://ui-avatars.com/api/?name=John+Doe', 'student', 'active', 'Premium', 75, 850),
('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane Smith', 'https://ui-avatars.com/api/?name=Jane+Smith', 'student', 'active', 'Basic', 45, 540),
('33333333-3333-3333-3333-333333333333', 'mike.johnson@example.com', 'Mike Johnson', 'https://ui-avatars.com/api/?name=Mike+Johnson', 'student', 'active', 'Premium', 90, 1200),
('44444444-4444-4444-4444-444444444444', 'sarah.wilson@example.com', 'Sarah Wilson', 'https://ui-avatars.com/api/?name=Sarah+Wilson', 'student', 'active', 'Basic', 30, 350),
('55555555-5555-5555-5555-555555555555', 'david.brown@example.com', 'David Brown', 'https://ui-avatars.com/api/?name=David+Brown', 'student', 'inactive', 'Premium', 60, 720),
('66666666-6666-6666-6666-666666666666', 'emily.davis@example.com', 'Emily Davis', 'https://ui-avatars.com/api/?name=Emily+Davis', 'student', 'active', 'Premium', 85, 980),
('77777777-7777-7777-7777-777777777777', 'chris.miller@example.com', 'Chris Miller', 'https://ui-avatars.com/api/?name=Chris+Miller', 'student', 'active', 'Basic', 20, 200)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  progress = EXCLUDED.progress,
  points = EXCLUDED.points;

-- Insert sample modules using UUID generation
INSERT INTO modules (title, description, "order", order_index, duration, image_url, status) VALUES
('Startup Fundamentals', 'Learn the essential concepts of starting and running a successful business', 1, 1, '2 weeks', 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400', 'active'),
('Business Planning', 'Create comprehensive business plans and strategies', 2, 2, '3 weeks', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 'active'),
('Financial Management', 'Master financial planning and management for entrepreneurs', 3, 3, '2 weeks', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'active'),
('Marketing & Sales', 'Learn effective marketing strategies and sales techniques', 4, 4, '3 weeks', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'active');

-- Insert sample tasks with UUID generation
INSERT INTO tasks (title, description, type, week_number, points, due_date, live_discussion, status) VALUES
('Business Idea Validation', 'Research and validate your business idea using customer interviews and market analysis', 'assignment', 1, 100, NOW() + INTERVAL '7 days', true, 'active'),
('Create Your Business Model Canvas', 'Develop a comprehensive business model canvas for your startup idea', 'file_upload', 2, 150, NOW() + INTERVAL '14 days', false, 'active'),
('Financial Projections Quiz', 'Test your understanding of financial projections and forecasting', 'multiple_choice', 3, 75, NOW() + INTERVAL '21 days', false, 'active'),
('Pitch Deck Creation', 'Create a compelling pitch deck for your startup', 'presentation', 4, 200, NOW() + INTERVAL '28 days', true, 'active'),
('Market Research Report', 'Conduct thorough market research and create a detailed report', 'text_response', 2, 125, NOW() + INTERVAL '10 days', false, 'active');

-- Insert sample live classes
INSERT INTO live_classes (title, description, instructor_id, scheduled_at, date, start_time, end_time, duration, duration_minutes, category, level, tags, max_attendees, attendees, status, join_url) VALUES
('Business Strategy Masterclass', 'Learn the fundamentals of building a successful business strategy', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day', '14:00', '15:30', '1 hour 30 minutes', 90, 'Business Strategy', 'Intermediate', ARRAY['strategy', 'planning', 'business'], 30, 8, 'scheduled', 'https://meet.example.com/business-strategy'),
('Financial Planning Workshop', 'Master the art of financial planning for entrepreneurs', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days', '10:00', '12:00', '2 hours', 120, 'Finance', 'Beginner', ARRAY['finance', 'planning', 'budgeting'], 25, 15, 'scheduled', 'https://meet.example.com/financial-planning'),
('Marketing Fundamentals', 'Essential marketing strategies for startups', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days', '16:00', '17:30', '1 hour 30 minutes', 90, 'Marketing', 'Beginner', ARRAY['marketing', 'digital', 'strategy'], 40, 22, 'scheduled', 'https://meet.example.com/marketing-fundamentals'); 