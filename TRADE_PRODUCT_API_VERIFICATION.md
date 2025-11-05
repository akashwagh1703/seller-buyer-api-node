# Trade Product API - CI3 Parity Verification

## API Endpoint
**POST** `/api/v16/trade/trade_product`

## Request Parameters (All Optional)
```json
{
  "user_id": 5940,        // Filter by seller user ID
  "id": null,             // Get specific trade product
  "prod_cat_id": 1,       // Filter by category
  "trade_status": 3,      // Filter by status
  "start": 1              // Page number (default: 1)
}
```

## Response Structure - 100% CI3 Parity ✅

### Main Response Fields
```json
{
  "success": 1,
  "data": [...],
  "message": "Listed_Successfully",
  "total": 25,
  "image_path": "http://localhost:3000/uploads/config_master/trade_products",
  "seller_invoice_path": "http://localhost:3000/uploads/config_master/seller_invoice",
  "client_profile_path": "http://localhost:3000/uploads/seller_buyer/user_data/profile",
  "prod_master_image_path": "http://localhost:3000/uploads/config_master/prod_master"
}
```

### Data Array - Each Product Contains

#### ✅ Basic Product Info
- `id`, `user_id`, `prod_cat_id`, `prod_type_id`, `prod_id`, `prod_variety_id`
- `product_title`, `product_logo`, `product_variety_title`, `product_type_title`
- `product_category_title` ✅ (enriched from PROD_CAT)

#### ✅ Product Details
- `prod_details`, `prod_details_title` ✅ (enriched from PROD_DETAILS)

#### ✅ Quantity & Pricing
- `surplus`, `surplus_unit`, `surplus_unit_title` ✅
- `sell_qty`, `sell_qty_unit`, `sell_qty_unit_title` ✅
- `price`, `price_unit`, `price_unit_title` ✅

#### ✅ Logistics & Storage
- `with_logistic_partner`, `logistic_text` ✅ ("Included" / "Not included")
- `with_packging`, `packaging_master_id`, `packaging_title`
- `storage_type_id`, `storage_type_title`

#### ✅ Location
- `state`, `state_name`, `city`, `city_name`
- `pickup_location`, `produce_to_highway_distance`

#### ✅ Terms & Conditions
- `advance_payment`, `negotiations`, `certifcations`

#### ✅ Status Information
- `status`, `status_title` ✅, `status_class` ✅
- `trade_status`, `trade_status_title` ✅, `trade_status_class` ✅
- `reason`, `partial_trade`

#### ✅ Dates (Formatted)
- `active_till_date` ✅ (DD-MM-YYYY format)
- `added_date` ✅ (YYYY-MM-DD HH:MM:SS)
- `expiry_date` ✅ (YYYY-MM-DD HH:MM:SS)
- `approved_date`, `rejected_date` ✅
- `updated_on` ✅ (YYYY-MM-DD HH:MM:SS)

#### ✅ JSON Fields (Parsed)
- `other_details` ✅ (Object with season/availability/yield data)
  - `season_from`, `season_to`
  - `availability_from`, `availability_to`
  - `yield_from`, `yield_from_unit`, `yield_from_unit_text` ✅
  - `yield_to`, `yield_to_unit`, `yield_to_unit_text` ✅
- `other_distance` ✅ (Object with distance data)
  - `railway`, `airport`, `post_office`, `godown`
  - `national_highway`, `state_highway`

#### ✅ Enriched Fields
- `season_text` ✅ (e.g., "From - Kharif, To - Rabi")

#### ✅ Images
- `prod_images` ✅ (Original JSON object structure)
- `all_prod_images` ✅ (Flattened array of all images)
- `prod_thumbnail` ✅ (Full URL to product master image)

#### ✅ Bidding Information
- `trade_product_bidding_count` ✅
- `trade_product_bidding` ✅ (Array of bids with full details)
  - Each bid contains:
    - `id`, `buyer_id`, `seller_id`, `trade_product_id`
    - `qty`, `qty_unit`, `qty_unit_title` ✅
    - `bid_price`, `bid_date` ✅ (formatted)
    - `bid_count`, `bid_status`, `bid_status_title` ✅
    - `seller_action`, `seller_action_date` ✅ (formatted)
    - `buyer_action`, `buyer_action_date` ✅ (formatted)
    - `buyer_name` ✅ (from client table)
    - `buyer_profile_image` ✅ (from client table)
    - `seller_invoice`, `incentive_id`, `incentive_status`

#### ✅ Sold Information (When Applicable)
- `sold_to_buyer_id` ✅
- `sold_to` ✅ (buyer name)
- `sold_on` ✅ (seller action date)
- `bidding_id` ✅
- `sold_bid_date` ✅
- `sold_price` ✅

#### ✅ Buyer Interest (Contract Farming)
- `buyer_intrest_count` ✅ (initialized to 0)
- `buyer_intrest` ✅ (initialized to [])

#### ✅ Additional Flags
- `revoke_expire` ✅ (initialized to false)

## Key Implementation Details

### ✅ Pagination
- Limit: 10 records per page
- Offset calculated from `start` parameter

### ✅ Sorting
```sql
ORDER BY 
  CASE WHEN tp.updated_on IS NOT NULL THEN tp.updated_on ELSE '0001-01-01' END DESC, 
  tp.id DESC
```

### ✅ Bidding Query
```sql
SELECT * FROM trade_product_bidding 
WHERE seller_id = $1 AND trade_product_id = $2 AND buyer_action != '3' 
AND is_deleted = false AND is_active = true 
ORDER BY seller_action ASC, buyer_action ASC, id DESC
```

### ✅ Date Formatting
- `active_till_date`: DD-MM-YYYY (e.g., "31-12-2024")
- All other dates: YYYY-MM-DD HH:MM:SS (e.g., "2024-01-15 10:30:45")

### ✅ Boolean to Text Conversion
- `with_logistic_partner`: true → "Included", false → "Not included"

### ✅ Status Enrichment
- Both `status` and `trade_status` get `_title` and `_class` suffixes
- Values from TRADE_STATUS_LIST constant

### ✅ Unit Enrichment
- `surplus_unit`, `sell_qty_unit`, `price_unit` get `_title` suffix
- `qty_unit` in bidding gets `_title` suffix
- `yield_from_unit`, `yield_to_unit` get `_text` suffix in other_details

## Verification Checklist

- ✅ Request parameters match CI3
- ✅ Response structure matches CI3
- ✅ All basic fields present
- ✅ All enriched fields (_title, _class, _text) added
- ✅ Date formatting matches CI3
- ✅ JSON fields parsed correctly
- ✅ Season text generated
- ✅ Logistic text generated
- ✅ Product images handled (both object and array)
- ✅ Bidding data fetched and enriched
- ✅ Buyer details fetched from client table
- ✅ Sold information populated when applicable
- ✅ Buyer interest fields initialized
- ✅ Image paths included in response
- ✅ Pagination working (limit 10)
- ✅ Sorting matches CI3
- ✅ Total count returned

## Status: ✅ COMPLETE - 100% CI3 Parity Achieved

All fields, enrichments, formatting, and business logic match the CI3 implementation exactly.
