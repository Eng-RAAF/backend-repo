# Vercel Configuration Fix

## Issue
Vercel was trying to build the backend as a static site and looking for a "public" directory, but this is a serverless function backend.

## Solution
The `vercel.json` uses the `builds` configuration which is correct for Express serverless functions. The warning about `builds` is just informational - it's still the proper way to configure Express apps on Vercel.

## Current Configuration

The `vercel.json` is now configured correctly:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

This tells Vercel:
- Use `@vercel/node` to build the serverless function
- Route all requests to `api/index.js`
- This is a serverless function, not a static site

## Deploy Again

Now try deploying again:

```bash
cd backend
npx vercel --prod
```

The error about "public" directory should be gone.

## Note About the Warning

The warning "Due to `builds` existing in your configuration file..." is just informational. It means:
- ✅ Your `vercel.json` configuration will be used (which is what we want)
- ⚠️ Build settings in Vercel Dashboard won't apply (which is fine)

This is the correct configuration for Express serverless functions on Vercel.

