@echo off
echo Testing Nerace API...
echo.

set BASE_URL=http://localhost:3000
set API_KEY=test_api_key_12345
set DOMAIN=test.famrut.com
set APPNAME=master_uat

echo 1. Testing Health Check...
curl -s %BASE_URL%/health
echo.
echo.

echo 2. Testing Register OTP...
curl -X POST %BASE_URL%/api/v16/users/register_otp ^
  -H "X-API-KEY: %API_KEY%" ^
  -H "domain: %DOMAIN%" ^
  -H "appname: %APPNAME%" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"first_name\":\"Test\",\"last_name\":\"User\",\"btn_submit\":\"submit\"}"
echo.
echo.

echo 3. Testing Verify OTP...
curl -X POST %BASE_URL%/api/v16/users/verify_otp ^
  -H "X-API-KEY: %API_KEY%" ^
  -H "domain: %DOMAIN%" ^
  -H "appname: %APPNAME%" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\"}"
echo.
echo.

echo 4. Testing Login OTP...
curl -X POST %BASE_URL%/api/v16/users/login_otp ^
  -H "X-API-KEY: %API_KEY%" ^
  -H "domain: %DOMAIN%" ^
  -H "appname: %APPNAME%" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\"}"
echo.
echo.

echo Tests completed!
pause
