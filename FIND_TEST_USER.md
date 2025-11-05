# Find User with Trade Products

## SQL Query to Find Users with Trade Products

Run this query in your PostgreSQL database (seller_buyer schema):

```sql
-- Find users who have trade products
SELECT 
  c.id as user_id,
  c.phone,
  c.first_name,
  c.last_name,
  COUNT(tp.id) as product_count,
  STRING_AGG(DISTINCT tp.status::text, ', ') as statuses
FROM client c
INNER JOIN trade_product tp ON tp.user_id = c.id
WHERE tp.is_deleted = false 
  AND tp.is_active = true
  AND c.is_deleted = false
  AND c.is_active = true
  AND c.client_type = 2  -- Seller type
GROUP BY c.id, c.phone, c.first_name, c.last_name
ORDER BY product_count DESC
LIMIT 10;
```

## Get Specific User Details

Once you find a user_id, get their details:

```sql
-- Replace 'USER_ID' with actual user_id from above query
SELECT 
  id,
  phone,
  first_name,
  last_name,
  client_type
FROM client 
WHERE id = USER_ID;
```

## Get User's Trade Products

```sql
-- Replace 'USER_ID' with actual user_id
SELECT 
  id,
  user_id,
  prod_cat_id,
  prod_type_id,
  prod_id,
  status,
  trade_status,
  added_date,
  active_till_date
FROM trade_product
WHERE user_id = USER_ID
  AND is_deleted = false
  AND is_active = true
ORDER BY added_date DESC;
```

## Test Credentials Format

After finding a user with trade products, use these credentials:

### Step 1: Login to Get Token
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/users/login_otp' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -d '{
    "phone": "PHONE_FROM_QUERY",
    "otp": "643215"
  }'
```

### Step 2: Use Token to Get Trade Products
```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer TOKEN_FROM_LOGIN' \
  -d '{
    "user_id": USER_ID_FROM_QUERY
  }'
```

## Alternative: Create Test User with Trade Product

If no users have trade products, create test data:

```sql
-- Step 1: Find or create a test seller user
INSERT INTO client (
  phone, first_name, last_name, client_type, 
  is_active, is_deleted, active_step, created_on
) VALUES (
  '9999999999', 'Test', 'Seller', 2,
  true, false, 3, NOW()
) 
ON CONFLICT (phone) DO UPDATE SET is_active = true
RETURNING id;

-- Step 2: Insert test trade product (use user_id from above)
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
  (SELECT id FROM client WHERE phone = '9999999999'),  -- user_id
  1, 1, 1, 1,  -- prod_cat_id, prod_type_id, prod_id, prod_variety_id
  100, 1, 50, 1, 5000, 1,  -- surplus, units, qty, price
  false, 1, '21', '1234',  -- logistics, storage, location
  'Farm Gate', '5 km',  -- pickup, distance
  'true', 'true', 'false',  -- payment, negotiations, certifications
  3, 3, NOW(), NOW(), (SELECT id FROM client WHERE phone = '9999999999'),  -- status, dates
  '{"season_from":"1","season_to":"2","availability_from":"","availability_to":"","yield_from":"","yield_from_unit":"","yield_to":"","yield_to_unit":""}',
  '{"railway":"10 km","airport":"50 km","post_office":"2 km","godown":"5 km","national_highway":"15 km","state_highway":"8 km"}',
  NOW() + INTERVAL '30 days', NOW() + INTERVAL '30 days',  -- expiry dates
  false, true  -- is_deleted, is_active
);
```

## Test with Created User

```bash
# Step 1: Login
curl -X 'POST' \
  'http://localhost:3000/api/v16/users/login_otp' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -d '{
    "phone": "9999999999",
    "otp": "888888"
  }'

# Step 2: Get Trade Products (use token from login response)
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{
    "user_id": <USER_ID_FROM_QUERY>
  }'
```

## Quick Test Without Filters

To see ALL trade products in the database:

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <ANY_VALID_TOKEN>' \
  -d '{}'
```

This will return all trade products regardless of user_id, helping you identify which users have data.
