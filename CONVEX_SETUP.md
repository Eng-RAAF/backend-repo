# Convex Database Setup Guide

This project now includes Convex as an alternative database solution alongside Prisma/PostgreSQL.

## What is Convex?

Convex is a backend-as-a-service platform that provides:
- Real-time database with automatic reactivity
- Serverless functions (queries and mutations)
- Built-in authentication
- File storage
- TypeScript support

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Initialize Convex

```bash
npm run convex:init
```

This will:
- Create a Convex account (if you don't have one)
- Create a new Convex project
- Generate the necessary configuration files
- Set up the Convex deployment URL

### 3. Configure Environment Variables

After initialization, you'll get a `CONVEX_URL`. Add it to your environment variables:

**For local development:**
Create or update `backend/.env`:
```
CONVEX_URL=https://your-project.convex.cloud
```

**For Vercel deployment:**
1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Add `CONVEX_URL` with your Convex deployment URL
3. Set it for Production, Preview, and Development

### 4. Deploy Convex Functions

```bash
npm run convex:deploy
```

Or for development with auto-reload:
```bash
npm run convex:dev
```

## Project Structure

```
backend/
├── convex/
│   ├── schema.ts          # Database schema definition
│   ├── students.ts        # Student queries and mutations
│   ├── teachers.ts        # Teacher queries and mutations
│   ├── classes.ts         # Class queries and mutations
│   ├── enrollments.ts     # Enrollment queries and mutations
│   ├── users.ts           # User queries and mutations
│   ├── messages.ts        # Message queries and mutations
│   ├── schools.ts         # School queries and mutations
│   ├── branches.ts        # Branch queries and mutations
│   ├── auth.ts            # Authentication functions
│   └── analytics.ts       # Analytics queries
├── lib/
│   └── convex.js          # Convex client adapter for Express backend
└── convex.json            # Convex configuration
```

## Using Convex in Your Backend

### Option 1: Use Convex Client Adapter

The `lib/convex.js` file provides a compatibility layer that mimics the Prisma interface:

```javascript
import convex from '../lib/convex.js';

// Use Convex instead of Prisma
const students = await convex.students.getAll();
const student = await convex.students.getById(id);
const newStudent = await convex.students.create({ name, email });
```

### Option 2: Use Convex Directly

You can also use Convex directly in your routes:

```javascript
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.CONVEX_URL);
const students = await client.query("students:list");
```

### Option 3: Switch Between Prisma and Convex

You can create a data layer abstraction to switch between databases:

```javascript
// lib/database.js
const USE_CONVEX = process.env.USE_CONVEX === 'true';

export const getStudents = async () => {
  if (USE_CONVEX) {
    return await convex.students.getAll();
  } else {
    return await prisma.student.findMany();
  }
};
```

## Convex Functions

### Queries (Read Operations)

Queries are read-only operations that can be called from the frontend or backend:

- `students:list` - Get all students
- `students:get` - Get student by ID
- `students:getByEmail` - Get student by email
- Similar patterns for all models

### Mutations (Write Operations)

Mutations are write operations that modify data:

- `students:create` - Create a new student
- `students:update` - Update a student
- `students:remove` - Delete a student
- Similar patterns for all models

## Frontend Integration

Convex can also be used directly from the frontend for real-time updates:

```javascript
// frontend/src/lib/convex.js
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export { ConvexProvider, convex };
```

Then in your React components:

```javascript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function StudentsList() {
  const students = useQuery(api.students.list);
  const createStudent = useMutation(api.students.create);
  
  // Real-time updates automatically!
}
```

## Key Differences from Prisma

1. **IDs**: Convex uses `_id` (Id type) instead of integer IDs
2. **Timestamps**: Convex uses Unix timestamps (numbers) instead of DateTime
3. **Relations**: Convex uses ID references instead of Prisma relations
4. **Real-time**: Convex queries automatically update when data changes
5. **Type Safety**: Convex provides full TypeScript type safety

## Migration from Prisma to Convex

To migrate existing data:

1. Export data from Prisma
2. Transform IDs from integers to Convex IDs
3. Transform DateTime to Unix timestamps
4. Import into Convex using mutations

## Environment Variables

Required:
- `CONVEX_URL` - Your Convex deployment URL (from `convex dev` or dashboard)

Optional:
- `USE_CONVEX` - Set to `'true'` to use Convex instead of Prisma

## Troubleshooting

### "CONVEX_URL is not set"
- Run `npm run convex:dev` to get your Convex URL
- Add it to your `.env` file or Vercel environment variables

### "Function not found"
- Make sure you've deployed: `npm run convex:deploy`
- Check that the function name matches exactly (case-sensitive)

### Type Errors
- Run `npm run convex:dev` to regenerate types
- Make sure TypeScript is configured correctly

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Convex Examples](https://github.com/get-convex/convex-demos)

## Next Steps

1. Run `npm install` to install Convex
2. Run `npm run convex:init` to set up your project
3. Add `CONVEX_URL` to your environment variables
4. Deploy: `npm run convex:deploy`
5. Start using Convex in your routes!

