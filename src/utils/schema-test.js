import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xgvtduyizhaiqguuskfu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndnRkdXlpemhhaXFndXVza2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODE0MTMsImV4cCI6MjA1OTA1NzQxM30.TqU22hHSx7ej8f3XewdbY8FUaFF7TdDhelHXc_vYHak';

const supabase = createClient(supabaseUrl, supabaseKey);

const expectedTables = [
  'profiles',
  'modules', 
  'lessons',
  'tasks',
  'live_classes',
  'user_progress',
  'task_submissions',
  'courses',
  'announcements',
  'user_enrollments'
];

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      return {
        table: tableName,
        status: '❌ ERROR',
        records: 0,
        error: error.message
      };
    }

    const columns = data && data.length > 0 ? Object.keys(data[0]).length : 0;
    
    return {
      table: tableName,
      status: count > 0 ? '✅ HAS DATA' : '⚠️ EMPTY',
      records: count || 0,
      columns: columns
    };
  } catch (err) {
    return {
      table: tableName,
      status: '❌ FAILED',
      records: 0,
      error: err.message
    };
  }
}

async function runSchemaCheck() {
  console.log('🔍 CHECKING ONLINE SUPABASE DATABASE SCHEMA');
  console.log('='.repeat(50));
  console.log(`Database URL: ${supabaseUrl}`);
  console.log('='.repeat(50));

  // Test connection first
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log('❌ CONNECTION FAILED:', error.message);
      return;
    }
    console.log('✅ DATABASE CONNECTION: SUCCESS');
  } catch (err) {
    console.log('❌ CONNECTION FAILED:', err.message);
    return;
  }

  console.log('\n📊 TABLE STATUS:');
  console.log('-'.repeat(50));

  let totalTables = 0;
  let tablesExist = 0;
  let tablesWithData = 0;

  for (const table of expectedTables) {
    const result = await checkTable(table);
    totalTables++;
    
    if (!result.error) {
      tablesExist++;
      if (result.records > 0) {
        tablesWithData++;
      }
    }

    console.log(`${result.status.padEnd(12)} ${table.padEnd(20)} Records: ${result.records.toString().padEnd(6)} Columns: ${result.columns || 0}`);
    
    if (result.error) {
      console.log(`   └─ Error: ${result.error}`);
    }
  }

  console.log('\n📈 SUMMARY:');
  console.log('-'.repeat(50));
  console.log(`Total Tables Expected: ${totalTables}`);
  console.log(`Tables Exist: ${tablesExist}`);
  console.log(`Tables With Data: ${tablesWithData}`);
  console.log(`Overall Status: ${tablesExist === totalTables && tablesWithData === totalTables ? '✅ PERFECT' : tablesWithData > 0 ? '⚠️ NEEDS ATTENTION' : '❌ CRITICAL'}`);

  if (tablesExist < totalTables) {
    console.log('\n🔧 MISSING TABLES DETECTED - Schema migration needed');
  }
  
  if (tablesExist === totalTables && tablesWithData < totalTables) {
    console.log('\n📝 EMPTY TABLES DETECTED - Data seeding needed');
  }

  if (tablesExist === totalTables && tablesWithData === totalTables) {
    console.log('\n🎉 ALL SYSTEMS GO - Database is fully functional!');
  }

  console.log('\n🚀 NEXT STEPS:');
  if (tablesExist < totalTables) {
    console.log('1. Run database migrations to create missing tables');
    console.log('2. Apply RLS policies');
    console.log('3. Seed with initial data');
  } else if (tablesWithData < totalTables) {
    console.log('1. Seed empty tables with initial data');
    console.log('2. Create admin user account');
  } else {
    console.log('1. ✅ Database ready for production use');
    console.log('2. ✅ Admin panel should work perfectly');
    console.log('3. ✅ All CRUD operations enabled');
  }
}

// Run the check
runSchemaCheck().catch(console.error); 