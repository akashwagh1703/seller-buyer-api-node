# User API Testing Guide

## Prerequisites

1. **Start the Server**
   ```bash
   npm start
   ```
   Server should be running on `http://localhost:3000`

2. **Database Connection**
   - Ensure PostgreSQL is running
   - Database credentials in `.env` are correct
   - Database `seller_buyer` exists and has required tables

3. **Install Dependencies** (if not already done)
   ```bash
   npm install axios
   ```

## Running Tests

### Option 1: Using Batch File (Windows)
```bash
test-users.bat
```

### Option 2: Using Node Directly
```bash
node test-users-api.js
```

### Option 3: Using Swagger UI
Navigate to: `http://localhost:3000/api-docs`

## Test Sequence

The test script will execute the following 13 APIs in order:

### 1. **Check User Registration Status**
- **Endpoint**: `POST /api/v16/users/is_user_regsitered`
- **Purpose**: Check if phone number is already registered
- **Expected**: User not found (first time) or user details (if exists)

### 2. **Register User (Send OTP)**
- **Endpoint**: `POST /api/v16/users/register_otp`
- **Purpose**: Register new user and send OTP
- **Expected**: Returns user_id and OTP (643215 for test number)

### 3. **Verify OTP**
- **Endpoint**: `POST /api/v16/users/verify_otp`
- **Purpose**: Verify the OTP sent during registration
- **Expected**: OTP matched, returns user details

### 4. **Login with OTP**
- **Endpoint**: `POST /api/v16/users/login_otp`
- **Purpose**: Login user with OTP
- **Expected**: Returns JWT token in Authorization header + user data

### 5. **Resend OTP**
- **Endpoint**: `POST /api/v16/users/resend_otp`
- **Purpose**: Resend OTP to user's phone
- **Expected**: New OTP sent (643215 for test number)

### 6. **Get User Profile** (Protected)
- **Endpoint**: `GET /api/v16/users/profile`
- **Purpose**: Get logged-in user's profile
- **Expected**: Returns user profile data
- **Auth**: Requires JWT token from login

### 7. **Update User Profile** (Protected)
- **Endpoint**: `POST /api/v16/users/update_profile`
- **Purpose**: Update user profile information
- **Expected**: Profile updated successfully
- **Auth**: Requires JWT token

### 8. **Get Master Data**
- **Endpoint**: `GET /api/v16/users/master_data`
- **Purpose**: Get all master data constants
- **Expected**: Returns CLIENT_TYPE, PROD_CAT, TRADE_STATUS_LIST, etc.

### 9. **Get About Us**
- **Endpoint**: `GET /api/v16/users/about_us`
- **Purpose**: Get company information
- **Expected**: Returns phone, email, address, about_us text

### 10. **Get Categories**
- **Endpoint**: `GET /api/v16/users/categories`
- **Purpose**: Get all product categories
- **Expected**: Returns list of categories from database

### 11. **Check User Registration (After Registration)**
- **Endpoint**: `POST /api/v16/users/is_user_regsitered`
- **Purpose**: Verify user is now registered
- **Expected**: Returns user details with is_registered: 1

### 12. **Logout User** (Protected)
- **Endpoint**: `GET /api/v16/users/logout_check/:phone`
- **Purpose**: Logout user and clear device_id
- **Expected**: Logout successful
- **Auth**: Requires JWT token

### 13. **Login with Username**
- **Endpoint**: `POST /api/v16/users/login`
- **Purpose**: Alternative login method
- **Expected**: Returns JWT token and user data

## Test Data

### Test Phone Numbers
- **9876543210** - Always returns OTP: `643215`
- **9976543210** - Always returns OTP: `643215`
- **Any other number** - Returns OTP: `888888` (universal OTP)

### Test Headers
```json
{
  "domain": "seller",
  "appname": "seller_buyer",
  "Content-Type": "application/json"
}
```

