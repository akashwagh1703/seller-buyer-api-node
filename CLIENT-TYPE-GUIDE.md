# Client Type Guide - Buyer vs Seller

## How Client Type is Determined

Client type is automatically set based on the **domain** header in every request.

### Domain → Client Type Mapping

| Domain | Client Type | Value | Database |
|--------|-------------|-------|----------|
| `buyer.famrut.com` | Buyer | 1 | famrut_live_new_ae |
| `seller.famrut.com` | Seller | 2 | famrut_live_new_ae |
| `uat-buyer.famrut.com` | Buyer | 1 | master_uat |
| `uat-seller.famrut.com` | Seller | 2 | master_uat |
| `test.famrut.com` | Seller (default) | 2 | master_uat |

## Available in Request Object

After `dbSelector` middleware runs, every request has:

```javascript
req.clientType  // 1 = Buyer, 2 = Seller
req.isBuyer     // true if buyer
req.isSeller    // true if seller
req.domain      // Original domain header
req.dbName      // Selected database name
```

## Usage in Controllers

### Example 1: Restrict endpoint to buyers only
```javascript
const getBuyerData = async (req, res) => {
  if (!req.isBuyer) {
    return sendError(res, 'Buyer_Only_Endpoint', 403);
  }
  
  // Buyer-specific logic
  const data = await buyerService.getData(req.dbName);
  sendSuccess(res, data, 'Success');
};
```

### Example 2: Different logic for buyer vs seller
```javascript
const getProducts = async (req, res) => {
  let products;
  
  if (req.isBuyer) {
    // Buyer sees trade products
    products = await productService.getTradeProducts(req.dbName);
  } else {
    // Seller sees their own products
    products = await productService.getSellerProducts(req.dbName, req.user.userId);
  }
  
  sendSuccess(res, products, 'Products_Retrieved');
};
```

### Example 3: Save client type in database
```javascript
const registerUser = async (req, res) => {
  const userData = {
    ...req.body,
    client_type: req.clientType, // Automatically set from domain
    phone: req.body.phone
  };
  
  const user = await usersModel.createUser(req.dbName, userData);
  sendSuccess(res, user, 'User_Created');
};
```

## Testing Different Client Types

### Buyer Request
```bash
curl -X POST http://localhost:3000/api/v16/users/register_otp \
  -H "X-API-KEY: test_api_key_12345" \
  -H "domain: buyer.famrut.com" \
  -H "appname: master_uat" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","first_name":"Buyer","last_name":"User","btn_submit":"submit"}'
```
Result: `req.clientType = 1`, `req.isBuyer = true`

### Seller Request
```bash
curl -X POST http://localhost:3000/api/v16/users/register_otp \
  -H "X-API-KEY: test_api_key_12345" \
  -H "domain: seller.famrut.com" \
  -H "appname: master_uat" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","first_name":"Seller","last_name":"User","btn_submit":"submit"}'
```
Result: `req.clientType = 2`, `req.isSeller = true`

## Swagger Testing

In Swagger UI:
1. Click any endpoint
2. Click "Try it out"
3. Set **domain** parameter:
   - For Buyer: `buyer.famrut.com` or `uat-buyer.famrut.com`
   - For Seller: `seller.famrut.com` or `uat-seller.famrut.com`

## Creating Client-Specific Routes

### Option 1: Separate route files
```javascript
// src/routes/buyer.js - Buyer-only endpoints
router.post('/trade_products', buyerController.getTradeProducts);

// src/routes/seller.js - Seller-only endpoints  
router.post('/my_products', sellerController.getMyProducts);
```

### Option 2: Middleware guard
```javascript
// src/middleware/clientTypeGuard.js
const requireBuyer = (req, res, next) => {
  if (!req.isBuyer) {
    return res.status(403).json({
      success: false,
      error: true,
      status: 403,
      message: 'Buyer_Access_Only'
    });
  }
  next();
};

const requireSeller = (req, res, next) => {
  if (!req.isSeller) {
    return res.status(403).json({
      success: false,
      error: true,
      status: 403,
      message: 'Seller_Access_Only'
    });
  }
  next();
};

module.exports = { requireBuyer, requireSeller };
```

Usage:
```javascript
const { requireBuyer } = require('../middleware/clientTypeGuard');

router.post('/trade_products', requireBuyer, buyerController.getTradeProducts);
```

## Database Schema

The `client` table stores client_type:
```sql
CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20),
  client_type INTEGER DEFAULT 2, -- 1=Buyer, 2=Seller
  -- other fields...
);
```

## Constants

Defined in `src/config/constants.js`:
```javascript
CLIENT_TYPE: {
  BUYER: 1,
  SELLER: 2
}
```

## Summary

✅ Client type is **automatically determined** from domain header
✅ Available in every request as `req.clientType`, `req.isBuyer`, `req.isSeller`
✅ No need to pass client_type in request body
✅ Use domain header to control buyer vs seller behavior
✅ Can create separate routes or use guards for client-specific endpoints
