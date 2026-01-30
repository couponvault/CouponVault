@echo off
echo ========================================
echo    CouponVault - Easy Setup Script
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH!
    echo Please close this window, restart your terminal, and run this script again.
    pause
    exit /b 1
)

npm --version
echo Node.js is installed! ✓
echo.

echo [2/4] Installing project dependencies...
echo This may take 2-3 minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed! ✓
echo.

echo [3/4] Database Setup
echo.
echo IMPORTANT: You need MongoDB running.
echo.
echo Option 1: Local MongoDB (if installed)
echo   - Make sure MongoDB service is running
echo   - Your .env.local should have: MONGODB_URI=mongodb://localhost:27017/couponvault
echo.
echo Option 2: MongoDB Atlas (Cloud - Recommended)
echo   - Sign up at: https://www.mongodb.com/cloud/atlas
echo   - Create FREE cluster
echo   - Get connection string
echo   - Update .env.local with your connection string
echo.
set /p mongodb_ready="Is MongoDB ready? (y/n): "
if /i not "%mongodb_ready%"=="y" (
    echo Please set up MongoDB first, then run this script again.
    pause
    exit /b 0
)

echo.
echo [4/4] Seeding database with sample data...
call npm run seed
if %errorlevel% neq 0 (
    echo WARNING: Database seeding failed!
    echo Make sure MongoDB is running and .env.local is configured correctly.
    echo.
    echo You can seed later by running: npm run seed
    echo.
)

echo.
echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo To start your website, run:
echo   npm run dev
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo Admin login:
echo   Email: admin@couponvault.com
echo   Password: Admin@12345
echo.
pause
