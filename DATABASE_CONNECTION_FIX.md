# Database Connection Fix Guide

## Error: Can't reach database server

If you're seeing this error:
```
Can't reach database server at `host:port`
```

## Quick Fixes

### Fix 1: Check Database Status

1. Go to your database provider dashboard
2. Check if your database is **Active** (not paused)
3. If paused, resume it from your provider dashboard
4. Wait a few minutes for the database to start

### Fix 2: Use Direct Connection Instead of Pooler

If you're using a connection pooler and experiencing issues, try using the **direct connection** instead:

1. Go to your database provider dashboard → Database settings
2. Find **Connection string** section
3. Select **"Direct connection"** (not "Connection pooling") if available
4. Copy the connection string
5. Update your `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

**Important:** 
- Use direct connection when possible for better reliability
- Make sure all credentials are correct

### Fix 3: Verify DATABASE_URL Format

Your DATABASE_URL should look like:

```
postgresql://user:password@host:port/database
```

**Example:**
```
postgresql://myuser:mypassword@db.example.com:5432/mydb
```

### Fix 4: Check Network/Firewall

1. Ensure your network allows connections to your database host
2. Check if a firewall is blocking the database port (usually 5432)
3. Try from a different network to test
4. Verify your database provider allows connections from your IP

### Fix 5: Test Connection

Run this script to test your connection:

```bash
cd backend
node scripts/test-db-connection.js
```

## Recommended Solution

**Use Direct Connection for Development:**

1. In your database provider dashboard → Database settings
2. Copy the **"Direct connection"** string (or standard connection string)
3. Update `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

**Note:** Replace all placeholders with your actual database credentials.

## After Fixing

1. Restart your backend server
2. Test the connection again
3. If still failing, check your database provider status

## Common Issues

**Issue:** Database is paused
- **Solution:** Resume database from your provider dashboard

**Issue:** Wrong password
- **Solution:** Reset password from your database provider dashboard

**Issue:** Using pooler when direct is needed
- **Solution:** Switch to direct connection string from your provider

**Issue:** Network blocking
- **Solution:** Check firewall/VPN settings, verify IP whitelist in database settings

**Issue:** Incorrect host or port
- **Solution:** Verify connection details from your database provider dashboard

