# API Testing Summary

## Quick Start

### 1. Start Server
```bash
npm start
```

### 2. Run User API Tests
```bash
test-users.bat
```
OR
```bash
node test-users-api.js
```

### 3. View Swagger Documentation
Open browser: `http://localhost:3000/api-docs`

## Test Files Created

1. **test-users-api.js** - Automated test script for all 13 user APIs
2. **test-users.bat** - Windows batch file to run tests
3. **USER-API-TEST-GUIDE.md** - Comprehensive testing guide

## APIs Available for Testing

### User APIs (13 APIs) ✅
1. POST /api/v16/users/is_user_regsitered
2. POST /api/v16/users/register_otp
3. POST /api/v16/users/verify_otp
4. POST /api/v16/users/login_otp
5. POST /api/v16/users/resend_otp
6. GET /api/v16/users/profile (Protected)
7. POST /api/v16/users/update_profile (Protected)
8. GET /api/v16/users/master_data
9. GET /api/v16/users/about_us
10. GET /api/v16/users/categories
11. GET /api/v16/users/logout_check/:phone (Protected)
12. POST /api/v16/users/login
13. POST /api/v16/users/register

### Farm/Crop APIs (9 APIs) ✅
1. POST /api/v16/users/add_farm
2. POST /api/v16/users/update_farm
3. POST /api/v16/users/get_farm
4. GET /api/v16/users/delete_farm/:id
5. POST /api/v16/users/get_farm_by_user
6. POST /api/v16/users/add_crop
7. POST /api/v16/users/update_crop
8. POST /api/v16/users/get_crop
9. GET /api/v16/users/delete_crop/:id

### Trade APIs (6 APIs) ✅
1. GET /api/v16/trade/get_listing/:listing_name?
2. POST /api/v16/trade/add_trade_product
3. POST /api/v16/trade/trade_product
4. GET /api/v16/trade/remove_trade_product/:id
5. POST /api/v16/trade/trade_bidding
6. POST /api/v16/trade/seller_action

**Total APIs Migrated: 28**

## Test Data

### Test Phone Numbers
- **9876543210** → OTP: `643215`
- **9976543210** → OTP: `643215`
- **Others** → OTP: `888888`

### Default Headers
```json
{
  "domain": "seller",
  "appname": "seller_buyer"
}
```

## Expected Test Flow

1. ✅ Check if user exists
2. ✅ Register user (get OTP)
3. ✅ Verify OTP
4. ✅ Login with OTP (get JWT token)
5. ✅ Resend OTP
6. ✅ Get profile (with token)
7. ✅ Update profile (with token)
8. ✅ Get master data
9. ✅ Get about us
10. ✅ Get categories
11. ✅ Check registration again
12. ✅ Logout
13. ✅ Login with username

## Color-Coded Output

- 🟦 **BLUE** - Test name and request details
- 🟨 **YELLOW** - Important information (tokens, IDs)
- 🟢 **GREEN** - Success responses
- 🔴 **RED** - Error responses

## Common Test Results

### ✓ Success Scenario
```
✓ SUCCESS
Status: 200
Response: {
  "success": 1,
  "error": 0,
  "status": 200,
  "data": {...},
  "message": "Success_Message"
}
```

### ✗ Error Scenario
```
✗ FAILED
Status: 400
Error: {
  "success": 0,
  "error": 1,
  "status": 400,
  "message": "Error_Message"
}
```

## Troubleshooting

### Server Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:3000
Solution: Run 'npm start' first
```

### Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:5432
Solution: Check PostgreSQL is running and .env credentials
```

### JWT Token Missing
```
Error: No token provided
Solution: Login first, token is auto-captured in test script
```

## Manual Testing Alternative

Use Swagger UI at `http://localhost:3000/api-docs`:
- All endpoints documented
- Try it out feature
- Default values pre-filled
- Response schemas shown

## Next Steps

1. ✅ Fix any database connection issues
2. ✅ Verify all 13 user APIs pass
3. ⏳ Test farm/crop APIs
4. ⏳ Test trade APIs
5. ⏳ Integration testing
6. ⏳ Performance testing

## Files to Review

- `logs/combined.log` - All request logs
- `logs/error.log` - Error logs only
- `.env` - Database configuration
- `src/config/database.js` - Database connection

## Support

- Check `USER-API-TEST-GUIDE.md` for detailed guide
- Review Swagger docs at `/api-docs`
- Check logs in `logs/` directory
- Compare with CI3 API responses

---

**Ready to Test!** 🚀

Run `test-users.bat` or `node test-users-api.js` to begin.
