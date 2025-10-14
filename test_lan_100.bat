@echo off
echo ========================================
echo   LOAD TEST - LAN (No Limits)
echo ========================================
echo.
echo Testing on LAN: http://10.67.148.12:5000
echo.
echo Starting Locust...
echo.

python -m locust -f load_test.py --host=http://10.67.148.12:5000

pause
