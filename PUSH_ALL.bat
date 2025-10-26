@echo off
title Push All to GitHub
color 0E

cd /d %~dp0

echo Adding all files...
git add .

echo Committing...
git commit -m "Update: Complete LAN and WAN system"

echo Pushing to main...
git push origin main

echo.
echo Done!
pause
