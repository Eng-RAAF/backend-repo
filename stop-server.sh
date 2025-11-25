#!/bin/bash
# Stop Node.js server on Windows (Git Bash compatible)

echo "Stopping Node.js processes..."

# Kill all node processes (Windows)
taskkill /F /IM node.exe 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Stopped Node.js processes"
else
    echo "ℹ️  No Node.js processes found or already stopped"
fi

echo ""
echo "You can now start the server with: npm run dev"

