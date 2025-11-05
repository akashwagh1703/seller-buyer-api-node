# Swagger UI - JWT Authentication Guide

## 🎯 One-Time Setup (No Need to Add Token Repeatedly!)

### Step 1: Login to Get Token
1. Open Swagger UI: `http://localhost:3000/api-docs`
2. Find **POST /api/v16/users/login_otp**
3. Click **"Try it out"**
4. Fill in the request body:
   ```json
   {
     "phone": "9876543210",
     "otp": "643215"
   }
   ```
5. Click **"Execute"**
6. **Copy the token** from response:
   ```json
   {
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← COPY THIS
     }
   }
   ```

### Step 2: Authorize Once (Works for All APIs!)
1. Click the **🔓 Authorize** button at the top of Swagger UI
2. In the **"BearerAuth (http, Bearer)"** section:
   - Paste your token (without "Bearer" prefix)
   - Just paste: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"**
4. Click **"Close"**

### Step 3: Use Any Protected API
Now all protected APIs will automatically include your token! 🎉

- ✅ GET /api/v16/users/profile
- ✅ POST /api/v16/users/update_profile
- ✅ POST /api/v16/users/resend_otp
- ✅ GET /api/v16/users/logout_check/:phone
- ✅ GET /api/v16/users/master_data
- ✅ GET /api/v16/users/about_us
- ✅ GET /api/v16/users/categories

**No need to add token to each API!** It's automatically included in all requests.

## Visual Guide

### Before Authorization
```
🔓 Authorize  ← Click this button
```

### Authorization Dialog
```
┌─────────────────────────────────────────────┐
│ Available authorizations                    │
├─────────────────────────────────────────────┤
│ BearerAuth (http, Bearer)                   │
│                                             │
│ Value: [Paste token here]                  │
│        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│                                             │
│ [Authorize] [Close]                         │
└─────────────────────────────────────────────┘
```

### After Authorization
```
🔒 Authorize  ← Now locked (authorized)
```

All protected APIs now show a 🔒 lock icon, indicating they will use your token automatically!

## Protected APIs (Show 🔒 Icon)

These APIs require authentication and will automatically use your token:

1. 🔒 GET /api/v16/users/profile
2. 🔒 POST /api/v16/users/update_profile
3. 🔒 POST /api/v16/users/resend_otp
4. 🔒 GET /api/v16/users/logout_check/:phone
5. 🔒 GET /api/v16/users/master_data
6. 🔒 GET /api/v16/users/about_us
7. 🔒 GET /api/v16/users/categories

## Public APIs (No 🔒 Icon)

These APIs don't require authentication:

1. POST /api/v16/users/register_otp
2. POST /api/v16/users/verify_otp
3. POST /api/v16/users/login_otp
4. POST /api/v16/users/login
5. POST /api/v16/users/register
6. POST /api/v16/users/is_user_regsitered

## Testing Flow

### 1. Test Public API (No Auth Needed)
```
POST /api/v16/users/is_user_regsitered
↓
Click "Try it out"
↓
Fill body: { "phone": "9876543210" }
↓
Click "Execute"
↓
✅ Works without token
```

### 2. Test Protected API (Auth Required)
```
GET /api/v16/users/profile
↓
Click "Try it out"
↓
Click "Execute"
↓
❌ 401 Unauthorized (if not authorized)
```

### 3. Authorize and Test Again
```
Click 🔓 Authorize button
↓
Paste token
↓
Click "Authorize"
↓
Try GET /api/v16/users/profile again
↓
✅ Works! Token automatically included
```

## Token Expiration

- **Token Valid For**: 24 hours
- **What Happens**: After 24 hours, you'll get 401 Unauthorized
- **Solution**: Login again to get a new token and re-authorize

## Logout

To clear your token from Swagger:
1. Click the 🔒 **Authorize** button
2. Click **"Logout"** next to BearerAuth
3. Click **"Close"**

Now you're logged out and protected APIs will return 401 again.

## Tips

### ✅ DO
- Login first to get token
- Authorize once at the top
- Use all protected APIs without re-entering token
- Re-authorize if token expires

### ❌ DON'T
- Don't add "Bearer" prefix when pasting token
- Don't add token to individual API parameters
- Don't forget to authorize after login

## Common Issues

### Issue: "Token required" error
**Solution**: Click Authorize button and paste your token

### Issue: "Invalid or expired token"
**Solution**: Login again to get a fresh token, then re-authorize

### Issue: Can't find Authorize button
**Solution**: Look at the top-right of Swagger UI page

### Issue: Token not working
**Solution**: 
1. Make sure you copied the full token
2. Don't include "Bearer" prefix
3. Check token hasn't expired (24 hours)

## Summary

1. ✅ Login once → Get token
2. ✅ Authorize once → Paste token
3. ✅ Use all protected APIs → Token auto-included
4. ✅ No need to add token repeatedly!

**That's it! Simple and clean!** 🎉

---

**Swagger UI**: `http://localhost:3000/api-docs`
