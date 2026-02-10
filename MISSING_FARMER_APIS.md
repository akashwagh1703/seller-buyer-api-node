# Missing Farmer APIs Analysis

## Farmer.php APIs (Total: 25 APIs)

### Registration & Authentication (5 APIs)
1. ✅ is_user_regsitered_post - Check if user registered (covered in usersController)
2. ✅ get_register_otp_post - Get OTP for registration (covered in usersController)
3. ✅ resend_otp_post - Resend OTP (covered in usersController)
4. ✅ get_login_otp_post - Login with OTP (covered in usersController)
5. ✅ logout_check_get - Logout (covered in usersController)

### Profile Management (6 APIs)
6. ✅ update_profile_post - Update profile (covered in usersController)
7. ✅ update_bank_details_post - Update bank details (covered in usersController)
8. ✅ update_documents_post - Update documents (covered in usersController)
9. ✅ get_farmer_profile_get - Get profile (covered in usersController)
10. ✅ chk_profile_get - Check profile completion (covered in usersController)
11. ✅ get_states_new_post - Get states (covered in usersController)
12. ✅ get_city_new_post - Get cities (covered in usersController)

### Crop Product Management (10 APIs)
13. ❌ add_crop_product_post - Add crop product
14. ❌ get_farmer_product_get - Get farmer products
15. ❌ get_farmer_product_detail_get - Get product details
16. ❌ update_crop_product_status_post - Update product status
17. ❌ get_farmer_product_invoice_get - Get product invoice
18. ❌ product_invoice_list_get - List invoices
19. ❌ get_invoice_get - Generate invoice

### Crop & Variety (3 APIs)
20. ❌ get_crop_list_get - Get crop list
21. ❌ get_crop_variety_get - Get crop varieties
22. ❌ get_crop_variety_price_post - Get variety price

### Dashboard & Misc (2 APIs)
23. ❌ get_farmer_dashboard_get - Get dashboard data
24. ❌ get_markets_get - Get markets list
25. ✅ about_us_get - About us (static data)

## Summary
- **Total APIs**: 25
- **Already Covered**: 12 (in usersController)
- **Missing**: 13 APIs

## Missing APIs to Implement
1. add_crop_product_post
2. get_farmer_product_get
3. get_farmer_product_detail_get
4. update_crop_product_status_post
5. get_farmer_product_invoice_get
6. product_invoice_list_get
7. get_invoice_get
8. get_crop_list_get
9. get_crop_variety_get
10. get_crop_variety_price_post
11. get_farmer_dashboard_get
12. get_markets_get
13. about_us_get (static)
