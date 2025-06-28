-- Create modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    duration TEXT,
    points INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone"
    ON public.modules
    FOR SELECT
    USING (true);

-- Add RLS policies for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
    ON public.lessons
    FOR SELECT
    USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(order_index);

-- Insert some initial data for demo user
INSERT INTO public.modules (title, description, order_index, duration)
VALUES 
    ('Introduction to Business', 'Learn the fundamentals of business', 1, '2 hours'),
    ('Marketing Basics', 'Understanding marketing principles', 2, '3 hours'),
    ('Sales Techniques', 'Master the art of sales', 3, '2.5 hours')
ON CONFLICT DO NOTHING;

-- Insert lessons for each module
WITH module_ids AS (
    SELECT id FROM public.modules ORDER BY order_index
)
INSERT INTO public.lessons (module_id, title, description, type, duration, points, order_index)
SELECT 
    m.id,
    CASE 
        WHEN m.order_index = 1 THEN 'Welcome to Business'
        WHEN m.order_index = 2 THEN 'Marketing Fundamentals'
        WHEN m.order_index = 3 THEN 'Sales Basics'
    END,
    'Introduction to the topic',
    'video',
    '30 minutes',
    100,
    1
FROM module_ids m
ON CONFLICT DO NOTHING; 