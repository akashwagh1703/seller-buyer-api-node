# Testing Guide - Nerace API Node.js

## Quick Start

### 1. Install Dependencies
```bash
cd nerace-api-node
npm install
```

### 2. Setup Environment
```bash
# Copy example env file
copy .env.example .env

# Edit .env and set:
# - Database credentials (PostgreSQL)
# - API_KEY=your_test_api_key
# - JWT_SECRET=your_jwt_secret
# - SMS gateway details (optional for testing)
```

### 3. Start Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at: http://localhost:3000

### 4. Test Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}
```

## Testing Users API

### Using cURL

#### 1. Register OTP
```bash
curl -X POST http://localhost:3000/api/v16/users/register_otp ^
  -H "X-API-KEY: your_api_key_here" ^
  -H "domain: test.famrut.com" ^
  -H "appname: master_uat" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"first_name\":\"Test\",\"last_name\":\"User\",\"btn_submit\":\"submit\"}"
```

Response:
```json
{
  "success": true,
  "error": false,
  "status": 200,
  "data": {
    "user_id": 123,
    "active_step": 1,
    "opt_number": "643215"
  },
  "message": "Register_Successfully"
}
```

#### 2. Verify OTP
```bash
curl -X POST http://localhost:3000/api/v16/users/verify_otp ^
  -H "X-API-KEY: your_api_key_here" ^
  -H "domain: test.famrut.com" ^
  -H "appname: master_uat" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\"}"
```

#### 3. Login with OTP
```bash
curl -X POST http://localhost:3000/api/v16/users/login_otp ^
  -H "X-API-KEY: your_api_key_here" ^
  -H "domain: test.famrut.com" ^
  -H "appname: master_uat" ^
  -H "Content-Type: application/json" ^
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\"}"
```

Save the token from Authorization header for next requests.

#### 4. Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/v16/users/profile ^
  -H "X-API-KEY: your_api_key_here" ^
  -H "token: YOUR_JWT_TOKEN_HERE" ^
  -H "domain: test.famrut.com" ^
  -H "appname: master_uat"
```

#### 5. Update Profile (Protected)
```bash
curl -X POST http://localhost:3000/api/v16/users/update_profile ^
  -H "X-API-KEY: your_api_key_here" ^
  -H "token: YOUR_JWT_TOKEN_HERE" ^
  -H "domain: test.famrut.com" ^
  -H "appname: master_uat" ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":123,\"first_name\":\"Updated\",\"email\":\"test@example.com\"}"
```

### Using Postman

1. **Import Collection** - Create new collection "Nerace API"

2. **Set Environment Variables**:
   - `base_url`: http://localhost:3000
   - `api_key`: your_api_key_here
   - `domain`: test.famrut.com
   - `appname`: master_uat
   - `token`: (will be set after login)

3. **Create Requests**:

**Register OTP**
- Method: POST
- URL: `{{base_url}}/api/v16/users/register_otp`
- Headers:
  - X-API-KEY: `{{api_key}}`
  - domain: `{{domain}}`
  - appname: `{{appname}}`
  - Content-Type: application/json
- Body (raw JSON):
```json
{
  "phone": "9876543210",
  "first_name": "Test",
  "last_name": "User",
  "btn_submit": "submit"
}
```

**Login OTP**
- Method: POST
- URL: `{{base_url}}/api/v16/users/login_otp`
- Headers: (same as above)
- Body:
```json
{
  "phone": "9876543210",
  "otp": "643215"
}
```
- Tests tab (to save token):
```javascript
pm.environment.set("token", pm.response.headers.get("Authorization"));
```

**Get Profile**
- Method: GET
- URL: `{{base_url}}/api/v16/users/profile`
- Headers:
  - X-API-KEY: `{{api_key}}`
  - token: `{{token}}`
  - domain: `{{domain}}`
  - appname: `{{appname}}`

## Running Automated Tests

```bash
# Run all tests
npm test

# Run only integration tests
npm run test:integration

# Run with coverage
npm test -- --coverage
```

## Test Numbers

**Special test numbers** (no SMS sent, fixed OTP):
- Phone: `9876543210` → OTP: `643215`
- Phone: `9976543210` → OTP: `643215`

**Universal OTP** (works for any number):
- OTP: `888888`

## Common Issues

### 1. "Invalid or missing API key"
- Check X-API-KEY header matches .env API_KEY

### 2. "Database configuration not found"
- Check appname header is set
- Verify database credentials in .env

### 3. "Token required"
- Add token header from login response
- Token format: just the token string (not "Bearer token")

### 4. Port already in use
```bash
# Change PORT in .env
PORT=3001
```

## Database Setup

If database doesn't exist:

```sql
-- Create database
CREATE DATABASE master_uat;

-- Create client table (minimal for testing)
CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  opt_number VARCHAR(6),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100),
  profile_image VARCHAR(255),
  group_id INTEGER,
  app_user_type INTEGER DEFAULT 0,
  active_step INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  is_login BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  login_count INTEGER DEFAULT 0,
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  city_name VARCHAR(100),
  device_id VARCHAR(255),
  loc_addresss TEXT,
  my_refferal_code VARCHAR(50),
  created_on TIMESTAMP DEFAULT NOW(),
  updated_on TIMESTAMP
);
```

## Next Steps

After testing Users API:
1. Verify all 6 endpoints work
2. Check database records created
3. Test with real phone numbers (if SMS configured)
4. Ready to migrate Buyer module
