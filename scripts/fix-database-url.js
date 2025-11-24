import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

// Read current .env file
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Extract current DATABASE_URL
const currentUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
if (!currentUrlMatch) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

const currentUrl = currentUrlMatch[1];
console.log('Current DATABASE_URL:', currentUrl);
console.log('\n');

// Check if it already has parameters
if (currentUrl.includes('?')) {
  console.log('⚠️  DATABASE_URL already has query parameters');
  console.log('Current URL:', currentUrl);
  console.log('\nTrying different connection formats...\n');
} else {
  // Try adding Supabase pooler parameters
  const newUrl = currentUrl + '?pgbouncer=true&connection_limit=1';
  console.log('✅ Suggested fix: Add pooler parameters');
  console.log('New DATABASE_URL:', newUrl);
  console.log('\n');
  
  // Update .env file
  const updatedContent = envContent.replace(
    /DATABASE_URL="?[^"\n]+"?/,
    `DATABASE_URL="${newUrl}"`
  );
  
  fs.writeFileSync(envPath, updatedContent, 'utf8');
  console.log('✅ Updated .env file with new DATABASE_URL');
  console.log('Please test the connection with: node scripts/test-db-connection.js\n');
}

// Provide alternative solutions
console.log('Alternative solutions if the above doesn\'t work:\n');
console.log('1. Use direct connection (port 6543 instead of 5432):');
console.log('   Change port from :5432 to :6543');
console.log('   Add: ?sslmode=require\n');

console.log('2. Check Supabase dashboard:');
console.log('   - Go to Settings → Database');
console.log('   - Copy the "Connection pooling" connection string');
console.log('   - Make sure your project is not paused\n');

console.log('3. Try without pooler (direct connection):');
console.log('   Use the "Direct connection" string from Supabase dashboard\n');

