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

// Try direct connection (port 6543) instead of pooler (5432)
let newUrl = currentUrl;
if (newUrl.includes(':5432')) {
  newUrl = newUrl.replace(':5432', ':6543');
}

// Remove existing query params and add SSL
if (newUrl.includes('?')) {
  newUrl = newUrl.split('?')[0];
}
newUrl = newUrl + '?sslmode=require';

console.log('🔄 Trying direct connection (port 6543) instead of pooler...');
console.log('New DATABASE_URL:', newUrl);
console.log('\n');

// Update .env file
const updatedContent = envContent.replace(
  /DATABASE_URL="?[^"\n]+"?/,
  `DATABASE_URL="${newUrl}"`
);

fs.writeFileSync(envPath, updatedContent, 'utf8');
console.log('✅ Updated .env file with direct connection URL');
console.log('Please test the connection with: node scripts/test-db-connection.js\n');

console.log('If this still doesn\'t work, please:');
console.log('1. Check your Supabase dashboard - make sure the project is ACTIVE (not paused)');
console.log('2. Go to Settings → Database → Connection string');
console.log('3. Copy the "Direct connection" string (not pooler)');
console.log('4. Update your .env file manually\n');

