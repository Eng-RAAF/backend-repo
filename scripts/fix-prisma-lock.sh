#!/bin/bash
# Fix Prisma file lock issue on Linux/Mac
# This script stops Node processes and removes locked Prisma files

echo "Fixing Prisma file lock issue..."
echo ""

# Stop all Node processes
echo "Stopping Node.js processes..."
pkill -f node || echo "No Node processes to stop"
sleep 2

# Remove locked Prisma directory
echo ""
echo "Removing locked Prisma files..."
if [ -d "node_modules/.prisma" ]; then
    rm -rf node_modules/.prisma
    echo "✅ Removed .prisma directory"
else
    echo "ℹ️  .prisma directory not found"
fi

# Regenerate Prisma Client
echo ""
echo "Regenerating Prisma Client..."
npm run db:generate

echo ""
echo "✅ Done! You can now start your server."

