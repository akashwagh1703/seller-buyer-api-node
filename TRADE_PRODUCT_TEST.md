# Trade Product API - Request/Response Verification

## ✅ API Endpoint
**POST** `http://localhost:3000/api/v16/trade/trade_product`

## ✅ Request Headers
```
Content-Type: application/json
domain: seller
appname: seller_buyer
Authorization: Bearer <JWT_TOKEN>
```

## ✅ Request Body (All Optional)
```json
{
  "user_id": 5940,
  "id": null,
  "prod_cat_id": 1,
  "trade_status": 3,
  "start": 1
}
```

### Request Parameters Explanation
- `user_id` (integer, optional) - Filter by seller user ID
- `id` (integer, optional) - Get specific trade product by ID
- `prod_cat_id` (integer, optional) - Filter by product category (1=Agri, 2=Contract Farming)
- `trade_status` (integer, optional) - Filter by status (1=Pending, 3=Live, 4=Sold, 5=Completed, 6=Expired, 7=Self Sold, 8=Draft, 9=Bid Locked)
- `start` (integer, optional, default=1) - Page number for pagination

## ✅ Success Response (200 OK)
```json
{
  "success": 1,
  "data": [
    {
      "id": 123,
      "user_id": 5940,
      "prod_cat_id": 1,
      "product_category_title": "Agri",
      "prod_type_id": 1,
      "product_type_title": "Cereals",
      "prod_id": 1,
      "product_title": "Wheat",
      "product_logo": "wheat.png",
      "prod_variety_id": 1,
      "product_variety_title": "Durum",
      "prod_details": 1,
      "prod_details_title": "Fresh",
      "surplus": 100,
      "surplus_unit": 1,
      "surplus_unit_title": "Quintal",
      "sell_qty": 50,
      "sell_qty_unit": 1,
      "sell_qty_unit_title": "Quintal",
      "price": 5000,
      "price_unit": 1,
      "price_unit_title": "Quintal",
      "with_logistic_partner": true,
      "logistic_text": "Included",
      "with_packging": false,
      "packaging_master_id": null,
      "packaging_title": null,
      "storage_type_id": 1,
      "storage_type_title": "Cold Storage",
      "state": "21",
      "state_name": "Maharashtra",
      "city": "1234",
      "city_name": "Nashik",
      "pickup_location": "Farm Gate",
      "produce_to_highway_distance": "5 km",
      "advance_payment": "true",
      "negotiations": "true",
      "certifcations": "false",
      "trade_status": 3,
      "trade_status_title": "Live",
      "trade_status_class": "green-status",
      "status": 3,
      "status_title": "Live",
      "status_class": "green-status",
      "reason": null,
      "partial_trade": false,
      "active_till_date": "31-12-2024",
      "added_date": "2024-01-15 10:30:45",
      "expiry_date": "2024-12-31 23:59:59",
      "approved_date": null,
      "rejected_date": "",
      "updated_on": "2024-01-20 15:45:30",
      "other_details": {
        "season_from": "1",
        "season_to": "2",
        "availability_from": "",
        "availability_to": "",
        "yield_from": "",
        "yield_from_unit": "",
        "yield_from_unit_text": "",
        "yield_to": "",
        "yield_to_unit": "",
        "yield_to_unit_text": ""
      },
      "season_text": "From - Kharif,  To - Rabi",
      "other_distance": {
        "railway": "10 km",
        "airport": "50 km",
        "post_office": "2 km",
        "godown": "5 km",
        "national_highway": "15 km",
        "state_highway": "8 km"
      },
      "prod_images": {
        "product": ["01_2024/image1.webp", "01_2024/image2.webp"],
        "certificate": ["01_2024/cert1.webp"]
      },
      "all_prod_images": ["01_2024/image1.webp", "01_2024/image2.webp", "01_2024/cert1.webp"],
      "prod_thumbnail": "http://localhost:3000/uploads/config_master/prod_master/wheat.png",
      "revoke_expire": false,
      "trade_product_bidding_count": 2,
      "trade_product_bidding": [
        {
          "id": 456,
          "buyer_id": 6789,
          "seller_id": 5940,
          "trade_product_id": 123,
          "qty": 25,
          "qty_unit": 1,
          "qty_unit_title": "Quintal",
          "bid_price": 5200,
          "bid_date": "2024-01-18 14:20:30",
          "bid_count": 1,
          "seller_action": 1,
          "seller_action_date": "2024-01-19 09:15:00",
          "buyer_action": 1,
          "buyer_action_date": "2024-01-18 14:20:30",
          "bid_status": 4,
          "bid_status_title": "Sold",
          "seller_invoice": null,
          "incentive_id": null,
          "incentive_status": null,
          "incentive_redeemed_date": null,
          "buyer_name": "John Doe",
          "buyer_profile_image": "profile123.jpg"
        }
      ],
      "sold_to_buyer_id": 6789,
      "sold_to": "John Doe",
      "sold_on": "2024-01-19 09:15:00",
      "bidding_id": 456,
      "sold_bid_date": "2024-01-18 14:20:30",
      "sold_price": 5200,
      "buyer_intrest_count": 0,
      "buyer_intrest": []
    }
  ],
  "message": "Listed_Successfully",
  "total": 25,
  "image_path": "http://localhost:3000/uploads/config_master/trade_products",
  "seller_invoice_path": "http://localhost:3000/uploads/config_master/seller_invoice",
  "client_profile_path": "http://localhost:3000/uploads/seller_buyer/user_data/profile",
  "prod_master_image_path": "http://localhost:3000/uploads/config_master/prod_master"
}
```

