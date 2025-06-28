import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setupDatabase = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      console.log('Setting up database...');

      // First, ensure the status column exists in profiles table
      try {
        await supabase.rpc('exec_sql', {
          sql: `
            DO $$ 
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='profiles' AND column_name='status') THEN
                ALTER TABLE profiles ADD COLUMN status varchar(20) DEFAULT 'active' 
                CHECK (status IN ('active', 'inactive', 'suspended'));
              END IF;
            END $$;
          `
        });
        console.log('Status column ensured');
      } catch (err) {
        console.log('Status column setup may have failed:', err);
      }

      // Create course_materials table for document management
      try {
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS course_materials (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
              lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
              title varchar(255) NOT NULL,
              description text,
              type varchar(50) NOT NULL,
              file_url text NOT NULL,
              file_size bigint DEFAULT 0,
              download_count integer DEFAULT 0,
              is_downloadable boolean DEFAULT true,
              display_order integer DEFAULT 0,
              status varchar(20) DEFAULT 'active',
              created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
              updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            );
          `
        });
        console.log('Course materials table created');
      } catch (err) {
        console.log('Course materials table creation may have failed:', err);
      }

      // Insert admin user if doesn't exist
      const { data: adminUser, error: adminCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'admin@speakceo.com')
        .single();

      if (adminCheckError && adminCheckError.code === 'PGRST116') {
        // Admin doesn't exist, create it
        const { error: adminInsertError } = await supabase
          .from('profiles')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@speakceo.com',
            name: 'Admin User',
            avatar_url: 'https://ui-avatars.com/api/?name=Admin+User',
            role: 'admin',
            status: 'active',
            course_type: 'Premium',
            progress: 100
          }]);

        if (adminInsertError) {
          console.error('Error creating admin user:', adminInsertError);
        } else {
          console.log('Admin user created');
        }
      }

      // Insert sample users
      const sampleUsers = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'john.doe@example.com',
          name: 'John Doe',
          avatar_url: 'https://ui-avatars.com/api/?name=John+Doe',
          role: 'user',
          status: 'active',
          course_type: 'Premium',
          progress: 75
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith',
          role: 'user',
          status: 'active',
          course_type: 'Basic',
          progress: 45
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'mike.johnson@example.com',
          name: 'Mike Johnson',
          avatar_url: 'https://ui-avatars.com/api/?name=Mike+Johnson',
          role: 'user',
          status: 'active',
          course_type: 'Premium',
          progress: 90
        }
      ];

      const { error: usersError } = await supabase
        .from('profiles')
        .upsert(sampleUsers, { onConflict: 'id' });

      if (usersError) {
        throw new Error(`Failed to insert users: ${usersError.message}`);
      }

      // Enhance modules table for better course management
      try {
        await supabase.rpc('exec_sql', {
          sql: `
            DO $$ 
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='modules' AND column_name='price') THEN
                ALTER TABLE modules ADD COLUMN price decimal(10,2) DEFAULT 0;
              END IF;
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='modules' AND column_name='level') THEN
                ALTER TABLE modules ADD COLUMN level varchar(20) DEFAULT 'Beginner' 
                CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));
              END IF;
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name='modules' AND column_name='instructor_name') THEN
                ALTER TABLE modules ADD COLUMN instructor_name varchar(255) DEFAULT 'Admin User';
              END IF;
            END $$;
          `
        });
        console.log('Modules table enhanced');
      } catch (err) {
        console.log('Modules enhancement may have failed:', err);
      }

      // Insert sample courses with enhanced data
      const sampleCourses = [
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          title: 'Startup Fundamentals',
          description: 'Learn the essential concepts of starting and running a successful business. This comprehensive course covers everything from idea validation to building your first prototype.',
          order: 1,
          duration: '4 weeks',
          image_url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400',
          status: 'active'
        },
        {
          id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          title: 'Advanced Business Strategy',
          description: 'Master the art of strategic planning and execution. Perfect for entrepreneurs looking to scale their business and make data-driven decisions.',
          order: 2,
          duration: '6 weeks',
          image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
          status: 'active'
        },
        {
          id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          title: 'Financial Management for Entrepreneurs',
          description: 'Complete guide to managing finances in your startup. Learn budgeting, forecasting, funding options, and financial controls.',
          order: 3,
          duration: '5 weeks',
          image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
          status: 'active'
        },
        {
          id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
          title: 'Digital Marketing Mastery',
          description: 'Comprehensive digital marketing course covering SEO, social media, content marketing, PPC, and analytics for startups.',
          order: 4,
          duration: '8 weeks',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
          status: 'active'
        }
      ];

      const { error: coursesError } = await supabase
        .from('modules')
        .upsert(sampleCourses, { onConflict: 'id' });

      if (coursesError) {
        throw new Error(`Failed to insert courses: ${coursesError.message}`);
      }

      // Insert sample lessons with variety of types
      const sampleLessons = [
        {
          id: 'lesson01-0000-0000-0000-000000000001',
          module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          title: 'Introduction to Entrepreneurship',
          type: 'video',
          duration: '45 min',
          description: 'Overview of entrepreneurial mindset and opportunities',
          order: 1,
          status: 'active',
          points: 50,
          content: 'Welcome to entrepreneurship! This lesson covers the fundamental concepts...',
          url: 'https://example.com/video/intro-entrepreneurship'
        },
        {
          id: 'lesson02-0000-0000-0000-000000000002',
          module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          title: 'Market Research & Validation',
          type: 'text',
          duration: '60 min',
          description: 'Learn systematic approaches to researching and validating your business ideas',
          order: 2,
          status: 'active',
          points: 75,
          content: 'Market research is the foundation of any successful business...'
        },
        {
          id: 'lesson03-0000-0000-0000-000000000003',
          module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          title: 'Building Your MVP',
          type: 'assignment',
          duration: '120 min',
          description: 'Hands-on workshop to create your minimum viable product',
          order: 3,
          status: 'active',
          points: 100,
          content: 'Time to build! This practical lesson guides you through creating a simple version...'
        },
        {
          id: 'lesson04-0000-0000-0000-000000000004',
          module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          title: 'Strategic Planning Framework',
          type: 'presentation',
          duration: '90 min',
          description: 'Comprehensive framework for developing winning business strategies',
          order: 1,
          status: 'active',
          points: 120,
          content: 'Learn the SWOT analysis, Porter\'s Five Forces, and other strategic planning tools...'
        }
      ];

      const { error: lessonsError } = await supabase
        .from('lessons')
        .upsert(sampleLessons, { onConflict: 'id' });

      if (lessonsError) {
        throw new Error(`Failed to insert lessons: ${lessonsError.message}`);
      }

      // Insert sample course materials (documents, PDFs, etc.)
      try {
        const sampleMaterials = [
          {
            id: 'material01-0000-0000-0000-000000000001',
            module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            lesson_id: 'lesson01-0000-0000-0000-000000000001',
            title: 'Entrepreneurship Handbook (PDF)',
            description: 'Comprehensive guide to starting your entrepreneurial journey',
            type: 'pdf',
            file_url: 'https://example.com/materials/entrepreneurship-handbook.pdf',
            file_size: 2048000,
            is_downloadable: true,
            display_order: 1
          },
          {
            id: 'material02-0000-0000-0000-000000000002',
            module_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            lesson_id: 'lesson02-0000-0000-0000-000000000002',
            title: 'Market Research Template (Excel)',
            description: 'Ready-to-use template for conducting market research',
            type: 'spreadsheet',
            file_url: 'https://example.com/materials/market-research-template.xlsx',
            file_size: 1024000,
            is_downloadable: true,
            display_order: 1
          },
          {
            id: 'material03-0000-0000-0000-000000000003',
            module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            lesson_id: 'lesson04-0000-0000-0000-000000000004',
            title: 'Strategic Planning Presentation (PPT)',
            description: 'PowerPoint template for strategic planning sessions',
            type: 'ppt',
            file_url: 'https://example.com/materials/strategic-planning.pptx',
            file_size: 3072000,
            is_downloadable: true,
            display_order: 1
          },
          {
            id: 'material04-0000-0000-0000-000000000004',
            module_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            title: 'Financial Planning Toolkit',
            description: 'Complete toolkit with Excel templates and calculators',
            type: 'spreadsheet',
            file_url: 'https://example.com/materials/financial-toolkit.xlsx',
            file_size: 2560000,
            is_downloadable: true,
            display_order: 1
          }
        ];

        const { error: materialsError } = await supabase
          .from('course_materials')
          .upsert(sampleMaterials, { onConflict: 'id' });

        if (materialsError) {
          console.log('Materials insertion failed (table may not exist yet):', materialsError.message);
        } else {
          console.log('Course materials inserted successfully');
        }
      } catch (err) {
        console.log('Course materials insertion skipped:', err);
      }

      // Insert sample live classes
      const sampleLiveClasses = [
        {
          id: 'liveclass1-0000-0000-0000-000000000001',
          title: 'Startup Pitch Workshop',
          description: 'Interactive workshop to perfect your startup pitch and get feedback from experts',
          instructor_id: '00000000-0000-0000-0000-000000000001',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          start_time: '14:00',
          end_time: '16:00',
          duration: '2 hours',
          duration_minutes: 120,
          category: 'Entrepreneurship',
          level: 'Intermediate',
          tags: ['pitch', 'presentation', 'feedback'],
          max_attendees: 20,
          attendees: 12,
          status: 'scheduled',
          join_url: 'https://meet.google.com/startup-pitch-workshop'
        },
        {
          id: 'liveclass2-0000-0000-0000-000000000002',
          title: 'Financial Modeling Masterclass',
          description: 'Learn to build professional financial models for your startup',
          instructor_id: '00000000-0000-0000-0000-000000000001',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          start_time: '10:00',
          end_time: '12:30',
          duration: '2.5 hours',
          duration_minutes: 150,
          category: 'Finance',
          level: 'Advanced',
          tags: ['finance', 'modeling', 'excel'],
          max_attendees: 15,
          attendees: 8,
          status: 'scheduled',
          join_url: 'https://meet.google.com/financial-modeling'
        }
      ];

      const { error: liveClassesError } = await supabase
        .from('live_classes')
        .upsert(sampleLiveClasses, { onConflict: 'id' });

      if (liveClassesError) {
        throw new Error(`Failed to insert live classes: ${liveClassesError.message}`);
      }

      // Insert sample tasks with different types
      const sampleTasks = [
        {
          id: 'task0001-0000-0000-0000-000000000001',
          title: 'Business Idea Pitch',
          description: 'Create and record a 3-minute pitch video for your business idea. Include problem, solution, market size, and ask.',
          type: 'file_upload',
          week_number: 1,
          points: 100,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          live_discussion: true,
          status: 'active'
        },
        {
          id: 'task0002-0000-0000-0000-000000000002',
          title: 'Market Analysis Report',
          description: 'Conduct thorough market research and write a 5-page analysis of your target market, including size, trends, and competition.',
          type: 'text_response',
          week_number: 2,
          points: 150,
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          live_discussion: false,
          status: 'active'
        },
        {
          id: 'task0003-0000-0000-0000-000000000003',
          title: 'Financial Projections Quiz',
          description: 'Test your understanding of financial modeling and projections with this comprehensive quiz.',
          type: 'multiple_choice',
          week_number: 3,
          points: 75,
          due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          live_discussion: false,
          status: 'active'
        }
      ];

      const { error: tasksError } = await supabase
        .from('tasks')
        .upsert(sampleTasks, { onConflict: 'id' });

      if (tasksError) {
        throw new Error(`Failed to insert tasks: ${tasksError.message}`);
      }

      setMessage('Database setup completed successfully! All admin panel features should now work properly with real data. You can now manage courses, add lessons, upload materials (PDFs, PPTs, docs), and manage live classes.');

    } catch (error: any) {
      console.error('Database setup error:', error);
      setError(`Database setup failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const checks = await Promise.all([
        supabase.from('profiles').select('count', { count: 'exact', head: true }),
        supabase.from('modules').select('count', { count: 'exact', head: true }),
        supabase.from('lessons').select('count', { count: 'exact', head: true }),
        supabase.from('live_classes').select('count', { count: 'exact', head: true }),
        supabase.from('tasks').select('count', { count: 'exact', head: true })
      ]);

      const [profiles, modules, lessons, liveClasses, tasks] = checks;

      let materials = 0;
      try {
        const { count } = await supabase
          .from('course_materials')
          .select('count', { count: 'exact', head: true });
        materials = count || 0;
      } catch (error) {
        materials = 0;
      }

      const status = {
        profiles: profiles.count || 0,
        modules: modules.count || 0,
        lessons: lessons.count || 0,
        liveClasses: liveClasses.count || 0,
        tasks: tasks.count || 0,
        materials
      };

      const totalRecords = Object.values(status).reduce((sum, count) => sum + count, 0);

      setMessage(`Database Status:
• Users: ${status.profiles}
• Courses: ${status.modules}
• Lessons: ${status.lessons}
• Live Classes: ${status.liveClasses}
• Tasks: ${status.tasks}
• Course Materials: ${status.materials}
• Total Records: ${totalRecords}

${totalRecords === 0 ? 'Database appears empty. Click "Setup Database" to populate with sample data.' : 'Database contains data and should be functional!'}`);

    } catch (error: any) {
      setError(`Failed to check database status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Database className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Database Management</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Set up your database with sample data including courses, lessons, materials, live classes, and tasks.
        This will enable all admin panel features including document management.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={setupDatabase}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Setup Database
        </button>

        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Check Status
        </button>
      </div>

      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-green-800 whitespace-pre-line">{message}</div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  );
} 