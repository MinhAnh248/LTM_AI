@echo off
echo ========================================
echo Load Test LAN - No Limits
echo ========================================
echo.
echo Testing on LAN (no rate limits)
echo Web UI: http://localhost:8089
echo.
echo Instructions:
echo 1. Open http://localhost:8089
echo 2. Host: http://10.67.148.12:5000
echo 3. Users: 100
echo 4. Spawn rate: 10
echo.
locust -f load_test.py
