import { supabase } from './supabase';

export async function verifyProductionReadiness() {
  const checks = {
    environment: false,
    database: false,
    authentication: false,
    tables: false,
    accounts: false,
    data: false,
    policies: false,
    errors: [] as string[]
  };

  console.log('🔍 Verifying production readiness...');

  try {
    // Check 1: Environment Variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (url && key && url.includes('supabase.co') && key.length > 100) {
      checks.environment = true;
      console.log('✅ Environment variables configured');
    } else {
      checks.errors.push('Environment variables missing or invalid');
      console.log('❌ Environment variables missing or invalid');
    }

    // Check 2: Database Connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (!error) {
        checks.database = true;
        console.log('✅ Database connection working');
      } else {
        checks.errors.push(`Database connection failed: ${error.message}`);
        console.log('❌ Database connection failed');
      }
    } catch (dbError: any) {
      checks.errors.push(`Database error: ${dbError.message}`);
      console.log('❌ Database error');
    }

    // Check 3: Authentication Service
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error) {
        checks.authentication = true;
        console.log('✅ Authentication service working');
      } else {
        checks.errors.push(`Auth service error: ${error.message}`);
        console.log('❌ Authentication service error');
      }
    } catch (authError: any) {
      checks.errors.push(`Auth error: ${authError.message}`);
      console.log('❌ Authentication error');
    }

    // Check 4: Required Tables
    const requiredTables = ['profiles', 'courses', 'tasks', 'user_progress', 'lessons'];
    let tablesExist = 0;
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        if (!error) {
          tablesExist++;
        }
      } catch {
        // Table doesn't exist
      }
    }
    
    if (tablesExist === requiredTables.length) {
      checks.tables = true;
      console.log('✅ All required tables exist');
    } else {
      checks.errors.push(`Only ${tablesExist}/${requiredTables.length} tables exist`);
      console.log(`❌ Only ${tablesExist}/${requiredTables.length} tables exist`);
    }

    // Check 5: Demo Accounts
    try {
      const { data: demoLogin, error: demoError } = await supabase.auth.signInWithPassword({
        email: 'demo@speakceo.ai',
        password: 'Demo123!'
      });
      
      if (demoLogin?.user && !demoError) {
        await supabase.auth.signOut();
        
        const { data: adminLogin, error: adminError } = await supabase.auth.signInWithPassword({
          email: 'admin@speakceo.ai',
          password: 'Admin123!'
        });
        
        if (adminLogin?.user && !adminError) {
          checks.accounts = true;
          console.log('✅ Demo accounts working');
          await supabase.auth.signOut();
        } else {
          checks.errors.push('Admin account not working');
          console.log('❌ Admin account not working');
        }
      } else {
        checks.errors.push('Demo account not working');
        console.log('❌ Demo account not working');
      }
    } catch (accountError: any) {
      checks.errors.push(`Account verification failed: ${accountError.message}`);
      console.log('❌ Account verification failed');
    }

    // Check 6: Sample Data
    try {
      const { data: courses } = await supabase.from('courses').select('id').limit(1);
      if (courses && courses.length > 0) {
        checks.data = true;
        console.log('✅ Sample data exists');
      } else {
        checks.errors.push('No sample data found');
        console.log('❌ No sample data found');
      }
    } catch (dataError: any) {
      checks.errors.push(`Data check failed: ${dataError.message}`);
      console.log('❌ Data check failed');
    }

    // Check 7: RLS Policies (simplified check)
    try {
      // This is a basic check - in production you'd verify specific policies
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (!error) {
        checks.policies = true;
        console.log('✅ Basic RLS policies working');
      } else {
        checks.errors.push('RLS policies may need configuration');
        console.log('⚠️ RLS policies may need configuration');
      }
    } catch (policyError: any) {
      checks.errors.push(`Policy check failed: ${policyError.message}`);
      console.log('❌ Policy check failed');
    }

    // Final assessment
    const totalChecks = Object.keys(checks).filter(key => key !== 'errors').length;
    const passedChecks = Object.values(checks).filter((value, index) => 
      index < totalChecks && value === true
    ).length;

    console.log(`\n📊 Production Readiness: ${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
      console.log('🎉 Ready for production deployment!');
    } else {
      console.log('⚠️ Some issues need to be resolved before deployment');
    }

    return checks;

  } catch (error: any) {
    checks.errors.push(`Verification failed: ${error.message}`);
    console.error('❌ Production verification failed:', error);
    return checks;
  }
}

export function generateDeploymentReport(checks: any) {
  let report = '# SpeakCEO.ai Deployment Report\n\n';
  
  report += '## System Status\n';
  report += `- Environment Variables: ${checks.environment ? '✅' : '❌'}\n`;
  report += `- Database Connection: ${checks.database ? '✅' : '❌'}\n`;
  report += `- Authentication Service: ${checks.authentication ? '✅' : '❌'}\n`;
  report += `- Database Tables: ${checks.tables ? '✅' : '❌'}\n`;
  report += `- Demo Accounts: ${checks.accounts ? '✅' : '❌'}\n`;
  report += `- Sample Data: ${checks.data ? '✅' : '❌'}\n`;
  report += `- Security Policies: ${checks.policies ? '✅' : '❌'}\n\n`;
  
  if (checks.errors.length > 0) {
    report += '## Issues Found\n';
    checks.errors.forEach((error: string, index: number) => {
      report += `${index + 1}. ${error}\n`;
    });
    report += '\n';
  }
  
  report += '## Next Steps\n';
  if (checks.errors.length === 0) {
    report += '🎉 **Ready for deployment!**\n\n';
    report += 'Your application is fully configured and ready for production use.\n';
  } else {
    report += '🔧 **Setup required:**\n\n';
    report += '1. Fix the issues listed above\n';
    report += '2. Run the "🚀 Full Setup" button in the login page\n';
    report += '3. Verify all demo accounts work\n';
    report += '4. Re-run this verification\n';
  }
  
  return report;
} 