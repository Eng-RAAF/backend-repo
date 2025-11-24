import prisma from '../lib/prisma.js';

async function checkTables() {
  try {
    console.log('Checking database tables...\n');
    
    // Test if we can query each model
    const checks = {
      users: await prisma.user.count().catch(() => null),
      students: await prisma.student.count().catch(() => null),
      teachers: await prisma.teacher.count().catch(() => null),
      classes: await prisma.class.count().catch(() => null),
      enrollments: await prisma.enrollment.count().catch(() => null),
      messages: await prisma.message.count().catch(() => null)
    };

    console.log('Table status:');
    for (const [table, count] of Object.entries(checks)) {
      if (count !== null) {
        console.log(`✅ ${table}: exists (${count} records)`);
      } else {
        console.log(`❌ ${table}: does not exist or error`);
      }
    }

    await prisma.$disconnect();
    
    // If all tables exist, schema is already pushed
    const allExist = Object.values(checks).every(count => count !== null);
    if (allExist) {
      console.log('\n✅ All tables exist! Your schema is already in the database.');
      console.log('You can now use the application normally.');
    } else {
      console.log('\n⚠️  Some tables are missing. You may need to push the schema.');
      console.log('Try using Supabase SQL Editor to create tables manually, or');
      console.log('contact Supabase support about the prepared statement issue.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTables();