### Test User Data
```json
{
  "phone": "9876543210",
  "client_type": 2,
  "latitude": "19.9975",
  "longitude": "73.7898",
  "city_name": "Nashik",
  "device_id": "test_device_123"
}
```

## Expected Results

### Success Response Format
```json
{
  "success": 1,
  "error": 0,
  "status": 200,
  "data": { ... },
  "message": "Success_Message"
}
```

### Error Response Format
```json
{
  "success": 0,
  "error": 1,
  "status": 400,
  "data": null,
  "message": "Error_Message"
}
```

## Common Issues & Solutions

### Issue 1: Database Connection Error
**Error**: `ECONNREFUSED 127.0.0.1:5432`
**Solution**: 
- Check if PostgreSQL is running
- Verify DB credentials in `.env`
- Ensure database exists

### Issue 2: JWT Token Not Found
**Error**: `No token provided`
**Solution**: 
- Login first to get token
- Token is captured automatically in test script
- For manual testing, copy token from login response

### Issue 3: User Already Exists
**Error**: `User_Already_Exists`
**Solution**: 
- This is expected if running tests multiple times
- User will be updated instead of created
- Test will continue normally

### Issue 4: Missing Parameters
**Error**: `Missing_Parameter`
**Solution**: 
- Check request body has all required fields
- Verify phone number format (10 digits)

### Issue 5: Invalid OTP
**Error**: `Invalid_Otp`
**Solution**: 
- Use `643215` for test numbers (9876543210, 9976543210)
- Use `888888` for other numbers
- Check if OTP was generated correctly

## Manual Testing with cURL

### 1. Check Registration
```bash
curl -X POST http://localhost:3000/api/v16/users/is_user_regsitered \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\"}"
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/v16/users/register_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"client_type\":2,\"latitude\":\"19.9975\",\"longitude\":\"73.7898\",\"city_name\":\"Nashik\",\"device_id\":\"test_device_123\"}"
```

### 3. Verify OTP
```bash
curl -X POST http://localhost:3000/api/v16/users/verify_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\"}"
```

### 4. Login
```bash
curl -X POST http://localhost:3000/api/v16/users/login_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"otp\":\"643215\",\"latitude\":\"19.9975\",\"longitude\":\"73.7898\",\"city_name\":\"Nashik\",\"device_id\":\"test_device_123\"}"
```

### 5. Get Profile (with token)
```bash
curl -X GET http://localhost:3000/api/v16/users/profile \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Test Results Interpretation

### ✓ All Tests Pass
- All 13 APIs return success responses
- JWT token is captured and used correctly
- User registration, login, and profile operations work
- Database operations are successful

### ✗ Some Tests Fail
- Check error messages in red
- Verify database connection
- Ensure all required tables exist
- Check if server is running

## Database Tables Required

1. **client** - User data
2. **cities_new** - City master
3. **states_new** - State master
4. **categories** - Product categories

## Next Steps After Testing

1. **Fix Database Connection** (if needed)
   - Update `.env` with correct credentials
   - Create missing tables
   - Run migrations if available

2. **Test Trade APIs**
   - Run `test-trade.bat` (to be created)
   - Test product listing, bidding, seller actions

3. **Test Farm/Crop APIs**
   - Test farm CRUD operations
   - Test crop CRUD operations

4. **Integration Testing**
   - Test complete user journey
   - Test seller flow (register → add product → manage bids)
   - Test buyer flow (register → browse → place bid)

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review Swagger documentation at `/api-docs`
- Verify CI3 API behavior for comparison
- Check database query logs

## Test Coverage

- ✅ User Registration Flow
- ✅ OTP Generation & Verification
- ✅ Login/Logout
- ✅ Profile Management
- ✅ Master Data Retrieval
- ✅ JWT Authentication
- ✅ Multi-tenant Database Selection
- ✅ Client Type Detection (Buyer/Seller)
- ✅ Error Handling
- ✅ Response Format Consistency

**Total APIs Tested**: 13/13 User APIs
**Coverage**: 100%
