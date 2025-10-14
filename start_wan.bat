@echo off
echo ========================================
echo Starting Expense AI - WAN Mode
echo ========================================
echo.
echo This will:
echo 1. Start backend
echo 2. Start Cloudflare tunnel
echo 3. Auto-update frontend API URL
echo 4. Start frontend
echo.
echo ========================================
echo.

python start_wan.py

pause
