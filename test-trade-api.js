const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v16';
const headers = {
  'domain': 'seller',
  'appname': 'seller_buyer',
  'Content-Type': 'application/json'
};

let authToken = '';
let tradeProductId = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(name, method, url, data = null, useAuth = true) {
  try {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`Testing: ${name}`, 'yellow');
    log(`${method} ${url}`, 'blue');
    
    const config = { headers: { ...headers } };
    if (useAuth && authToken) {
      config.headers['token'] = authToken;
    }
    
    let response;
    if (method === 'GET') {
      response = await axios.get(url, config);
    } else if (method === 'POST') {
      log(`Request Body: ${JSON.stringify(data, null, 2)}`, 'blue');
      response = await axios.post(url, data, config);
    }
    
    log(`✓ SUCCESS`, 'green');
    log(`Status: ${response.status}`, 'green');
    log(`Response: ${JSON.stringify(response.data, null, 2)}`, 'green');
    
    return response.data;
  } catch (error) {
    log(`✗ FAILED`, 'red');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    } else {
      log(`Error: ${error.message}`, 'red');
    }
    return null;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('STARTING TRADE API TESTS', 'yellow');
  log('='.repeat(60) + '\n', 'blue');

  // Step 1: Login first to get token
  log('Step 1: Login to get JWT token', 'yellow');
  const loginResult = await testAPI(
    'Login with OTP',
    'POST',
    `${BASE_URL}/users/login_otp`,
    {
      phone: '9876543210',
      otp: '643215',
      latitude: '19.9975',
      longitude: '73.7898',
      city_name: 'Nashik',
      device_id: 'test_device_123'
    },
    false
  );

  if (loginResult && loginResult.data && loginResult.data.token) {
    authToken = loginResult.data.token;
    log(`\n✓ Token captured: ${authToken.substring(0, 50)}...`, 'green');
  } else {
    log('\n✗ Failed to get token. Cannot proceed with tests.', 'red');
    return;
  }

  // Test 1: Get all listings
  await testAPI(
    '1. Get All Listings',
    'GET',
    `${BASE_URL}/trade/get_listing`
  );

  // Test 2: Get specific listing (product_category)
  await testAPI(
    '2. Get Product Category Listing',
    'GET',
    `${BASE_URL}/trade/get_listing/product_category`
  );

  // Test 3: Get season listing
  await testAPI(
    '3. Get Season Listing',
    'GET',
    `${BASE_URL}/trade/get_listing/season`
  );

  // Test 4: Add trade product (Step 1)
  const addProductResult = await testAPI(
    '4. Add Trade Product (Step 1)',
    'POST',
    `${BASE_URL}/trade/add_trade_product`,
    {
      user_id: 1,
      prod_cat_id: 1,
      prod_type_id: 1,
      prod_id: 1,
      prod_variety_id: 1,
      surplus: 100,
      surplus_unit: 2,
      sell_qty: 50,
      sell_qty_unit: 2,
      price: 5000,
      price_unit: 2,
      with_logistic_partner: 'false',
      storage_type_id: 1,
      state: '1',
      city: '1',
      pickup_location: 'Test Location',
      produce_to_highway_distance: '5 km',
      advance_payment: 'true',
      negotiations: 'true',
      certifcations: 'false',
      step: 1,
      season_from: 1,
      season_to: 2,
      active_till_date: '2024-12-31'
    }
  );

  if (addProductResult && addProductResult.data) {
    tradeProductId = addProductResult.data;
    log(`\n✓ Trade Product ID captured: ${tradeProductId}`, 'green');
  }

  // Test 5: Update trade product (Step 2)
  if (tradeProductId) {
    await testAPI(
      '5. Update Trade Product (Step 2)',
      'POST',
      `${BASE_URL}/trade/add_trade_product`,
      {
        id: tradeProductId,
        user_id: 1,
        step: 2,
        railway: '10 km',
        airport: '50 km',
        post_office: '2 km',
        godown: '5 km',
        national_highway: '8 km',
        state_highway: '3 km'
      }
    );
  }

  // Test 6: Get trade products list
  await testAPI(
    '6. Get Trade Products List',
    'POST',
    `${BASE_URL}/trade/trade_product`,
    {
      user_id: 1,
      start: 1
    }
  );

  // Test 7: Get specific trade product
  if (tradeProductId) {
    await testAPI(
      '7. Get Specific Trade Product',
      'POST',
      `${BASE_URL}/trade/trade_product`,
      {
        id: tradeProductId
      }
    );
  }

  // Test 8: Get trade bidding (will be empty as no bids yet)
  if (tradeProductId) {
    await testAPI(
      '8. Get Trade Bidding List',
      'POST',
      `${BASE_URL}/trade/trade_bidding`,
      {
        product_id: tradeProductId,
        start: 1
      }
    );
  }

  // Test 9: Seller action (self sold)
  if (tradeProductId) {
    await testAPI(
      '9. Seller Action - Self Sold',
      'POST',
      `${BASE_URL}/trade/seller_action`,
      {
        product_id: tradeProductId,
        seller_id: 1,
        status: '7'
      }
    );
  }

  // Test 10: Delete trade product
  if (tradeProductId) {
    await testAPI(
      '10. Delete Trade Product',
      'GET',
      `${BASE_URL}/trade/remove_trade_product/${tradeProductId}`
    );
  }

  log('\n' + '='.repeat(60), 'blue');
  log('ALL TRADE API TESTS COMPLETED', 'yellow');
  log('='.repeat(60) + '\n', 'blue');
}

runTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});
