# Authentication Changes - JWT Token Required

## Overview
All protected routes now require JWT token authentication. Token is obtained after successful login and must be included in subsequent requests.

## Changes Made

### Protected Routes (Require JWT Token)
The following routes now require JWT authentication:

1. ✅ **GET /api/v16/users/profile** - Get user profile
2. ✅ **POST /api/v16/users/update_profile** - Update user profile
3. ✅ **POST /api/v16/users/resend_otp** - Resend OTP
4. ✅ **GET /api/v16/users/logout_check/:phone** - Logout user
5. ✅ **GET /api/v16/users/master_data** - Get master data
6. ✅ **GET /api/v16/users/about_us** - Get about us
7. ✅ **GET /api/v16/users/categories** - Get categories

### Public Routes (No JWT Required)
These routes remain public for authentication flow:

1. ✅ **POST /api/v16/users/register_otp** - Register and send OTP
2. ✅ **POST /api/v16/users/verify_otp** - Verify OTP
3. ✅ **POST /api/v16/users/login_otp** - Login with OTP (Returns JWT)
4. ✅ **POST /api/v16/users/login** - Login with username/password (Returns JWT)
5. ✅ **POST /api/v16/users/register** - Register user
6. ✅ **POST /api/v16/users/is_user_regsitered** - Check registration status

## How to Use JWT Authentication

### Step 1: Login to Get Token

**Option A: Login with OTP**
```bash
POST /api/v16/users/login_otp
Headers:
  domain: seller
  appname: seller_buyer
Body:
{
  "phone": "9876543210",
  "otp": "643215",
  "latitude": "19.9975",
  "longitude": "73.7898",
  "city_name": "Nashik",
  "device_id": "test_device_123"
}

Response Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Option B: Login with Username**
```bash
POST /api/v16/users/login
Headers:
  domain: seller
  appname: seller_buyer
Body:
{
  "username": "9876543210",
  "password": "test123"
}

Response Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Use Token in Protected Routes

**Method 1: Using 'token' Header (Recommended)**
```bash
GET /api/v16/users/profile
Headers:
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  domain: seller
  appname: seller_buyer
```

**Method 2: Using 'Authorization' Header**
```bash
GET /api/v16/users/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  domain: seller
  appname: seller_buyer
```

## Authentication Flow

```
1. User Registration/Login
   ↓
2. POST /login_otp or /login
   ↓
3. Server Returns JWT Token in Authorization Header
   ↓
4. Client Stores Token (localStorage/sessionStorage)
   ↓
5. Client Includes Token in All Protected Route Requests
   ↓
6. Server Verifies Token
   ↓
7. If Valid: Process Request
   If Invalid: Return 401 Unauthorized
```

## Error Responses

### 401 Unauthorized - No Token
```json
{
  "success": 0,
  "error": 1,
  "status": 401,
  "message": "No token provided"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "success": 0,
  "error": 1,
  "status": 401,
  "message": "Invalid token"
}
```

### 401 Unauthorized - Expired Token
```json
{
  "success": 0,
  "error": 1,
  "status": 401,
  "message": "Token expired"
}
```

## Testing with Swagger UI

1. **Login First**
   - Go to `/api-docs`
   - Execute `POST /api/v16/users/login_otp`
   - Copy the token from response headers

2. **Authorize**
   - Click "Authorize" button at top
   - Paste token in "BearerAuth" field
   - Click "Authorize"

3. **Test Protected Routes**
   - All protected routes will now include the token automatically
   - Token is sent in Authorization header

## Testing with cURL

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/v16/users/login_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"643215"}' \
  -i

# Copy token from Authorization header in response
```

### 2. Use Token in Protected Route
```bash
curl -X GET http://localhost:3000/api/v16/users/profile \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "token: YOUR_JWT_TOKEN_HERE"
```

## Testing with Automated Script

The test script (`test-users-api.js`) has been updated to:
- ✅ Automatically capture JWT token from login response
- ✅ Include token in all protected route requests
- ✅ Handle authentication flow seamlessly

Run tests:
```bash
node test-users-api.js
```

## Frontend Integration

### JavaScript Example
```javascript
// 1. Login and store token
async function login(phone, otp) {
  const response = await fetch('http://localhost:3000/api/v16/users/login_otp', {
    method: 'POST',
    headers: {
      'domain': 'seller',
      'appname': 'seller_buyer',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, otp })
  });
  
  // Get token from response header
  const token = response.headers.get('Authorization');
  
  // Store token
  localStorage.setItem('jwt_token', token);
  
  return await response.json();
}

// 2. Use token in protected requests
async function getProfile() {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('http://localhost:3000/api/v16/users/profile', {
    method: 'GET',
    headers: {
      'domain': 'seller',
      'appname': 'seller_buyer',
      'token': token
    }
  });
  
  return await response.json();
}

// 3. Logout and clear token
async function logout(phone) {
  const token = localStorage.getItem('jwt_token');
  
  await fetch(`http://localhost:3000/api/v16/users/logout_check/${phone}`, {
    method: 'GET',
    headers: {
      'domain': 'seller',
      'appname': 'seller_buyer',
      'token': token
    }
  });
  
  // Clear stored token
  localStorage.removeItem('jwt_token');
}
```

### React Example
```javascript
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v16',
  headers: {
    'domain': 'seller',
    'appname': 'seller_buyer'
  }
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers['token'] = token;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage
const login = async (phone, otp) => {
  const response = await api.post('/users/login_otp', { phone, otp });
  const token = response.headers['authorization'];
  localStorage.setItem('jwt_token', token);
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};
```

## Token Details

### Token Structure
```
Header.Payload.Signature
```

### Payload Contains
```json
{
  "userId": 123,
  "phone": "9876543210",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiration
- Default: 24 hours
- Configurable in `.env`: `JWT_EXPIRES_IN=24h`

## Security Best Practices

1. ✅ **Store Token Securely**
   - Use httpOnly cookies (most secure)
   - Or localStorage/sessionStorage (less secure but easier)
   - Never store in plain text files

2. ✅ **Include Token in Headers**
   - Use 'token' or 'Authorization' header
   - Never include in URL query parameters

3. ✅ **Handle Token Expiration**
   - Implement refresh token mechanism
   - Redirect to login on 401 errors
   - Clear stored token on logout

4. ✅ **HTTPS in Production**
   - Always use HTTPS in production
   - Prevents token interception

5. ✅ **Validate on Server**
   - Server validates every token
   - Checks signature and expiration
   - Verifies user still exists

## Migration Guide

### For Existing Clients

**Before (No Auth)**
```javascript
fetch('/api/v16/users/profile')
```

**After (With Auth)**
```javascript
fetch('/api/v16/users/profile', {
  headers: {
    'token': localStorage.getItem('jwt_token')
  }
})
```

### Update Required
All clients must:
1. Implement login flow to get token
2. Store token after login
3. Include token in protected route requests
4. Handle 401 errors (token expired/invalid)
5. Clear token on logout

## Summary

- ✅ 7 routes now require JWT authentication
- ✅ 6 routes remain public for auth flow
- ✅ Token obtained from login endpoints
- ✅ Token included in 'token' or 'Authorization' header
- ✅ Swagger UI updated with auth requirements
- ✅ Test script updated to handle auth flow
- ✅ 401 errors returned for missing/invalid tokens

**All authentication changes are backward compatible with existing public routes.**
