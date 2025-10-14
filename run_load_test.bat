@echo off
echo ========================================
echo Load Test - 100 Users Concurrent
echo ========================================
echo.
echo Starting Locust load testing...
echo.
echo Web UI: http://localhost:8089
echo.
echo Instructions:
echo 1. Open http://localhost:8089 in browser
echo 2. Enter host: https://uniocular-abraham-phrenetically.ngrok-free.dev
echo 3. Number of users: 100
echo 4. Spawn rate: 10 (users per second)
echo 5. Click "Start swarming"
echo.
echo ========================================
echo.

locust -f load_test.py

pause
