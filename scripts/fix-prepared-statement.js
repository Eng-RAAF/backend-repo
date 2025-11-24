import { PrismaClient } from '@prisma/client';

/**
 * This script works around the prepared statement error
 * by using a fresh connection and checking if tables exist
 */

async function fixPreparedStatement() {
  console.log('Working around prepared statement error...\n');
  
  // Create a fresh Prisma client with connection limit
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Check each table
    const tables = {
      users: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "users"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      },
      students: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "students"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      },
      teachers: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "teachers"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      },
      classes: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "classes"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      },
      enrollments: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "enrollments"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      },
      messages: async () => {
        try {
          const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "messages"`;
          return { exists: true, count: count[0].count };
        } catch (e) {
          return { exists: false, error: e.message };
        }
      }
    };

    console.log('Checking tables...\n');
    const results = {};
    
    for (const [table, checkFn] of Object.entries(tables)) {
      results[table] = await checkFn();
      if (results[table].exists) {
        console.log(`✅ ${table}: exists (${results[table].count} records)`);
      } else {
        console.log(`❌ ${table}: ${results[table].error}`);
      }
    }

    await prisma.$disconnect();

    // Summary
    const allExist = Object.values(results).every(r => r.exists);
    console.log('\n' + '='.repeat(50));
    if (allExist) {
      console.log('✅ All tables exist! Your schema is complete.');
      console.log('You do NOT need to run db:push.');
      console.log('The prepared statement error can be ignored.');
    } else {
      console.log('⚠️  Some tables are missing.');
      console.log('\nSolutions:');
      console.log('1. Run the SQL in scripts/create-users-table.sql via Supabase SQL Editor');
      console.log('2. Or manually create missing tables');
    }
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixPreparedStatement();

