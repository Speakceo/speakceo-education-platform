/*
  # Add 24 Weekly Tasks with Multiple Upload Options

  1. New Tasks
    - 24 tasks spread across 12 weeks
    - Each task supports multiple submission types (voice, PDF, image)
    - Points and deadlines for each task
    - Live discussion flags for relevant tasks

  2. Security
    - RLS policies remain unchanged
    - Users can only access their own submissions
*/

-- Insert all 24 tasks
INSERT INTO tasks (title, description, type, week_number, points, due_date, live_discussion)
VALUES
  -- Week 1: Foundations of Entrepreneurship
  (
    'Define Your Startup Idea',
    'Create a compelling one-sentence pitch for your startup idea. Submit as text or record a voice memo explaining your concept.',
    'file_upload',
    1,
    100,
    (now() + interval '7 days'),
    false
  ),
  (
    'Customer Persona Creation',
    'Design a detailed customer persona. Submit as a PDF document or create an infographic image.',
    'file_upload',
    1,
    150,
    (now() + interval '7 days'),
    true
  ),

  -- Week 2: Personal Branding & Communication
  (
    'Personal Brand Statement',
    'Write your personal brand statement and record yourself presenting it. Submit both written text and voice recording.',
    'file_upload',
    2,
    125,
    (now() + interval '14 days'),
    false
  ),
  (
    'Introduction Video',
    'Create a 30-second video introducing yourself and your business idea. Submit video file or voice recording.',
    'file_upload',
    2,
    200,
    (now() + interval '14 days'),
    true
  ),

  -- Week 3: Market Research & Ideation
  (
    'Market Research Report',
    'Conduct basic market research and present your findings. Submit as PDF report with optional voice commentary.',
    'file_upload',
    3,
    175,
    (now() + interval '21 days'),
    false
  ),
  (
    'Competitor Analysis',
    'Analyze your top 3 competitors. Create a comparison chart as image or detailed PDF document.',
    'file_upload',
    3,
    150,
    (now() + interval '21 days'),
    true
  ),

  -- Week 4: Financial Literacy Basics
  (
    'Personal Budget Plan',
    'Create a monthly budget plan. Submit as spreadsheet PDF or explain your approach in a voice recording.',
    'file_upload',
    4,
    125,
    (now() + interval '28 days'),
    false
  ),
  (
    'Expense Tracking Report',
    'Track your expenses for a week and analyze patterns. Submit as PDF report with charts/images.',
    'file_upload',
    4,
    150,
    (now() + interval '28 days'),
    true
  ),

  -- Week 5: Business Model & Value Proposition
  (
    'Business Model Canvas',
    'Complete your business model canvas. Submit as PDF or image with voice explanation.',
    'file_upload',
    5,
    200,
    (now() + interval '35 days'),
    false
  ),
  (
    'Value Proposition Design',
    'Design your unique value proposition. Submit as text with supporting visuals.',
    'file_upload',
    5,
    175,
    (now() + interval '35 days'),
    true
  ),

  -- Week 6: Branding & Logo Creation
  (
    'Logo Design',
    'Design your business logo. Submit the logo image with explanation of design choices.',
    'file_upload',
    6,
    150,
    (now() + interval '42 days'),
    false
  ),
  (
    'Brand Identity Package',
    'Create your brand identity package including colors and fonts. Submit as PDF presentation.',
    'file_upload',
    6,
    200,
    (now() + interval '42 days'),
    true
  ),

  -- Week 7: Financial Planning & Revenue Models
  (
    'Revenue Streams Analysis',
    'Identify and analyze potential revenue streams. Submit as PDF or voice presentation.',
    'file_upload',
    7,
    175,
    (now() + interval '49 days'),
    false
  ),
  (
    'Pricing Strategy',
    'Develop your pricing strategy. Submit as PDF with calculations and market research.',
    'file_upload',
    7,
    150,
    (now() + interval '49 days'),
    true
  ),

  -- Week 8: Public Speaking & Confidence
  (
    'Pitch Recording',
    'Record a 1-minute pitch about your startup idea. Submit as voice or video recording.',
    'file_upload',
    8,
    200,
    (now() + interval '56 days'),
    false
  ),
  (
    'Debate Participation',
    'Participate in a live debate session and submit your preparation notes as PDF.',
    'file_upload',
    8,
    175,
    (now() + interval '56 days'),
    true
  ),

  -- Week 9: Marketing & Social Media
  (
    'Social Media Strategy',
    'Create a social media content strategy. Submit as PDF plan with sample posts as images.',
    'file_upload',
    9,
    150,
    (now() + interval '63 days'),
    false
  ),
  (
    'Marketing Campaign Design',
    'Design a marketing campaign. Submit as presentation with voice narration.',
    'file_upload',
    9,
    200,
    (now() + interval '63 days'),
    true
  ),

  -- Week 10: Business Operations & Team Building
  (
    'Organization Structure',
    'Create your startup''s organizational structure. Submit as PDF or image diagram.',
    'file_upload',
    10,
    125,
    (now() + interval '70 days'),
    false
  ),
  (
    'Team Roles Document',
    'Define key roles and responsibilities. Submit as PDF with voice explanation.',
    'file_upload',
    10,
    150,
    (now() + interval '70 days'),
    true
  ),

  -- Week 11: Pitching & Fundraising
  (
    'Pitch Deck',
    'Create your investor pitch deck. Submit as PDF presentation with voice narration.',
    'file_upload',
    11,
    250,
    (now() + interval '77 days'),
    false
  ),
  (
    'Funding Proposal',
    'Develop a funding proposal including financial projections. Submit as PDF.',
    'file_upload',
    11,
    200,
    (now() + interval '77 days'),
    true
  ),

  -- Week 12: Final Project & Presentation
  (
    'Business Plan',
    'Complete your comprehensive business plan. Submit as PDF document.',
    'file_upload',
    12,
    300,
    (now() + interval '84 days'),
    false
  ),
  (
    'Final Presentation',
    'Record your final business presentation. Submit as video or voice recording with slides.',
    'file_upload',
    12,
    350,
    (now() + interval '84 days'),
    true
  );