-- Seed data for the startup school database

-- Insert sample users (profiles)
INSERT INTO profiles (id, email, name, avatar_url, role, status, course_type, progress) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@speakceo.com', 'Admin User', 'https://ui-avatars.com/api/?name=Admin+User', 'admin', 'active', 'Premium', 100),
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', 'https://ui-avatars.com/api/?name=John+Doe', 'user', 'active', 'Premium', 75),
('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane Smith', 'https://ui-avatars.com/api/?name=Jane+Smith', 'user', 'active', 'Basic', 45),
('33333333-3333-3333-3333-333333333333', 'mike.johnson@example.com', 'Mike Johnson', 'https://ui-avatars.com/api/?name=Mike+Johnson', 'user', 'active', 'Premium', 90),
('44444444-4444-4444-4444-444444444444', 'sarah.wilson@example.com', 'Sarah Wilson', 'https://ui-avatars.com/api/?name=Sarah+Wilson', 'user', 'active', 'Basic', 30),
('55555555-5555-5555-5555-555555555555', 'david.brown@example.com', 'David Brown', 'https://ui-avatars.com/api/?name=David+Brown', 'user', 'inactive', 'Premium', 60),
('66666666-6666-6666-6666-666666666666', 'emily.davis@example.com', 'Emily Davis', 'https://ui-avatars.com/api/?name=Emily+Davis', 'user', 'active', 'Premium', 85),
('77777777-7777-7777-7777-777777777777', 'chris.miller@example.com', 'Chris Miller', 'https://ui-avatars.com/api/?name=Chris+Miller', 'user', 'active', 'Basic', 20)
ON CONFLICT (id) DO NOTHING;