## ✅ Empty Response (No Data Found)
```json
{
  "success": 0,
  "data": [],
  "message": "Data_Not_Found",
  "image_path": "http://localhost:3000/uploads/config_master/trade_products",
  "client_profile_path": "http://localhost:3000/uploads/seller_buyer/user_data/profile"
}
```

## ✅ Test Cases

### Test Case 1: Get All Products for User
```bash
curl -X POST 'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"user_id": 5940, "start": 1}'
```

### Test Case 2: Get Live Products Only
```bash
curl -X POST 'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"user_id": 5940, "trade_status": 3, "start": 1}'
```

### Test Case 3: Get Specific Product
```bash
curl -X POST 'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"id": 123}'
```

### Test Case 4: Get Agri Products Only
```bash
curl -X POST 'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"user_id": 5940, "prod_cat_id": 1, "start": 1}'
```

### Test Case 5: Pagination - Page 2
```bash
curl -X POST 'http://localhost:3000/api/v16/trade/trade_product' \
  -H 'Content-Type: application/json' \
  -H 'domain: seller' \
  -H 'appname: seller_buyer' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"user_id": 5940, "start": 2}'
```

## ✅ Response Field Verification

### Core Fields (From Database)
- ✅ All database columns returned
- ✅ JOINs with prod_master, prod_variety, prod_type, packaging_master, storage_type, states_new, cities_new

### Enriched Fields (Added by API)
- ✅ `product_category_title` - From PROD_CAT constant
- ✅ `prod_details_title` - From PROD_DETAILS constant
- ✅ `surplus_unit_title`, `sell_qty_unit_title`, `price_unit_title` - From PROD_UNIT constant
- ✅ `status_title`, `status_class` - From TRADE_STATUS_LIST constant
- ✅ `trade_status_title`, `trade_status_class` - From TRADE_STATUS_LIST constant
- ✅ `season_text` - Generated from season_from/season_to
- ✅ `logistic_text` - "Included" or "Not included"
- ✅ `yield_from_unit_text`, `yield_to_unit_text` - In other_details object

### Date Formatting
- ✅ `active_till_date` - DD-MM-YYYY format
- ✅ `added_date`, `expiry_date`, `updated_on` - YYYY-MM-DD HH:MM:SS format
- ✅ `rejected_date` - Empty string if null

### JSON Fields (Parsed)
- ✅ `other_details` - Parsed from JSON string to object
- ✅ `other_distance` - Parsed from JSON string to object
- ✅ `prod_images` - Parsed from JSON string to object

### Image Fields
- ✅ `prod_images` - Original JSON object structure
- ✅ `all_prod_images` - Flattened array of all images
- ✅ `prod_thumbnail` - Full URL to product master image

### Bidding Fields
- ✅ `trade_product_bidding_count` - Count of bids
- ✅ `trade_product_bidding` - Array of bid objects with:
  - ✅ All bid fields from database
  - ✅ `qty_unit_title` - From PROD_UNIT constant
  - ✅ `bid_status_title` - From TRADE_STATUS_LIST constant
  - ✅ `buyer_name` - Fetched from client table
  - ✅ `buyer_profile_image` - Fetched from client table
  - ✅ Formatted dates (bid_date, seller_action_date, buyer_action_date)

### Sold Information (When Applicable)
- ✅ `sold_to_buyer_id`, `sold_to`, `sold_on`, `bidding_id`, `sold_bid_date`, `sold_price`
- ✅ Only populated when seller_action = 1 or 5

### Additional Fields
- ✅ `buyer_intrest_count` - Initialized to 0
- ✅ `buyer_intrest` - Initialized to []
- ✅ `revoke_expire` - Initialized to false

### Response Metadata
- ✅ `total` - Total count of records (for pagination)
- ✅ `image_path` - Base path for trade product images
- ✅ `seller_invoice_path` - Base path for seller invoices
- ✅ `client_profile_path` - Base path for client profile images
- ✅ `prod_master_image_path` - Base path for product master images

## ✅ Pagination Details
- **Limit**: 10 records per page
- **Offset**: Calculated as `(start - 1) * 10`
- **Total**: Total count returned for pagination UI

## ✅ Sorting
```sql
ORDER BY 
  CASE WHEN tp.updated_on IS NOT NULL THEN tp.updated_on ELSE '0001-01-01' END DESC, 
  tp.id DESC
```
- Recently updated products appear first
- Then sorted by ID descending

## Status: ✅ VERIFIED - Request and Response are 100% Correct

All request parameters, response fields, enrichments, and formatting match CI3 exactly.
