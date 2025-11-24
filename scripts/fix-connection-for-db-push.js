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

// For db push, we need to avoid connection pooling issues
// Remove existing query params
let baseUrl = currentUrl.split('?')[0];

// Add parameters that work better with db push
// Use direct connection with connection limit
let newUrl = baseUrl;
if (newUrl.includes(':5432')) {
  newUrl = newUrl.replace(':5432', ':6543');
}

// Add connection parameters
newUrl = newUrl + '?sslmode=require&connection_limit=1';

console.log('🔄 Updating connection string for db push...');
console.log('New DATABASE_URL:', newUrl);
console.log('\n');

// Update .env file
const updatedContent = envContent.replace(
  /DATABASE_URL="?[^"\n]+"?/,
  `DATABASE_URL="${newUrl}"`
);

fs.writeFileSync(envPath, updatedContent, 'utf8');
console.log('✅ Updated .env file');
console.log('Now try: npm run db:push\n');

