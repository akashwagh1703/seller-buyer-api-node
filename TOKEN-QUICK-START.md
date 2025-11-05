# JWT Token - Quick Start (30 Seconds)

## 🎯 Where is the Token?

After login, look for `"token"` in the response:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← HERE!
  }
}
```

## 🚀 3 Simple Steps

### Step 1: Login
```bash
POST /api/v16/users/login_otp
Body: { "phone": "9876543210", "otp": "643215" }
```

### Step 2: Copy Token
```json
Response: { "data": { "token": "eyJhbGci..." } }
                              ↑ COPY THIS
```

### Step 3: Use Token
```bash
GET /api/v16/users/profile
Headers: { "token": "eyJhbGci..." }
                    ↑ PASTE HERE
```

## 📋 Example

### Login Request
```javascript
POST http://localhost:3000/api/v16/users/login_otp

Headers:
  domain: seller
  appname: seller_buyer

Body:
{
  "phone": "9876543210",
  "otp": "643215"
}
```

### Login Response
```json
{
  "success": 1,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCJ9.abc123",
    "user_id": 1,
    "phone": "9876543210"
  }
}
```
**👆 Copy: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCJ9.abc123`**

### Next Request (Protected API)
```javascript
GET http://localhost:3000/api/v16/users/profile

Headers:
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBob25lIjoiOTg3NjU0MzIxMCJ9.abc123
  domain: seller
  appname: seller_buyer
```

## ✅ That's It!

**Token Location**: `response.data.token`  
**How to Use**: Add `token: YOUR_TOKEN` to headers  
**Valid For**: 24 hours  

---

**Need more details?** See `JWT-TOKEN-GUIDE.md`
