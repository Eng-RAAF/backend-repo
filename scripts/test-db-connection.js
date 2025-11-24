import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('Testing database connection...\n');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Test basic connection
    console.log('Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database!\n');

    // Test a simple query
    console.log('Testing query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query successful! Found ${userCount} users.\n`);

    await prisma.$disconnect();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    console.error('\nTroubleshooting steps:');
    console.error('1. Check if your Supabase project is active (not paused)');
    console.error('2. Verify your DATABASE_URL in .env file');
    console.error('3. For Supabase, try adding ?pgbouncer=true&connection_limit=1 to your connection string');
    console.error('4. Check if your network/firewall allows connections to port 5432');
    console.error('5. Try using the direct connection URL instead of pooler');
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();

