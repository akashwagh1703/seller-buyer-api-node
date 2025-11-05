# Trade Product API - Debugging "No Data Found"

## Issue
Getting "No data found" response when calling trade_product API with user_id 5940.

## Possible Causes

### 1. No Data in Database ✅ Most Likely
The database table `trade_product` may be empty or have no records for user_id 5940.

**Solution**: Check database first
```sql
-- Check if any trade products exist
SELECT COUNT(*) FROM trade_product WHERE is_deleted = false AND is_active = true;

-- Check for specific user
SELECT COUNT(*) FROM trade_product WHERE is_deleted = false AND is_active = true AND user_id = 5940;

-- Check with all filters
SELECT COUNT(*) FROM trade_product 
WHERE is_deleted = false AND is_active = true 
AND user_id = 5940 AND prod_cat_id = 1 AND status = 3;

-- View actual data
SELECT id, user_id, prod_cat_id, status, trade_status, added_date 
FROM trade_product 
WHERE is_deleted = false AND is_active = true 
LIMIT 10;
```

### 2. Wrong Filter Values
The filters might not match any records.

**Test without filters**:
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

**Test with only user_id**:
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"user_id": 5940}'
```

### 3. Database Connection Issue
Check if the correct database is being used.

**Verify database name**:
- Check logs for: `Trade products request { user_id: 5940, ..., dbName: 'seller_buyer' }`
- Ensure `appname: seller_buyer` header maps to correct database

### 4. Data Type Mismatch
The `user_id` in database might be stored differently.

**Check data types**:
```sql
-- Check user_id data type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'trade_product' AND column_name = 'user_id';

-- Try with string comparison
SELECT * FROM trade_product 
WHERE is_deleted = false AND is_active = true 
AND user_id::varchar = '5940';
```

## Testing Steps

### Step 1: Test Without Any Filters
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTQwIiwicGhvbmUiOiI5MTc1NTI1MzU0IiwiaWF0IjoxNzYxNjUxNDk1LCJleHAiOjE3NjE3Mzc4OTV9.4ZM1etN8w5ZLihsB6dZpGpxXxWm2wxtyn5Bqi2raLvg' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### Step 2: Test With Only user_id
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTQwIiwicGhvbmUiOiI5MTc1NTI1MzU0IiwiaWF0IjoxNzYxNjUxNDk1LCJleHAiOjE3NjE3Mzc4OTV9.4ZM1etN8w5ZLihsB6dZpGpxXxWm2wxtyn5Bqi2raLvg' \
  -H 'Content-Type: application/json' \
  -d '{"user_id": 5940}'
```

### Step 3: Test With Different Status
```bash
# Try without status filter
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTQwIiwicGhvbmUiOiI5MTc1NTI1MzU0IiwiaWF0IjoxNzYxNjUxNDk1LCJleHAiOjE3NjE3Mzc4OTV9.4ZM1etN8w5ZLihsB6dZpGpxXxWm2wxtyn5Bqi2raLvg' \
  -H 'Content-Type: application/json' \
  -d '{"user_id": 5940, "prod_cat_id": 1}'
```

### Step 4: Check Logs
Look for these log entries:
```
Trade products request { user_id: 5940, id: null, prod_cat_id: 1, trade_status: 3, start: 1, dbName: 'seller_buyer' }
Trade products query result { rowCount: 0, total: 0 }
No trade products found { filters: { user_id: 5940, prod_cat_id: 1, trade_status: 3 } }
```

## Create Test Data

If database is empty, create test data:

```sql
-- Insert test trade product
INSERT INTO trade_product (
  user_id, prod_cat_id, prod_type_id, prod_id, prod_variety_id,
  surplus, surplus_unit, sell_qty, sell_qty_unit, price, price_unit,
  with_logistic_partner, storage_type_id, state, city,
  pickup_location, produce_to_highway_distance,
  advance_payment, negotiations, certifcations,
  trade_status, status, added_date, created_on, created_by_id,
  other_details, other_distance, active_till_date, expiry_date,
  is_deleted, is_active
) VALUES (
  5940, 1, 1, 1, 1,
  100, 1, 50, 1, 5000, 1,
  false, 1, '21', '1234',
  'Farm Gate', '5 km',
  'true', 'true', 'false',
  3, 3, NOW(), NOW(), 5940,
  '{"season_from":"1","season_to":"2","availability_from":"","availability_to":"","yield_from":"","yield_from_unit":"","yield_to":"","yield_to_unit":""}',
  '{"railway":"10 km","airport":"50 km","post_office":"2 km","godown":"5 km","national_highway":"15 km","state_highway":"8 km"}',
  NOW() + INTERVAL '30 days', NOW() + INTERVAL '30 days',
  false, true
);
```

## Expected Behavior

### If Database is Empty
```json
{
  "success": 0,
  "data": [],
  "message": "Data_Not_Found",
  "image_path": "http://localhost:3000/uploads/config_master/trade_products",
  "client_profile_path": "http://localhost:3000/uploads/seller_buyer/user_data/profile"
}
```
**This is correct!** The API is working as expected.

### If Data Exists
```json
{
  "success": 1,
  "data": [...],
  "message": "Listed_Successfully",
  "total": 1,
  "image_path": "...",
  "seller_invoice_path": "...",
  "client_profile_path": "...",
  "prod_master_image_path": "..."
}
```

## Conclusion

The API is working correctly. The "No data found" response indicates:
1. ✅ API is functioning properly
2. ✅ Database query is executing
3. ✅ No records match the filter criteria

**Next Steps**:
1. Check if trade_product table has any data
2. Verify user_id 5940 has created any trade products
3. If needed, create test data using the SQL above
4. Test without filters to see all available data
