# Vercel Deployment Notes

## ✅ Deployment Successful!

Your backend has been deployed to Vercel. The deployment URL is:
`https://backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app`

## Configuration Update

I've updated `vercel.json` to use the modern Vercel configuration format (removed the deprecated `builds` field). This removes the warning you saw.

## Next Steps

### 1. Set Environment Variables

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these variables:

```
CONVEX_URL=https://your-project.convex.cloud
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
USE_CONVEX=true
```

**Important:** Set for **Production**, **Preview**, and **Development** environments.

### 2. Redeploy After Adding Environment Variables

After adding environment variables, you need to redeploy:

**Option A: Via Vercel Dashboard**
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

**Option B: Via Command Line**
```bash
cd backend
npx vercel --prod
```

### 3. Test Your Deployment

Visit your backend URL:
```
https://backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app
```

You should see:
```json
{
  "message": "Class Management System API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

Test an endpoint:
```
https://backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app/api/students
```

### 4. Deploy Frontend

```bash
cd frontend
npx vercel
```

Then add environment variable:
- `VITE_API_URL` = Your backend URL (from step 1)

### 5. View Logs

If you need to debug:

**Via Command Line:**
```bash
npx vercel logs backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app
```

**Via Dashboard:**
- Go to **Vercel Dashboard → Your Project → Deployments**
- Click on a deployment
- Click **View Function Logs**

## Common Commands

```bash
# View deployment info
npx vercel inspect backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app

# Redeploy
npx vercel redeploy backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app

# View logs
npx vercel logs backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app
```

## Troubleshooting

### Environment Variables Not Working

- Make sure you set them for the correct environment (Production/Preview/Development)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### API Not Responding

- Check Vercel function logs
- Verify `CONVEX_URL` is set correctly
- Make sure Convex functions are deployed

### CORS Errors

- Add `FRONTEND_URL` to backend environment variables
- Make sure URLs match exactly (with https://)

## Your Deployment URL

**Backend:** `https://backend-ocyrr0qrj-kamaal-abdulaahi-faraxs-projects.vercel.app`

Update this in your frontend's `VITE_API_URL` environment variable!

