@echo off
echo ========================================
echo   Deploy to Railway (WAN)
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Initializing git...
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
)

echo.
echo Next steps:
echo.
echo 1. Create GitHub repo: https://github.com/new
echo 2. Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/expense-ai.git
echo    git push -u origin main
echo.
echo 3. Go to: https://railway.app
echo 4. New Project ^> Deploy from GitHub repo
echo 5. Select your repo
echo 6. Railway will auto-deploy!
echo.
echo 7. Get URL from: Settings ^> Domains ^> Generate Domain
echo.
echo 8. Update frontend/src/services/api.js with Railway URL
echo.
pause

start https://github.com/new
start https://railway.app
