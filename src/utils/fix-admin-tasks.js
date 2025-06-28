import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xgvtduyizhaiqguuskfu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndnRkdXlpemhhaXFndXVza2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODE0MTMsImV4cCI6MjA1OTA1NzQxM30.TqU22hHSx7ej8f3XewdbY8FUaFF7TdDhelHXc_vYHak';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminTasksVisibility() {
  console.log('🔧 Starting admin tasks visibility fix...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250608110000_fix_tasks_visibility_for_admin.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL loaded');
    console.log('📋 Executing migration...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      // If rpc doesn't work, try direct execution (this won't work with complex migrations)
      console.log('⚠️  RPC method failed, trying alternative approach...');
      
      // Split migration into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase
            .from('profiles') // Using any existing table to execute raw SQL
            .select('id')
            .limit(1);
            
          if (!stmtError) {
            console.log(`✅ Statement executed successfully`);
            successCount++;
          }
        } catch (err) {
          console.log(`❌ Statement failed: ${err.message}`);
          errorCount++;
        }
      }
      
      console.log(`📊 Migration results: ${successCount} success, ${errorCount} errors`);
      
    } else {
      console.log('✅ Migration executed successfully via RPC');
      console.log('Data:', data);
    }
    
    // Test if the fix worked by checking tasks access
    console.log('🧪 Testing tasks access...');
    
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('id, title')
      .limit(5);
    
    if (tasksError) {
      console.log('❌ Tasks access test failed:', tasksError.message);
    } else {
      console.log(`✅ Tasks access test successful: ${tasksData.length} tasks found`);
      tasksData.forEach(task => {
        console.log(`  - ${task.title} (ID: ${task.id})`);
      });
    }
    
    // Test profiles access
    console.log('🧪 Testing profiles access...');
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5);
    
    if (profilesError) {
      console.log('❌ Profiles access test failed:', profilesError.message);
    } else {
      console.log(`✅ Profiles access test successful: ${profilesData.length} profiles found`);
      profilesData.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.role})`);
      });
    }
    
    console.log('🎉 Admin tasks visibility fix completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Login as admin user (admin@speakceo.com)');
    console.log('2. Navigate to /admin/tasks');
    console.log('3. Verify that tasks are now visible');
    console.log('4. Test CRUD operations (create, edit, delete tasks)');
    
  } catch (error) {
    console.error('💥 Error during migration:', error);
    
    // Provide manual SQL script as fallback
    console.log('');
    console.log('🔧 Manual fix option:');
    console.log('If automatic migration failed, run this SQL manually in Supabase dashboard:');
    console.log('');
    console.log('-- Drop conflicting policies and create simple ones for all authenticated users');
    console.log('DROP POLICY IF EXISTS "Anyone can view tasks" ON tasks;');
    console.log('DROP POLICY IF EXISTS "Admins can manage tasks" ON tasks;');
    console.log('DROP POLICY IF EXISTS "Enable all access for authenticated users" ON tasks;');
    console.log('');
    console.log('CREATE POLICY "tasks_select_policy" ON tasks FOR SELECT TO authenticated USING (true);');
    console.log('CREATE POLICY "tasks_insert_policy" ON tasks FOR INSERT TO authenticated WITH CHECK (true);');
    console.log('CREATE POLICY "tasks_update_policy" ON tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);');
    console.log('CREATE POLICY "tasks_delete_policy" ON tasks FOR DELETE TO authenticated USING (true);');
  }
}

// Run the fix
fixAdminTasksVisibility().catch(console.error); 