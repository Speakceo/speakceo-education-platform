import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xgvtduyizhaiqguuskfu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndnRkdXlpemhhaXFndXVza2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODE0MTMsImV4cCI6MjA1OTA1NzQxM30.TqU22hHSx7ej8f3XewdbY8FUaFF7TdDhelHXc_vYHak';

const supabase = createClient(supabaseUrl, supabaseKey);

// List of potential tables to check
const TABLES_TO_CHECK = [
  'profiles',
  'courses', 
  'modules',
  'lessons',
  'tasks',
  'live_classes',
  'task_submissions',
  'user_progress',
  'user_enrollments',
  'announcements',
  'user_progress_custom'
];

async function checkSupabaseTables() {
  console.log('🔍 Comprehensive Supabase Database Check');
  console.log('==========================================');
  console.log(`📡 Database: ${supabaseUrl}`);
  console.log('');

  const tableResults = {};
  let totalTables = 0;
  let tablesWithData = 0;
  let totalRecords = 0;

  for (const tableName of TABLES_TO_CHECK) {
    console.log(`🔍 Checking table: ${tableName}`);
    
    try {
      // Check if table exists and get data
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
        tableResults[tableName] = {
          exists: false,
          error: error.message,
          count: 0,
          sampleData: null
        };
      } else {
        totalTables++;
        const recordCount = data?.length || 0;
        totalRecords += recordCount;
        
        if (recordCount > 0) {
          tablesWithData++;
          console.log(`  ✅ Found ${recordCount} records`);
          
          // Show sample data for course-related tables
          if (['courses', 'modules', 'lessons'].includes(tableName) && data.length > 0) {
            console.log(`  📋 Sample data:`);
            data.slice(0, 3).forEach((record, index) => {
              console.log(`    ${index + 1}. ${record.title || record.name || record.id}`);
            });
          }
        } else {
          console.log(`  ⚠️  Table exists but is empty`);
        }
        
        tableResults[tableName] = {
          exists: true,
          error: null,
          count: recordCount,
          sampleData: data?.slice(0, 5) || []
        };
      }
    } catch (err) {
      console.log(`  💥 Exception: ${err.message}`);
      tableResults[tableName] = {
        exists: false,
        error: err.message,
        count: 0,
        sampleData: null
      };
    }
    console.log('');
  }

  // Summary Report
  console.log('📊 SUMMARY REPORT');
  console.log('=================');
  console.log(`📈 Total tables checked: ${TABLES_TO_CHECK.length}`);
  console.log(`✅ Tables that exist: ${totalTables}`);
  console.log(`📊 Tables with data: ${tablesWithData}`);
  console.log(`📝 Total records across all tables: ${totalRecords}`);
  console.log('');

  // Detailed Course Analysis
  console.log('📚 COURSE SYSTEM ANALYSIS');
  console.log('==========================');
  
  const courseData = tableResults.courses;
  const moduleData = tableResults.modules;
  const lessonData = tableResults.lessons;
  const enrollmentData = tableResults.user_enrollments;

  if (!courseData.exists) {
    console.log('❌ COURSES TABLE: Does not exist');
    console.log('   This is why no courses show on student dashboard!');
  } else if (courseData.count === 0) {
    console.log('⚠️  COURSES TABLE: Exists but empty');
    console.log('   This is why no courses show on student dashboard!');
  } else {
    console.log(`✅ COURSES TABLE: ${courseData.count} courses found`);
    courseData.sampleData.forEach(course => {
      console.log(`   - ${course.title} (Active: ${course.is_active})`);
    });
  }

  if (!moduleData.exists) {
    console.log('❌ MODULES TABLE: Does not exist');
  } else if (moduleData.count === 0) {
    console.log('⚠️  MODULES TABLE: Exists but empty');
  } else {
    console.log(`✅ MODULES TABLE: ${moduleData.count} modules found`);
    moduleData.sampleData.forEach(module => {
      console.log(`   - ${module.title} (Order: ${module.order || 'N/A'})`);
    });
  }

  if (!lessonData.exists) {
    console.log('❌ LESSONS TABLE: Does not exist');
  } else if (lessonData.count === 0) {
    console.log('⚠️  LESSONS TABLE: Exists but empty');
  } else {
    console.log(`✅ LESSONS TABLE: ${lessonData.count} lessons found`);
  }

  if (!enrollmentData.exists) {
    console.log('❌ USER_ENROLLMENTS TABLE: Does not exist');
    console.log('   Students cannot be enrolled in courses!');
  } else if (enrollmentData.count === 0) {
    console.log('⚠️  USER_ENROLLMENTS TABLE: Exists but empty');
    console.log('   No students are enrolled in any courses!');
  } else {
    console.log(`✅ USER_ENROLLMENTS TABLE: ${enrollmentData.count} enrollments found`);
  }

  console.log('');

  // User Data Analysis
  console.log('👥 USER DATA ANALYSIS');
  console.log('=====================');
  const profileData = tableResults.profiles;
  
  if (profileData.exists && profileData.count > 0) {
    const students = profileData.sampleData.filter(p => p.role === 'student');
    const admins = profileData.sampleData.filter(p => p.role === 'admin');
    
    console.log(`✅ PROFILES TABLE: ${profileData.count} users found`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Admins: ${admins.length}`);
    
    students.slice(0, 3).forEach(student => {
      console.log(`   📝 Student: ${student.email || student.name} (Progress: ${student.progress || 0}%)`);
    });
  } else {
    console.log('❌ No user profiles found');
  }

  console.log('');

  // Task System Analysis
  console.log('📋 TASK SYSTEM ANALYSIS');
  console.log('========================');
  const taskData = tableResults.tasks;
  const submissionData = tableResults.task_submissions;

  if (taskData.exists && taskData.count > 0) {
    console.log(`✅ TASKS TABLE: ${taskData.count} tasks found`);
    taskData.sampleData.forEach(task => {
      console.log(`   - ${task.title} (Week ${task.week_number}, ${task.points} points)`);
    });
  } else {
    console.log('❌ No tasks found');
  }

  if (submissionData.exists && submissionData.count > 0) {
    console.log(`✅ TASK_SUBMISSIONS TABLE: ${submissionData.count} submissions found`);
  } else {
    console.log('⚠️  No task submissions found');
  }

  console.log('');

  // Recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('==================');
  
  if (!courseData.exists) {
    console.log('🔧 CRITICAL: Create courses table and add sample courses');
    console.log('🔧 CRITICAL: Create user_enrollments table for course enrollment');
  } else if (courseData.count === 0) {
    console.log('🔧 HIGH: Add sample courses to courses table');
  }

  if (!enrollmentData.exists) {
    console.log('🔧 CRITICAL: Create user_enrollments table');
  } else if (enrollmentData.count === 0 && courseData.count > 0) {
    console.log('🔧 MEDIUM: Enroll existing students in courses');
  }

  if (moduleData.exists && moduleData.count > 0 && courseData.count > 0) {
    console.log('🔧 LOW: Link existing modules to courses');
  }

  console.log('');
  console.log('🚀 Ready to fix? Run the courses creation SQL script in Supabase Dashboard!');
  
  return tableResults;
}

// Run the check
checkSupabaseTables().catch(console.error); 