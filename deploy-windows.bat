@echo off
echo 🚀 AI Threat Dashboard - Windows Deployment Script
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Building React application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 📋 Next steps:
echo 1. Get your EC2 instance public IP from AWS Console
echo 2. Download your .pem key file
echo 3. Run the upload commands from DEPLOYMENT_GUIDE.md
echo.
echo 💡 Your files are ready in the 'dist' folder
echo 💡 Server.js is configured for your S3 buckets
echo.
echo Press any key to open deployment guide...
pause >nul
start DEPLOYMENT_GUIDE.md