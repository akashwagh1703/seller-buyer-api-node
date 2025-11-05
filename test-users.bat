@echo off
echo ========================================
echo Testing All User APIs
echo ========================================
echo.
echo Make sure the server is running on port 3000
echo Press any key to start tests...
pause > nul
echo.
node test-users-api.js
echo.
echo ========================================
echo Tests Complete
echo ========================================
pause
