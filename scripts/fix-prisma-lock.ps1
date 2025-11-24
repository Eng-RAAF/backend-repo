# Fix Prisma file lock issue on Windows
# This script stops Node processes and removes locked Prisma files

Write-Host "Fixing Prisma file lock issue..." -ForegroundColor Yellow
Write-Host ""

# Stop all Node processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Stopped $($nodeProcesses.Count) Node process(es)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "ℹ️  No Node processes running" -ForegroundColor Gray
}

# Remove locked Prisma directory
Write-Host ""
Write-Host "Removing locked Prisma files..." -ForegroundColor Cyan
$prismaPath = "node_modules\.prisma"
if (Test-Path $prismaPath) {
    Remove-Item $prismaPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Removed .prisma directory" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .prisma directory not found" -ForegroundColor Gray
}

# Regenerate Prisma Client
Write-Host ""
Write-Host "Regenerating Prisma Client..." -ForegroundColor Cyan
npm run db:generate

Write-Host ""
Write-Host "✅ Done! You can now start your server." -ForegroundColor Green

