@echo off
echo ========================================
echo   SmartClass - Server Startup Script
echo ========================================
echo.

echo [1/3] Checking XAMPP status...
echo Please ensure XAMPP Apache and MySQL are running!
echo.
pause

echo [2/3] Starting React Development Server...
echo.

cd /d "%~dp0shadcn-ui"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Vite dev server...
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause


