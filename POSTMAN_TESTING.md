# Postman Testing Guide for Vercel Deployment

## Correct URL Format

When testing your backend API on Vercel with Postman, use this format:

```
https://your-backend-name.vercel.app/api/auth/register
```

**Important Notes:**
- Replace `your-backend-name` with your actual Vercel backend project name
- Always include `/api` prefix before the route
- Use `https://` (not `http://`)

## Example URLs

### Registration Endpoint
```
POST https://your-backend.vercel.app/api/auth/register
```

### Login Endpoint
```
POST https://your-backend.vercel.app/api/auth/login
```

### Other Endpoints
```
GET  https://your-backend.vercel.app/api/students
GET  https://your-backend.vercel.app/api/classes
POST https://your-backend.vercel.app/api/students
```

## Postman Setup

### 1. Create a New Request

1. Open Postman
2. Click **"New"** → **"HTTP Request"**
3. Set method to **POST**
4. Enter URL: `https://your-backend.vercel.app/api/auth/register`

### 2. Configure Headers

Go to **Headers** tab and add:
```
Content-Type: application/json
```

### 3. Add Request Body

1. Go to **Body** tab
2. Select **raw**
3. Select **JSON** from dropdown
4. Add your request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "user"
}
```

### 4. Send Request

Click **Send** button

## Expected Responses

### Success Response (200)
```json
{
  "user": {
    "id": "123",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses

**400 - Bad Request:**
```json
{
  "error": "Email, password, and name are required"
}
```

**400 - User Exists:**
```json
{
  "error": "User with this email already exists"
}
```

**404 - Not Found:**
```json
{
  "error": "Route not found"
}
```

## Troubleshooting

### Issue: "The page could not be found" / NOT_FOUND

**Possible Causes:**

1. **Wrong URL Format**
   - ❌ Wrong: `https://backend.vercel.app/auth/register`
   - ✅ Correct: `https://backend.vercel.app/api/auth/register`
   - Always include `/api` prefix

2. **Backend Not Deployed**
   - Check Vercel dashboard
   - Ensure backend deployment is successful
   - Check deployment logs for errors

3. **Wrong Backend URL**
   - Verify your backend URL in Vercel dashboard
   - Test root endpoint: `https://your-backend.vercel.app/`
   - Should return API information

4. **Vercel Configuration Issue**
   - Ensure `vercel.json` is in the backend folder
   - Ensure `api/index.js` exists
   - Redeploy after configuration changes

### Issue: CORS Errors

If you get CORS errors:
- This is normal for browser requests
- Postman should work fine (no CORS restrictions)
- If CORS errors in Postman, check backend CORS configuration

### Issue: Connection Timeout

- Check if backend is deployed and running
- Verify the URL is correct
- Check Vercel function logs for errors
- Ensure database connection is working

## Testing Steps

1. **Test Root Endpoint First:**
   ```
   GET https://your-backend.vercel.app/
   ```
   Should return API information

2. **Test Registration:**
   ```
   POST https://your-backend.vercel.app/api/auth/register
   ```
   With JSON body containing name, email, password, role

3. **Check Vercel Logs:**
   - Go to Vercel Dashboard
   - Select your backend project
   - Go to **Functions** tab
   - Click on the function
   - View logs for any errors

## Quick Test Commands

### Using curl (if you have it):
```bash
# Test root endpoint
curl https://your-backend.vercel.app/

# Test registration
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","role":"user"}'
```

### Using PowerShell (Windows):
```powershell
# Test root endpoint
Invoke-WebRequest -Uri "https://your-backend.vercel.app/" -Method GET

# Test registration
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    role = "user"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://your-backend.vercel.app/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## Common Mistakes

1. **Missing /api prefix** - Most common mistake
2. **Using http:// instead of https://**
3. **Wrong Content-Type header** - Must be `application/json`
4. **Missing request body** - Registration requires JSON body
5. **Typos in URL** - Double-check the backend URL
6. **Backend not redeployed** - After code changes, redeploy

## Next Steps

After successful registration:
1. Test login endpoint with created credentials
2. Test other endpoints (students, classes, etc.)
3. Use the returned token for authenticated requests
4. Add `Authorization: Bearer <token>` header for protected routes

