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

// For migrations, use transaction pooler (port 5432) with pgbouncer
let baseUrl = currentUrl.split('?')[0];

// Ensure we're using port 5432 (pooler) for migrations
let newUrl = baseUrl;
if (newUrl.includes(':6543')) {
  newUrl = newUrl.replace(':6543', ':5432');
}

// Use transaction pooler mode for migrations
// This works better with Prisma migrations
newUrl = newUrl + '?pgbouncer=true';

console.log('🔄 Switching to transaction pooler for migrations...');
console.log('New DATABASE_URL:', newUrl);
console.log('\n');
console.log('Note: This uses the pooler which is better for migrations.');
console.log('For regular queries, you can switch back to direct connection (port 6543).\n');

// Update .env file
const updatedContent = envContent.replace(
  /DATABASE_URL="?[^"\n]+"?/,
  `DATABASE_URL="${newUrl}"`
);

fs.writeFileSync(envPath, updatedContent, 'utf8');
console.log('✅ Updated .env file');
console.log('Now try: npm run db:push\n');

