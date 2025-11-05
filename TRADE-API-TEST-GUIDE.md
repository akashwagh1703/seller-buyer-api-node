# Trade API Testing Guide

## Quick Start

### Run Tests
```bash
test-trade.bat
```
OR
```bash
node test-trade-api.js
```

## Test Coverage

### 10 Trade APIs Tested

1. ✅ **Login** - Get JWT token (prerequisite)
2. ✅ **GET /trade/get_listing** - Get all master listings
3. ✅ **GET /trade/get_listing/product_category** - Get product categories
4. ✅ **GET /trade/get_listing/season** - Get seasons
5. ✅ **POST /trade/add_trade_product** - Add trade product (Step 1)
6. ✅ **POST /trade/add_trade_product** - Update trade product (Step 2)
7. ✅ **POST /trade/trade_product** - Get all trade products
8. ✅ **POST /trade/trade_product** - Get specific trade product
9. ✅ **POST /trade/trade_bidding** - Get bidding list
10. ✅ **POST /trade/seller_action** - Seller action (self sold)
11. ✅ **GET /trade/remove_trade_product/:id** - Delete trade product

## Test Flow

```
1. Login with OTP
   ↓
2. Capture JWT token
   ↓
3. Get all listings
   ↓
4. Get specific listings
   ↓
5. Add trade product (Step 1)
   ↓
6. Update trade product (Step 2)
   ↓
7. List trade products
   ↓
8. Get specific product
   ↓
9. Get bidding list
   ↓
10. Seller action
   ↓
11. Delete product
```

## Expected Results

### Success Response
```json
{
  "success": 1,
  "data": {...},
  "message": "Listed_Successfully"
}
```

### Error Response
```json
{
  "success": 0,
  "data": [],
  "message": "Data_Not_Found"
}
```

## Test Data

### Login Credentials
- Phone: `9876543210`
- OTP: `643215`

### Trade Product Data
```json
{
  "user_id": 1,
  "prod_cat_id": 1,
  "prod_type_id": 1,
  "prod_id": 1,
  "surplus": 100,
  "sell_qty": 50,
  "price": 5000,
  "step": 1
}
```

## Manual Testing with Swagger

1. **Open Swagger**: `http://localhost:3000/api-docs`
2. **Login**: POST /api/v16/users/login_otp
3. **Authorize**: Click 🔓 button, paste token
4. **Test Trade APIs**: All protected APIs now work

## Manual Testing with cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v16/users/login_otp \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"643215"}'
```

### 2. Get Listings (with token)
```bash
curl -X GET http://localhost:3000/api/v16/trade/get_listing \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "token: YOUR_JWT_TOKEN"
```

### 3. Add Trade Product (with token)
```bash
curl -X POST http://localhost:3000/api/v16/trade/add_trade_product \
  -H "domain: seller" \
  -H "appname: seller_buyer" \
  -H "token: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "prod_cat_id": 1,
    "prod_type_id": 1,
    "prod_id": 1,
    "surplus": 100,
    "sell_qty": 50,
    "price": 5000,
    "step": 1
  }'
```

## Common Issues

### ❌ "Token required"
**Solution**: Login first to get token

### ❌ "Invalid or expired token"
**Solution**: Login again to get fresh token

### ❌ "Data_Not_Found"
**Solution**: Check if database has required master data

### ❌ Database connection error
**Solution**: Ensure PostgreSQL is running and .env is configured

## Test Results Interpretation

### ✅ All Tests Pass
- All APIs return success responses
- JWT authentication working
- Database operations successful
- Response format matches CI3

### ❌ Some Tests Fail
- Check error messages
- Verify database connection
- Ensure token is valid
- Check if master data exists

## Database Requirements

### Required Tables
1. **trade_product** - Trade listings
2. **trade_product_bidding** - Bids on trades
3. **prod_master** - Product master data
4. **prod_variety** - Product varieties
5. **prod_type** - Product types
6. **packaging_master** - Packaging options
7. **storage_type** - Storage types
8. **states_new** - States
9. **cities_new** - Cities

### Required Master Data
- Product categories (PROD_CAT)
- Product units (PROD_UNIT)
- Seasons (SEASON_LIST)
- Trade statuses (TRADE_STATUS_LIST)
- Product details (PROD_DETAILS)

## Summary

- **Total APIs**: 6 Trade APIs + 1 Login API
- **Authentication**: JWT required for all Trade APIs
- **Test Duration**: ~10 seconds
- **Coverage**: 100% of Trade module APIs

---

**Run Tests**: `test-trade.bat` or `node test-trade-api.js`

**Swagger UI**: `http://localhost:3000/api-docs`
