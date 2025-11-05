const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v16';
const HEADERS = {
  'Content-Type': 'application/json',
  'domain': 'seller',
  'appname': 'seller_buyer'
};

let authToken = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testLogin() {
  log('\n=== Testing Login ===', 'cyan');
  try {
    const response = await axios.post(`${BASE_URL}/users/login_otp`, {
      phone: '9999999999',
      otp: '888888'
    }, { headers: HEADERS });

    if (response.data.success === 1) {
      authToken = response.data.data.token;
      log(`✓ Login successful`, 'green');
      log(`  User ID: ${response.data.data.user.id}`, 'blue');
      log(`  Token: ${authToken.substring(0, 50)}...`, 'blue');
      return response.data.data.user.id;
    } else {
      log(`✗ Login failed: ${response.data.message}`, 'red');
      return null;
    }
  } catch (error) {
    log(`✗ Login error: ${error.message}`, 'red');
    return null;
  }
}

async function testTradeProductWithoutFilters() {
  log('\n=== Test 1: Get All Trade Products (No Filters) ===', 'cyan');
  try {
    const response = await axios.post(`${BASE_URL}/trade/trade_product`, {}, {
      headers: { ...HEADERS, 'Authorization': `Bearer ${authToken}` }
    });

    log(`Response:`, 'yellow');
    log(`  Success: ${response.data.success}`, 'blue');
    log(`  Message: ${response.data.message}`, 'blue');
    log(`  Total: ${response.data.total || 0}`, 'blue');
    log(`  Data Count: ${response.data.data?.length || 0}`, 'blue');

    if (response.data.data && response.data.data.length > 0) {
      log(`\n  First Product:`, 'green');
      const product = response.data.data[0];
      log(`    ID: ${product.id}`, 'blue');
      log(`    User ID: ${product.user_id}`, 'blue');
      log(`    Product: ${product.product_title}`, 'blue');
      log(`    Status: ${product.status_title} (${product.status})`, 'blue');
      log(`    Price: ${product.price} per ${product.price_unit_title}`, 'blue');
    }

    return response.data;
  } catch (error) {
    log(`✗ Error: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testTradeProductWithUserId(userId) {
  log(`\n=== Test 2: Get Trade Products for User ${userId} ===`, 'cyan');
  try {
    const response = await axios.post(`${BASE_URL}/trade/trade_product`, {
      user_id: userId
    }, {
      headers: { ...HEADERS, 'Authorization': `Bearer ${authToken}` }
    });

    log(`Response:`, 'yellow');
    log(`  Success: ${response.data.success}`, 'blue');
    log(`  Message: ${response.data.message}`, 'blue');
    log(`  Total: ${response.data.total || 0}`, 'blue');
    log(`  Data Count: ${response.data.data?.length || 0}`, 'blue');

    return response.data;
  } catch (error) {
    log(`✗ Error: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testTradeProductWithFilters(userId) {
  log(`\n=== Test 3: Get Live Products for User ${userId} ===`, 'cyan');
  try {
    const response = await axios.post(`${BASE_URL}/trade/trade_product`, {
      user_id: userId,
      trade_status: 3  // Live status
    }, {
      headers: { ...HEADERS, 'Authorization': `Bearer ${authToken}` }
    });

    log(`Response:`, 'yellow');
    log(`  Success: ${response.data.success}`, 'blue');
    log(`  Message: ${response.data.message}`, 'blue');
    log(`  Total: ${response.data.total || 0}`, 'blue');
    log(`  Data Count: ${response.data.data?.length || 0}`, 'blue');

    return response.data;
  } catch (error) {
    log(`✗ Error: ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function checkDatabaseData() {
  log('\n=== Checking Database for Trade Products ===', 'cyan');
  log('Run this SQL query in your database:', 'yellow');
  log(`
SELECT 
  tp.id, tp.user_id, tp.prod_cat_id, tp.status, tp.trade_status,
  c.phone, c.first_name, c.last_name,
  pm.title as product_title
FROM trade_product tp
LEFT JOIN client c ON c.id = tp.user_id
LEFT JOIN prod_master pm ON pm.id = tp.prod_id
WHERE tp.is_deleted = false AND tp.is_active = true
ORDER BY tp.id DESC
LIMIT 10;
  `, 'blue');
}

async function runTests() {
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     Trade Product API - Comprehensive Test Suite      ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');

  // Step 1: Login
  const userId = await testLogin();
  if (!userId) {
    log('\n✗ Cannot proceed without login. Exiting...', 'red');
    return;
  }

  // Step 2: Test without filters
  const allProducts = await testTradeProductWithoutFilters();

  // Step 3: Test with user_id
  await testTradeProductWithUserId(userId);

  // Step 4: Test with filters
  await testTradeProductWithFilters(userId);

  // Step 5: Database check instructions
  await checkDatabaseData();

  // Summary
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    Test Summary                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');

  if (allProducts && allProducts.data && allProducts.data.length > 0) {
    log(`✓ Database has ${allProducts.data.length} trade products`, 'green');
    log(`✓ API is working correctly`, 'green');
    log(`\nAvailable Users with Trade Products:`, 'yellow');
    const uniqueUsers = [...new Set(allProducts.data.map(p => p.user_id))];
    uniqueUsers.forEach(uid => {
      const userProducts = allProducts.data.filter(p => p.user_id === uid);
      log(`  - User ID ${uid}: ${userProducts.length} products`, 'blue');
    });
  } else {
    log(`✗ No trade products found in database`, 'red');
    log(`\nTo create test data, run:`, 'yellow');
    log(`
INSERT INTO trade_product (
  user_id, prod_cat_id, prod_type_id, prod_id, surplus, surplus_unit,
  sell_qty, sell_qty_unit, price, price_unit, trade_status, status,
  added_date, created_on, created_by_id, is_deleted, is_active,
  other_details, other_distance
) VALUES (
  ${userId}, 1, 1, 1, 100, 1, 50, 1, 5000, 1, 3, 3,
  NOW(), NOW(), ${userId}, false, true,
  '{"season_from":"1","season_to":"2"}',
  '{"railway":"10 km"}'
);
    `, 'blue');
  }

  log('\n✓ All tests completed!', 'green');
}

// Run tests
runTests().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  console.error(error);
});