-- Insert modules
INSERT INTO modules (id, title, description, "order", duration, image_url, status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Startup Fundamentals', 'Learn the essential concepts of starting and running a successful business', 1, '2 weeks', 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400', 'active'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Business Planning', 'Create comprehensive business plans and strategies', 2, '3 weeks', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 'active'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Financial Management', 'Master financial planning and management for entrepreneurs', 3, '2 weeks', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'active'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Marketing & Sales', 'Learn effective marketing strategies and sales techniques', 4, '3 weeks', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert lessons
INSERT INTO lessons (id, module_id, title, type, duration, description, "order", status, points, content, url) VALUES
-- Startup Fundamentals lessons
('lesson01-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Introduction to Entrepreneurship', 'video', '45 min', 'Overview of entrepreneurial mindset and opportunities', 1, 'active', 50, 'This lesson covers the fundamental concepts of entrepreneurship...', 'https://example.com/video1'),
('lesson02-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Identifying Market Opportunities', 'text', '30 min', 'Learn how to spot and evaluate business opportunities', 2, 'active', 75, 'Market research and opportunity identification techniques...', null),
('lesson03-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Building Your MVP', 'video', '60 min', 'Create your minimum viable product efficiently', 3, 'active', 100, 'Step-by-step guide to MVP development...', 'https://example.com/video2'),

-- Business Planning lessons
('lesson04-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Writing a Business Plan', 'document', '90 min', 'Step-by-step guide to creating effective business plans', 1, 'active', 100, 'Business plan components and best practices...', 'https://example.com/business-plan-template'),
('lesson05-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Market Analysis', 'text', '45 min', 'Conduct thorough market research and analysis', 2, 'active', 75, 'Market analysis frameworks and tools...', null),
('lesson06-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Competitive Analysis', 'video', '50 min', 'Analyze competitors and position your business', 3, 'active', 80, 'Competitive analysis strategies...', 'https://example.com/video3'),

-- Financial Management lessons
('lesson07-0000-0000-0000-000000000007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Financial Projections', 'spreadsheet', '90 min', 'Create realistic financial forecasts for your business', 1, 'active', 125, 'Financial modeling and projection techniques...', 'https://example.com/financial-template'),
('lesson08-0000-0000-0000-000000000008', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Funding Options', 'video', '40 min', 'Explore different funding sources for startups', 2, 'active', 60, 'Overview of funding options...', 'https://example.com/video4'),
('lesson09-0000-0000-0000-000000000009', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Cash Flow Management', 'text', '35 min', 'Manage cash flow effectively in your business', 3, 'active', 70, 'Cash flow management best practices...', null),

-- Marketing & Sales lessons
('lesson10-0000-0000-0000-000000000010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Digital Marketing Fundamentals', 'video', '55 min', 'Learn the basics of digital marketing', 1, 'active', 85, 'Digital marketing strategies and channels...', 'https://example.com/video5'),
('lesson11-0000-0000-0000-000000000011', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sales Techniques', 'text', '40 min', 'Master effective sales techniques and strategies', 2, 'active', 75, 'Sales process and techniques...', null),
('lesson12-0000-0000-0000-000000000012', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Customer Retention', 'video', '45 min', 'Build long-term customer relationships', 3, 'active', 80, 'Customer retention strategies...', 'https://example.com/video6')
ON CONFLICT (id) DO NOTHING;

-- Insert live classes
INSERT INTO live_classes (id, title, description, instructor_id, date, start_time, end_time, duration, duration_minutes, category, level, tags, max_attendees, attendees, status, join_url) VALUES
('liveclass1-0000-0000-0000-000000000001', 'Business Strategy Masterclass', 'Learn the fundamentals of building a successful business strategy', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '1 day', '14:00', '15:30', '1 hour 30 minutes', 90, 'Business Strategy', 'Intermediate', ARRAY['strategy', 'planning', 'business'], 30, 8, 'scheduled', 'https://meet.example.com/business-strategy'),
('liveclass2-0000-0000-0000-000000000002', 'Financial Planning Workshop', 'Master the art of financial planning for entrepreneurs', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '3 days', '10:00', '12:00', '2 hours', 120, 'Finance', 'Beginner', ARRAY['finance', 'planning', 'budgeting'], 25, 15, 'scheduled', 'https://meet.example.com/financial-planning'),
('liveclass3-0000-0000-0000-000000000003', 'Marketing Fundamentals', 'Essential marketing strategies for startups', '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '5 days', '16:00', '17:30', '1 hour 30 minutes', 90, 'Marketing', 'Beginner', ARRAY['marketing', 'digital', 'strategy'], 40, 22, 'scheduled', 'https://meet.example.com/marketing-fundamentals')
ON CONFLICT (id) DO NOTHING;

-- Insert tasks
INSERT INTO tasks (id, title, description, type, week_number, points, due_date, live_discussion, status) VALUES
('task0001-0000-0000-0000-000000000001', 'Business Idea Validation', 'Research and validate your business idea using customer interviews and market analysis', 'assignment', 1, 100, NOW() + INTERVAL '7 days', true, 'active'),
('task0002-0000-0000-0000-000000000002', 'Create Your Business Model Canvas', 'Develop a comprehensive business model canvas for your startup idea', 'file_upload', 2, 150, NOW() + INTERVAL '14 days', false, 'active'),
('task0003-0000-0000-0000-000000000003', 'Financial Projections Quiz', 'Test your understanding of financial projections and forecasting', 'multiple_choice', 3, 75, NOW() + INTERVAL '21 days', false, 'active'),
('task0004-0000-0000-0000-000000000004', 'Pitch Deck Creation', 'Create a compelling pitch deck for your startup', 'presentation', 4, 200, NOW() + INTERVAL '28 days', true, 'active'),
('task0005-0000-0000-0000-000000000005', 'Market Research Report', 'Conduct thorough market research and create a detailed report', 'text_response', 2, 125, NOW() + INTERVAL '10 days', false, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert user progress
INSERT INTO user_progress (user_id, module_id, lesson_id, completed, score, completed_at) VALUES
-- John Doe progress
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson01-0000-0000-0000-000000000001', true, 85, NOW() - INTERVAL '5 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson02-0000-0000-0000-000000000002', true, 92, NOW() - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson03-0000-0000-0000-000000000003', true, 78, NOW() - INTERVAL '3 days'),
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'lesson04-0000-0000-0000-000000000004', true, 88, NOW() - INTERVAL '2 days'),

-- Jane Smith progress
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson01-0000-0000-0000-000000000001', true, 75, NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson02-0000-0000-0000-000000000002', true, 82, NOW() - INTERVAL '2 days'),

-- Mike Johnson progress
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson01-0000-0000-0000-000000000001', true, 95, NOW() - INTERVAL '6 days'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson02-0000-0000-0000-000000000002', true, 90, NOW() - INTERVAL '5 days'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lesson03-0000-0000-0000-000000000003', true, 87, NOW() - INTERVAL '4 days'),
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'lesson04-0000-0000-0000-000000000004', true, 93, NOW() - INTERVAL '3 days'),
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'lesson05-0000-0000-0000-000000000005', true, 89, NOW() - INTERVAL '2 days'),
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'lesson07-0000-0000-0000-000000000007', true, 91, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Insert task submissions
INSERT INTO task_submissions (user_id, task_id, content, status, score, feedback, submitted_at, reviewed_at) VALUES
('11111111-1111-1111-1111-111111111111', 'task0001-0000-0000-0000-000000000001', 'I conducted 15 customer interviews and found strong demand for my SaaS product idea. Market size is estimated at $2B with 25% annual growth.', 'reviewed', 85, 'Great research! Consider expanding your target market analysis.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'task0001-0000-0000-0000-000000000001', 'Completed validation study for my e-commerce platform. Interviewed 10 potential customers and received positive feedback.', 'submitted', 0, null, NOW() - INTERVAL '1 day', null),
('33333333-3333-3333-3333-333333333333', 'task0001-0000-0000-0000-000000000001', 'Extensive market research completed for my fintech startup. Identified key pain points and validated solution-market fit.', 'approved', 95, 'Excellent work! Your research methodology is thorough and findings are well-documented.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('33333333-3333-3333-3333-333333333333', 'task0002-0000-0000-0000-000000000002', 'Business model canvas completed with detailed value propositions and revenue streams.', 'reviewed', 88, 'Well structured canvas. Consider refining your key partnerships section.', NOW() - INTERVAL '1 day', NOW())
ON CONFLICT (user_id, task_id) DO NOTHING; 