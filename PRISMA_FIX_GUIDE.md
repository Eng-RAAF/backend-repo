# Fixing Prisma File Lock Issues

## Problem
When you see this error:
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node'
```

This happens because a Node.js process is using the Prisma query engine file, preventing it from being updated.

## Quick Fix (Windows PowerShell)

### Option 1: Use the fix script
```bash
npm run prisma:fix
```

### Option 2: Manual fix
```powershell
# Stop all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remove locked files
Remove-Item "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Regenerate
npm run db:generate
```

### Option 3: One-liner
```powershell
Get-Process -Name node | Stop-Process -Force; Remove-Item "node_modules\.prisma" -Recurse -Force; npm run db:generate
```

## Prevention Tips

1. **Always stop your server before running Prisma commands:**
   - Press `Ctrl+C` in the terminal running the server
   - Or close the terminal window

2. **Stop server before npm install:**
   ```bash
   # Stop server first, then:
   npm install
   ```

3. **Use the fix script:**
   ```bash
   npm run prisma:fix
   ```

## Why This Happens

- The Prisma query engine (`query_engine-windows.dll.node`) is a native binary file
- When your server is running, it loads this file into memory
- Windows locks files that are in use, preventing them from being replaced
- Prisma needs to replace this file when regenerating the client

## Solution

The fix script automatically:
1. Stops all Node.js processes
2. Removes the locked `.prisma` directory
3. Regenerates the Prisma Client

## After Fixing

You can restart your server:
```bash
npm run dev
# or
node server.js
```

