# JWT Token - Simple Guide

## Where is the JWT Token?

After successful login, the JWT token appears in **TWO places**:

### 1. ✅ Response Body (Easy to see)
```json
{
  "success": 1,
  "error": 0,
  "status": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCIsImlhdCI6MTcwNjE4MDQwMCwiZXhwIjoxNzA2MjY2ODAwfQ.abc123xyz",
    "user_id": 1,
    "first_name": "Test",
    "last_name": "User",
    "phone": "9876543210",
    "logged_in": true
  },
  "message": "Login_Successfully"
}
```

### 2. ✅ Response Header
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCIsImlhdCI6MTcwNjE4MDQwMCwiZXhwIjoxNzA2MjY2ODAwfQ.abc123xyz
```

## How to Get the Token?

### Step 1: Login
```bash
POST http://localhost:3000/api/v16/users/login_otp

Headers:
  domain: seller
  appname: seller_buyer
  Content-Type: application/json

Body:
{
  "phone": "9876543210",
  "otp": "643215"
}
```

### Step 2: Copy Token from Response
Look for `"token"` field in the response:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← COPY THIS
  }
}
```

## How to Use the Token?

### Method 1: Using 'token' Header (Recommended)
```bash
GET http://localhost:3000/api/v16/users/profile

Headers:
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  domain: seller
  appname: seller_buyer
```

### Method 2: Using 'Authorization' Header
```bash
GET http://localhost:3000/api/v16/users/profile

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  domain: seller
  appname: seller_buyer
```

## Visual Example with Postman

### 1. Login Request
```
POST http://localhost:3000/api/v16/users/login_otp

Headers Tab:
┌─────────────┬──────────────────┐
│ Key         │ Value            │
├─────────────┼──────────────────┤
│ domain      │ seller           │
│ appname     │ seller_buyer     │
│ Content-Type│ application/json │
└─────────────┴──────────────────┘

Body Tab (raw JSON):
{
  "phone": "9876543210",
  "otp": "643215"
}
```

### 2. Login Response
```json
{
  "success": 1,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCIsImlhdCI6MTcwNjE4MDQwMCwiZXhwIjoxNzA2MjY2ODAwfQ.abc123",
    "user_id": 1,
    "first_name": "Test",
    "phone": "9876543210"
  }
}
```
**👆 Copy the token value**

### 3. Use Token in Next Request
```
GET http://localhost:3000/api/v16/users/profile

Headers Tab:
┌─────────────┬────────────────────────────────────────┐
│ Key         │ Value                                  │
├─────────────┼────────────────────────────────────────┤
│ token       │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...│ ← PASTE HERE
│ domain      │ seller                                 │
│ appname     │ seller_buyer                           │
└─────────────┴────────────────────────────────────────┘
```

## Visual Example with Swagger UI

### 1. Login
1. Go to `http://localhost:3000/api-docs`
2. Find `POST /api/v16/users/login_otp`
3. Click "Try it out"
4. Fill in the body:
   ```json
   {
     "phone": "9876543210",
     "otp": "643215"
   }
   ```
5. Click "Execute"
6. **Copy the token from response**:
   ```json
   {
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← COPY THIS
     }
   }
   ```

### 2. Authorize
1. Click the **"Authorize"** button at the top of Swagger UI
2. In the "BearerAuth" field, paste your token
3. Click "Authorize"
4. Click "Close"

### 3. Use Protected APIs
Now all protected APIs will automatically include your token!

## Code Examples

### JavaScript (Fetch)
```javascript
// 1. Login and get token
const loginResponse = await fetch('http://localhost:3000/api/v16/users/login_otp', {
  method: 'POST',
  headers: {
    'domain': 'seller',
    'appname': 'seller_buyer',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '9876543210',
    otp: '643215'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token; // ← GET TOKEN HERE

console.log('Token:', token);

// 2. Use token in next request
const profileResponse = await fetch('http://localhost:3000/api/v16/users/profile', {
  method: 'GET',
  headers: {
    'domain': 'seller',
    'appname': 'seller_buyer',
    'token': token // ← USE TOKEN HERE
  }
});

const profileData = await profileResponse.json();
console.log('Profile:', profileData);
```

### JavaScript (Axios)
```javascript
// 1. Login and get token
const loginResponse = await axios.post('http://localhost:3000/api/v16/users/login_otp', {
  phone: '9876543210',
  otp: '643215'
}, {
  headers: {
    'domain': 'seller',
    'appname': 'seller_buyer'
  }
});

const token = loginResponse.data.data.token; // ← GET TOKEN HERE

console.log('Token:', token);

// 2. Use token in next request
const profileResponse = await axios.get('http://localhost:3000/api/v16/users/profile', {
  headers: {
    'domain': 'seller',
    'appname': 'seller_buyer',
    'token': token // ← USE TOKEN HERE
  }
});

console.log('Profile:', profileResponse.data);
```

### cURL
```bash
# 1. Login and get token
curl -X POST http://localhost:3000/api/v16/users/login_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"643215"}'

# Response will show:
# {
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
#   }
# }

# 2. Copy token and use in next request
curl -X GET http://localhost:3000/api/v16/users/profile \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Quick Reference

### Login Endpoints (Get Token)
- `POST /api/v16/users/login_otp` - Login with OTP
- `POST /api/v16/users/login` - Login with username/password

### Token Location in Response
```json
{
  "data": {
    "token": "YOUR_JWT_TOKEN_HERE" ← HERE
  }
}
```

### How to Use Token
Add to request headers:
```
token: YOUR_JWT_TOKEN_HERE
```

### Protected APIs (Need Token)
- GET /api/v16/users/profile
- POST /api/v16/users/update_profile
- POST /api/v16/users/resend_otp
- GET /api/v16/users/logout_check/:phone
- GET /api/v16/users/master_data
- GET /api/v16/users/about_us
- GET /api/v16/users/categories

### Public APIs (No Token Needed)
- POST /api/v16/users/register_otp
- POST /api/v16/users/verify_otp
- POST /api/v16/users/login_otp
- POST /api/v16/users/login
- POST /api/v16/users/is_user_regsitered

## Common Issues

### ❌ "No token provided"
**Problem**: You forgot to include the token in headers
**Solution**: Add `token: YOUR_TOKEN` to request headers

### ❌ "Invalid token"
**Problem**: Token is wrong or corrupted
**Solution**: Login again to get a fresh token

### ❌ "Token expired"
**Problem**: Token is older than 24 hours
**Solution**: Login again to get a new token

### ❌ Can't find token in response
**Problem**: Looking in wrong place
**Solution**: Check `response.data.data.token` in JSON response

## Testing Flow

1. ✅ **Login** → Get token from response body
2. ✅ **Copy token** → Save it somewhere
3. ✅ **Add to headers** → Include in next requests
4. ✅ **Call protected APIs** → They will work now!

## Summary

- **Token is in response body**: `data.token`
- **Token is also in header**: `Authorization`
- **Use token in requests**: Add `token: YOUR_TOKEN` to headers
- **Token expires**: After 24 hours, login again
- **7 APIs need token**: profile, update_profile, resend_otp, logout, master_data, about_us, categories
- **6 APIs don't need token**: register_otp, verify_otp, login_otp, login, register, is_user_regsitered

**That's it! Simple as that!** 🎉
