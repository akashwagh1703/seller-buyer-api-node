# Users API Migration Status

## ✅ Completed (13 endpoints)

### Authentication & Registration
1. ✅ POST `/api/v16/users/register_otp` - Generate OTP for registration
2. ✅ POST `/api/v16/users/verify_otp` - Verify OTP code
3. ✅ POST `/api/v16/users/login_otp` - Login with OTP
4. ✅ POST `/api/v16/users/resend_otp` - Resend OTP
5. ✅ POST `/api/v16/users/is_user_regsitered` - Check if user exists
6. ✅ POST `/api/v16/users/register` - Register new user
7. ✅ POST `/api/v16/users/login` - Login with password
8. ✅ GET `/api/v16/users/logout_check/:phone` - Logout user

### Profile Management
9. ✅ GET `/api/v16/users/profile` - Get user profile
10. ✅ POST `/api/v16/users/update_profile` - Update profile

### Master Data
11. ✅ GET `/api/v16/users/master_data` - Get constants/enums
12. ✅ GET `/api/v16/users/about_us` - Get about us info
13. ✅ GET `/api/v16/users/categories` - Get categories list

## 🔄 High Priority (Need Migration)

### Farm Management
- POST `/api/v16/users/add_land_details_new` - Add farm details
- POST `/api/v16/users/update_land_details` - Update farm
- GET `/api/v16/users/my_land/:farmer_id` - Get user farms
- GET `/api/v16/users/land_detail/:land_id` - Get farm details
- DELETE `/api/v16/users/delete_land_crop/:land_id` - Delete farm

### Crop Management
- POST `/api/v16/users/add_crop_details` - Add crop
- POST `/api/v16/users/update_crop_details` - Update crop
- DELETE `/api/v16/users/delete_crop_details/:id` - Delete crop
- POST `/api/v16/users/farm_crops` - Get farm crops

### Market Data
- GET `/api/v16/users/nearby_market/:lat/:long` - Get nearby market
- POST `/api/v16/users/nearby_market_all_data_new` - Market data with pagination
- GET `/api/v16/users/markets` - Get all markets
- POST `/api/v16/users/commodity_details_data_new` - Commodity details

### NPK Calculator
- GET `/api/v16/users/crop_npk/:crop_id/:n/:p/:k/:size/:unit` - NPK calculation
- POST `/api/v16/users/crop_npks_details` - NPK details

## 📋 Medium Priority

### Location Data
- POST `/api/v16/users/states` - Get states
- POST `/api/v16/users/city` - Get cities
- GET `/api/v16/users/countries` - Get countries

### Product/Service
- GET `/api/v16/users/all_product_list` - Product listing
- POST `/api/v16/users/all_products_with_pagination` - Products with pagination
- GET `/api/v16/users/products_listing/:limit` - Products
- GET `/api/v16/users/products_details/:id` - Product details

### Orders
- POST `/api/v16/users/add_client_order` - Create order
- POST `/api/v16/users/update_client_order` - Update order
- POST `/api/v16/users/order_list` - Get orders
- GET `/api/v16/users/user_order_details/:order_id` - Order details

### Blogs/Media
- GET `/api/v16/users/all_blogs_details/:type/:start/:crop/:cat` - Blogs
- GET `/api/v16/users/blogs_details/:id` - Blog details
- GET `/api/v16/users/media/:page` - Media listing

## 📊 Low Priority (Can be done later)

### Insurance
- POST `/api/v16/users/add_insurance_data` - Add insurance
- POST `/api/v16/users/list_insurance_data` - List insurance
- GET `/api/v16/users/insured_crops` - Insured crops

### Loan
- POST `/api/v16/users/add_loan_details` - Add loan
- GET `/api/v16/users/my_loan/:farmer_id` - Get loans
- GET `/api/v16/users/loan_types` - Loan types

### Chat/Call
- POST `/api/v16/users/user_chat` - User chat
- POST `/api/v16/users/add_user_chat` - Add chat
- POST `/api/v16/users/connect_call` - Connect call
- POST `/api/v16/users/disconnect_call` - Disconnect call

### Others
- GET `/api/v16/users/advertise` - Advertisements
- GET `/api/v16/users/announcement` - Announcements
- GET `/api/v16/users/notice` - Notices
- POST `/api/v16/users/check_referral_code/:code` - Check referral

## Summary

**Total Endpoints in CI3 Users Controller:** ~200+
**Completed:** 13 (Core authentication & profile)
**High Priority Remaining:** ~25
**Medium Priority:** ~20
**Low Priority:** ~50+

## Next Steps

1. **Immediate:** Complete high-priority farm & crop management APIs
2. **Phase 2:** Market data & NPK calculator
3. **Phase 3:** Location, products, orders
4. **Phase 4:** Insurance, loans, chat/call
5. **Phase 5:** Remaining utility endpoints

## Testing

All completed endpoints are:
- ✅ Documented in Swagger: http://localhost:3000/api-docs
- ✅ Tested with integration tests
- ✅ 100% parity with CI3

**Current Focus:** Core authentication flow is complete and production-ready.
