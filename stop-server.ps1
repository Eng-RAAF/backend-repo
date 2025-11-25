# Stop Node.js server (PowerShell)

Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow

$processes = Get-Process -Name node -ErrorAction SilentlyContinue

if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Stopped $($processes.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Node.js processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "You can now start the server with: npm run dev" -ForegroundColor Cyan

