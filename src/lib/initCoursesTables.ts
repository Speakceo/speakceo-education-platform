import { supabase } from './supabase';

export async function initCoursesTables() {
  console.log("Initializing course tables...");
  
  try {
    // First check if we can connect to Supabase
    try {
      // Simple ping test to check connectivity
      const { data: testConnection, error: pingError } = await supabase
        .from('_pgrst_reserved_id') // Non-existent table that triggers a mild error but confirms connectivity
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (pingError) {
        if (pingError.code === 'PGRST301') {
          // This error is expected (relation does not exist), but it confirms we can reach the database
          console.log("Database connection successful");
        } else {
          // Any other error might indicate connectivity issues
          console.error("Connection to Supabase has issues:", pingError);
          if (pingError.code === 'PGRST401') {
            return { 
              success: false, 
              error: "Authentication failed. Please check your Supabase credentials." 
            };
          } else if (pingError.message?.includes('Failed to fetch')) {
            return { 
              success: false, 
              error: "Failed to connect to Supabase. Please check your internet connection and Supabase URL." 
            };
          } else {
            return { 
              success: false, 
              error: `Database connection issues: ${pingError.message || 'Unknown connection error'}` 
            };
          }
        }
      }
    } catch (connectionAttemptError) {
      console.error("Failed to verify database connection:", connectionAttemptError);
      return { 
        success: false, 
        error: `Database connection test failed: ${connectionAttemptError instanceof Error ? connectionAttemptError.message : 'Unknown error'}` 
      };
    }
    
    // Check if tables already exist
    let { data: existingTables, error: tablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('modules', 'lessons')
      `
    });
    
    if (tablesError) {
      // If execute_sql RPC is not available, try a direct query
      console.log("execute_sql failed, trying direct query to information_schema...");
      try {
        // Try direct query to information_schema
        const { data: directQuery, error: directQueryError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['modules', 'lessons']);
          
        if (directQueryError) {
          console.error("Direct query to information_schema failed:", directQueryError);
          
          // Last resort: try to query the tables directly to see if they exist
          console.log("Trying to detect tables by direct access...");
          
          let tablesExist = [];
          
          // Check if modules table exists
          const { error: modulesCheckError } = await supabase
            .from('modules')
            .select('id')
            .limit(1);
            
          if (!modulesCheckError) {
            tablesExist.push({ table_name: 'modules' });
          }
          
          // Check if lessons table exists
          const { error: lessonsCheckError } = await supabase
            .from('lessons')
            .select('id')
            .limit(1);
            
          if (!lessonsCheckError) {
            tablesExist.push({ table_name: 'lessons' });
          }
          
          if (tablesExist.length > 0) {
            console.log("Detected existing tables through direct access:", tablesExist);
            existingTables = tablesExist;
          } else {
            throw new Error("Could not determine if tables exist by any method");
          }
        } else {
          console.log("Direct query to information_schema succeeded");
          existingTables = directQuery;
        }
      } catch (fallbackError) {
        console.error("All methods to check existing tables failed:", fallbackError);
        return { 
          success: false, 
          error: `Failed to check if tables exist: ${tablesError.message}. Fallback also failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`
        };
      }
    }
    
    const tableNames = existingTables.map((row: any) => row.table_name);
    let tablesCreated = false;
    
    // Create modules table if it doesn't exist
    if (!tableNames.includes('modules')) {
      console.log("Creating modules table...");
      const { error: modulesError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE modules (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            order_index INTEGER,
            order INTEGER,
            duration TEXT,
            image_url TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow authenticated users to read modules"
            ON modules FOR SELECT
            TO authenticated
            USING (true);
            
          CREATE POLICY "Allow admins to insert modules"
            ON modules FOR INSERT
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to update modules"
            ON modules FOR UPDATE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to delete modules"
            ON modules FOR DELETE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
        `
      });
      
      if (modulesError) throw modulesError;
      tablesCreated = true;
    }
    
    // Create lessons table if it doesn't exist
    if (!tableNames.includes('lessons')) {
      console.log("Creating lessons table...");
      const { error: lessonsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE lessons (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            duration TEXT,
            order_index INTEGER,
            order INTEGER,
            points INTEGER DEFAULT 10,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow authenticated users to read lessons"
            ON lessons FOR SELECT
            TO authenticated
            USING (true);
            
          CREATE POLICY "Allow admins to insert lessons"
            ON lessons FOR INSERT
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to update lessons"
            ON lessons FOR UPDATE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to delete lessons"
            ON lessons FOR DELETE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
        `
      });
      
      if (lessonsError) throw lessonsError;
      tablesCreated = true;
    }
    
    // Create lesson_content table if needed
    const { data: lessonContentExists, error: contentError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'lesson_content'
      `
    });
    
    if (contentError) throw contentError;
    
    if (lessonContentExists.length === 0) {
      console.log("Creating lesson_content table...");
      const { error: contentTableError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE lesson_content (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            content TEXT,
            url TEXT,
            order_index INTEGER,
            quiz_questions JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow authenticated users to read lesson_content"
            ON lesson_content FOR SELECT
            TO authenticated
            USING (true);
            
          CREATE POLICY "Allow admins to insert lesson_content"
            ON lesson_content FOR INSERT
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to update lesson_content"
            ON lesson_content FOR UPDATE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
            
          CREATE POLICY "Allow admins to delete lesson_content"
            ON lesson_content FOR DELETE
            TO authenticated
            USING (auth.jwt() ->> 'role' = 'admin');
        `
      });
      
      if (contentTableError) throw contentTableError;
      tablesCreated = true;
    }
    
    // Create lesson_progress table if needed
    const { data: progressExists, error: progressError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'lesson_progress'
      `
    });
    
    if (progressError) throw progressError;
    
    if (progressExists.length === 0) {
      console.log("Creating lesson_progress table...");
      const { error: progressTableError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE lesson_progress (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
            completed BOOLEAN DEFAULT false,
            completed_at TIMESTAMP WITH TIME ZONE,
            quiz_result JSONB,
            xp_earned INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, lesson_id)
          );
          
          ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can read own lesson progress"
            ON lesson_progress FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
            
          CREATE POLICY "Users can insert own lesson progress"
            ON lesson_progress FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY "Users can update own lesson progress"
            ON lesson_progress FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id);
        `
      });
      
      if (progressTableError) throw progressTableError;
      tablesCreated = true;
    }
    
    // Automatically seed demo data if tables were just created
    if (tablesCreated) {
      console.log("Tables created! Automatically seeding demo data...");
      try {
        const seedResult = await seedDemoModules();
        if (seedResult.success) {
          console.log("Demo modules and lessons successfully added");
        } else {
          console.warn("Tables were created but seeding failed:", seedResult.error);
          // Continue even if seeding fails - tables are created successfully
        }
      } catch (seedError) {
        console.error("Exception during seeding demo data:", seedError);
        // Continue even if seeding fails - tables are created successfully
      }
    }
    
    console.log("Course tables initialized successfully!");
    return { success: true };
    
  } catch (error) {
    console.error("Error initializing course tables:", error);
    
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("permission denied")) {
        return { 
          success: false, 
          error: "Permission denied: Your account doesn't have permission to create tables. Please contact the administrator."
        };
      } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return { 
          success: false, 
          error: "Database structure error: A required relation does not exist. Database may not be properly set up."
        };
      } else if (error.message.includes("duplicate key")) {
        return { 
          success: false, 
          error: "Couldn't create tables: Records with the same keys already exist. Try using the refresh button instead."
        };
      }
    }
    
    // Default error message
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function seedDemoModules() {
  console.log("Seeding demo modules and lessons...");
  
  try {
    // Check if modules already exist
    const { data: existingModules, error: modulesError } = await supabase
      .from('modules')
      .select('id')
      .limit(1);
    
    if (modulesError) {
      console.error("Error checking existing modules:", modulesError);
      return { 
        success: false, 
        error: `Failed to check existing modules: ${modulesError.message || 'Unknown error'}`
      };
    }
    
    // Only seed if no modules exist
    if (existingModules && existingModules.length > 0) {
      console.log("Modules already exist, skipping seeding");
      return { success: true, message: "Modules already exist" };
    }
    
    try {
      // Create comprehensive demo modules for 90-day journey
      const moduleData = [
        {
          title: "Foundations of Entrepreneurship",
          description: "Build your entrepreneurial mindset and discover opportunities",
          order_index: 1,
          order: 1,
          duration: "2 weeks",
          status: "active"
        },
        {
          title: "Building Your Brand & Business",
          description: "Create your brand identity and learn marketing essentials",
          order_index: 2,
          order: 2,
          duration: "2 weeks",
          status: "active"
        },
        {
          title: "Financial Literacy",
          description: "Master money management and business finance basics",
          order_index: 3,
          order: 3,
          duration: "2 weeks",
          status: "active"
        },
        {
          title: "Marketing & Sales Strategy",
          description: "Learn to promote and sell your products effectively",
          order_index: 4,
          order: 4,
          duration: "2 weeks",
          status: "active"
        },
        {
          title: "Leadership & Team Building",
          description: "Develop essential leadership and management skills",
          order_index: 5,
          order: 5,
          duration: "2 weeks",
          status: "active"
        },
        {
          title: "Capstone Project",
          description: "Apply your knowledge in a real business project",
          order_index: 6,
          order: 6,
          duration: "2 weeks",
          status: "active"
        }
      ];
      
      const { data: modules, error: insertError } = await supabase
        .from('modules')
        .insert(moduleData)
        .select();
      
      if (insertError) {
        console.error("Error inserting modules:", insertError);
        return { 
          success: false, 
          error: `Failed to insert modules: ${insertError.message || 'Unknown error'}`
        };
      }
      
      if (!modules || modules.length === 0) {
        console.error("No modules were created");
        return { 
          success: false, 
          error: "Modules were not created successfully, received empty result"
        };
      }
      
      console.log(`Created ${modules.length} modules, now adding lessons...`);
      
      // More comprehensive predefined lessons for each module
      const lessonsByModule = {
        "Foundations of Entrepreneurship": [
          { title: "What is Entrepreneurship?", type: "video", duration: "45m", description: "Introduction to entrepreneurial concepts and mindset", order_index: 1 },
          { title: "Entrepreneurial Mindset", type: "document", duration: "30m", description: "Developing the right mindset for successful entrepreneurship", order_index: 2 },
          { title: "Identifying Business Opportunities", type: "video", duration: "50m", description: "How to spot and evaluate business opportunities", order_index: 3 },
          { title: "Market Research Basics", type: "document", duration: "1h", description: "Introduction to market research methodologies", order_index: 4 },
          { title: "Business Model Canvas", type: "ppt", duration: "45m", description: "Understanding and creating business models", order_index: 5 },
          { title: "Validating Your Idea", type: "video", duration: "40m", description: "Testing and validating business ideas effectively", order_index: 6 },
          { title: "Entrepreneurship Quiz", type: "quiz", duration: "30m", description: "Test your knowledge of entrepreneurial concepts", order_index: 7 }
        ],
        "Building Your Brand & Business": [
          { title: "Basics of Branding", type: "video", duration: "50m", description: "Understanding brand elements and importance", order_index: 1 },
          { title: "Creating Your Brand Identity", type: "document", duration: "1h", description: "Developing a cohesive brand identity", order_index: 2 },
          { title: "Logo Design Principles", type: "ppt", duration: "45m", description: "Key principles for effective logo design", order_index: 3 },
          { title: "Brand Positioning Strategy", type: "video", duration: "50m", description: "How to position your brand in the market", order_index: 4 },
          { title: "Creating Brand Guidelines", type: "document", duration: "1h", description: "Developing comprehensive brand guidelines", order_index: 5 },
          { title: "Brand Storytelling", type: "video", duration: "45m", description: "Using storytelling techniques to strengthen your brand", order_index: 6 },
          { title: "Brand Building Assignment", type: "assignment", duration: "2h", description: "Create your own brand identity package", order_index: 7 }
        ],
        "Financial Literacy": [
          { title: "Business Finance Basics", type: "video", duration: "1h", description: "Introduction to business financial concepts", order_index: 1 },
          { title: "Reading Financial Statements", type: "document", duration: "45m", description: "Understanding balance sheets and income statements", order_index: 2 },
          { title: "Cash Flow Management", type: "ppt", duration: "50m", description: "Managing and forecasting cash flow", order_index: 3 },
          { title: "Pricing Strategies", type: "video", duration: "45m", description: "Effective pricing models for startups", order_index: 4 },
          { title: "Budgeting for Startups", type: "document", duration: "1h", description: "Creating and managing startup budgets", order_index: 5 },
          { title: "Funding Options", type: "video", duration: "1h", description: "Understanding different funding sources", order_index: 6 },
          { title: "Financial Planning Exercise", type: "assignment", duration: "2h", description: "Create a financial forecast for your business idea", order_index: 7 }
        ],
        "Marketing & Sales Strategy": [
          { title: "Marketing Fundamentals", type: "video", duration: "45m", description: "Core concepts of marketing for startups", order_index: 1 },
          { title: "Digital Marketing Overview", type: "document", duration: "1h", description: "Introduction to digital marketing channels", order_index: 2 },
          { title: "Social Media Marketing", type: "ppt", duration: "50m", description: "Leveraging social media for business growth", order_index: 3 },
          { title: "Content Marketing Strategy", type: "video", duration: "45m", description: "Creating effective content marketing plans", order_index: 4 },
          { title: "Sales Process Basics", type: "document", duration: "1h", description: "Understanding the sales process and funnel", order_index: 5 },
          { title: "Customer Acquisition", type: "video", duration: "50m", description: "Strategies for acquiring new customers", order_index: 6 },
          { title: "Marketing Plan Development", type: "assignment", duration: "2h", description: "Create a marketing plan for your startup", order_index: 7 }
        ],
        "Leadership & Team Building": [
          { title: "Leadership Principles", type: "video", duration: "50m", description: "Core principles of effective leadership", order_index: 1 },
          { title: "Building Effective Teams", type: "document", duration: "45m", description: "Strategies for team development", order_index: 2 },
          { title: "Communication Skills", type: "ppt", duration: "1h", description: "Improving business communication", order_index: 3 },
          { title: "Conflict Resolution", type: "video", duration: "45m", description: "Managing and resolving team conflicts", order_index: 4 },
          { title: "Decision Making", type: "document", duration: "50m", description: "Effective decision-making frameworks", order_index: 5 },
          { title: "Delegation Skills", type: "video", duration: "45m", description: "How to delegate effectively", order_index: 6 },
          { title: "Leadership Assessment", type: "quiz", duration: "30m", description: "Evaluate your leadership capabilities", order_index: 7 }
        ],
        "Capstone Project": [
          { title: "Business Plan Development", type: "video", duration: "1h", description: "Creating a comprehensive business plan", order_index: 1 },
          { title: "Financial Projections", type: "document", duration: "1h", description: "Developing detailed financial forecasts", order_index: 2 },
          { title: "Pitch Deck Creation", type: "ppt", duration: "1h", description: "Building an effective investor pitch deck", order_index: 3 },
          { title: "Presentation Skills", type: "video", duration: "45m", description: "Improving your presentation abilities", order_index: 4 },
          { title: "Final Project Preparation", type: "document", duration: "2h", description: "Guidelines for final project submission", order_index: 5 },
          { title: "Mock Investor Pitch", type: "video", duration: "1h", description: "Practice pitching to investors", order_index: 6 },
          { title: "Final Project Submission", type: "assignment", duration: "3h", description: "Submit your complete business plan and pitch", order_index: 7 }
        ]
      };
      
      // Create all lessons for each module
      for (const module of modules) {
        const moduleLessons = lessonsByModule[module.title as keyof typeof lessonsByModule] || [];
        
        if (moduleLessons.length > 0) {
          const lessonData = moduleLessons.map((lesson, idx) => ({
            module_id: module.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            duration: lesson.duration,
            order_index: idx + 1,
            order: idx + 1,
            points: Math.floor(Math.random() * 10) + 10, // 10-20 points
            status: "active"
          }));
          
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert(lessonData);
          
          if (lessonError) {
            console.error(`Error adding lessons for module ${module.title}:`, lessonError);
            
            // Check for duplicate key errors
            if (lessonError.message?.includes("duplicate key")) {
              console.warn(`Lessons for module ${module.title} may already exist, continuing with other modules...`);
            } else if (lessonError.code === "23505") { // PostgreSQL duplicate key error
              console.warn(`Duplicate key error for module ${module.title}, continuing with other modules...`);
            } else if (lessonError.message?.includes("foreign key")) {
              return { 
                success: false, 
                error: `Database integrity error: Failed to link lessons to module ${module.title}. The module may not exist.`
              };
            } else {
              return { 
                success: false, 
                error: `Failed to add lessons for module ${module.title}: ${lessonError.message || 'Unknown error'}`
              };
            }
          } else {
            console.log(`Added ${lessonData.length} lessons for module: ${module.title}`);
          }
        }
      }
      
      console.log("Seeded demo modules and lessons successfully");
      return { success: true };
      
    } catch (seedingError) {
      console.error("Unexpected error during seeding process:", seedingError);
      return { 
        success: false, 
        error: `Unexpected error during seeding: ${seedingError instanceof Error ? seedingError.message : String(seedingError)}`
      };
    }
    
  } catch (error) {
    console.error("Error seeding demo modules:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 