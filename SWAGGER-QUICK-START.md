# Swagger - Quick Start (3 Steps)

## 🚀 Use JWT Token Once for All APIs

### Step 1: Login
```
POST /api/v16/users/login_otp
Body: { "phone": "9876543210", "otp": "643215" }
Execute → Copy token from response
```

### Step 2: Authorize (One Time!)
```
Click 🔓 Authorize button (top-right)
Paste token → Click Authorize → Close
```

### Step 3: Use Any Protected API
```
All protected APIs now work automatically! 🎉
No need to add token again!
```

## Visual Flow

```
┌─────────────────────────────────────────┐
│  1. Login                               │
│  POST /api/v16/users/login_otp          │
│  → Get token                            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Click 🔓 Authorize (top-right)      │
│  → Paste token                          │
│  → Click Authorize                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. Use Protected APIs                  │
│  ✅ GET /profile                        │
│  ✅ POST /update_profile                │
│  ✅ GET /master_data                    │
│  ✅ GET /about_us                       │
│  ✅ GET /categories                     │
│  → Token auto-included! 🎉              │
└─────────────────────────────────────────┘
```

## Before vs After

### ❌ Before (Wrong Way)
```
For each API:
1. Add token parameter
2. Paste token
3. Execute
4. Repeat for next API... 😫
```

### ✅ After (Correct Way)
```
One time:
1. Click Authorize
2. Paste token
3. All APIs work! 😊
```

## Protected APIs (Need Token)
- 🔒 GET /api/v16/users/profile
- 🔒 POST /api/v16/users/update_profile
- 🔒 POST /api/v16/users/resend_otp
- 🔒 GET /api/v16/users/logout_check/:phone
- 🔒 GET /api/v16/users/master_data
- 🔒 GET /api/v16/users/about_us
- 🔒 GET /api/v16/users/categories

## Public APIs (No Token)
- POST /api/v16/users/register_otp
- POST /api/v16/users/verify_otp
- POST /api/v16/users/login_otp
- POST /api/v16/users/login
- POST /api/v16/users/is_user_regsitered

---

**Swagger UI**: http://localhost:3000/api-docs

**Full Guide**: See `SWAGGER-AUTH-GUIDE.md`
