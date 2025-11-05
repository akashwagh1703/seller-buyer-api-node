const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v16/users';
const headers = {
  'domain': 'seller',
  'appname': 'seller_buyer',
  'Content-Type': 'application/json'
};

let authToken = '';
let testUserId = '';
const testPhone = '9876543210'; // Test number that returns OTP 643215

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

async function testAPI(name, method, url, data = null, useAuth = false) {
  try {
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`Testing: ${name}`, 'yellow');
    log(`${method} ${url}`, 'blue');
    
    const config = { headers: { ...headers } };
    if (useAuth && authToken) {
      config.headers['Authorization'] = authToken;
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
    
    // Capture auth token if present
    if (response.headers['authorization']) {
      authToken = response.headers['authorization'];
      log(`Auth Token Captured: ${authToken}`, 'yellow');
    }
    
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
  log('STARTING USER API TESTS', 'yellow');
  log('='.repeat(60) + '\n', 'blue');

  // Test 1: Check if user is registered
  await testAPI(
    '1. Check User Registration Status',
    'POST',
    `${BASE_URL}/is_user_regsitered`,
    { phone: testPhone }
  );

  // Test 2: Register OTP
  const registerResult = await testAPI(
    '2. Register User (Send OTP)',
    'POST',
    `${BASE_URL}/register_otp`,
    {
      phone: testPhone,
      client_type: 2,
      latitude: '19.9975',
      longitude: '73.7898',
      city_name: 'Nashik',
      device_id: 'test_device_123'
    }
  );

  if (registerResult && registerResult.data) {
    testUserId = registerResult.data.user_id;
    log(`User ID Captured: ${testUserId}`, 'yellow');
  }

  // Test 3: Verify OTP
  const verifyResult = await testAPI(
    '3. Verify OTP',
    'POST',
    `${BASE_URL}/verify_otp`,
    {
      phone: testPhone,
      otp: '643215'
    }
  );

  // Test 4: Login with OTP
  const loginResult = await testAPI(
    '4. Login with OTP',
    'POST',
    `${BASE_URL}/login_otp`,
    {
      phone: testPhone,
      otp: '643215',
      latitude: '19.9975',
      longitude: '73.7898',
      city_name: 'Nashik',
      device_id: 'test_device_123',
      loc_addresss: 'Test Address, Nashik'
    }
  );

  // Test 5: Resend OTP
  await testAPI(
    '5. Resend OTP',
    'POST',
    `${BASE_URL}/resend_otp`,
    { phone: testPhone }
  );

  // Test 6: Get Profile (Protected)
  await testAPI(
    '6. Get User Profile',
    'GET',
    `${BASE_URL}/profile`,
    null,
    true
  );

  // Test 7: Update Profile (Protected)
  await testAPI(
    '7. Update User Profile',
    'POST',
    `${BASE_URL}/update_profile`,
    {
      id: testUserId || 1,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      city: '1',
      state: '1'
    },
    true
  );

  // Test 8: Get Master Data
  await testAPI(
    '8. Get Master Data',
    'GET',
    `${BASE_URL}/master_data`
  );

  // Test 9: About Us
  await testAPI(
    '9. Get About Us',
    'GET',
    `${BASE_URL}/about_us`
  );

  // Test 10: Categories
  await testAPI(
    '10. Get Categories',
    'GET',
    `${BASE_URL}/categories`
  );

  // Test 11: Check User Registration Again
  await testAPI(
    '11. Check User Registration (After Registration)',
    'POST',
    `${BASE_URL}/is_user_regsitered`,
    { phone: testPhone }
  );

  // Test 12: Logout
  await testAPI(
    '12. Logout User',
    'GET',
    `${BASE_URL}/logout_check/${testPhone}`,
    null,
    true
  );

  // Test 13: Login (username/password style)
  await testAPI(
    '13. Login with Username',
    'POST',
    `${BASE_URL}/login`,
    {
      username: testPhone,
      password: 'test123'
    }
  );

  log('\n' + '='.repeat(60), 'blue');
  log('ALL TESTS COMPLETED', 'yellow');
  log('='.repeat(60) + '\n', 'blue');
}

// Run tests
runTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});
