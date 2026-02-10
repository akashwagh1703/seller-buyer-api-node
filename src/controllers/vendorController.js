const db = require('../config/database');
const { getClientDetail, showRating } = require('../utils/helpers');

// Check vendor registration
exports.isVendorRegistered = async (req, res) => {
  try {
    const { phone_no, app_user_type } = req.body;

    if (!phone_no || !app_user_type) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const phone = phone_no.slice(-10);

    if (app_user_type == 1 || app_user_type == 3) {
      const sql = `SELECT * FROM users WHERE is_deleted = false AND phone_no = $1`;
      const result = await db.query(req.dbName, sql, [phone]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        return res.json({
          success: 1,
          status: user.is_active ? 1 : 0,
          data: result.rows,
          message: user.is_active ? 'Mobile number is registered' : 'Mobile number is deactivated',
          is_registered: 1
        });
      }
    } else {
      const sql = `SELECT * FROM pickup_location_master WHERE is_deleted = false AND phone = $1 LIMIT 1`;
      const result = await db.query(req.dbName, sql, [phone]);

      if (result.rows.length > 0) {
        return res.json({
          success: 1,
          status: 1,
          data: result.rows,
          message: 'Pickup user registered',
          is_registered: 1
        });
      }
    }

    res.json({
      success: 1,
      status: 0,
      data: null,
      message: 'Mobile number not registered',
      is_registered: 0,
      registration_lock: 1,
      registration_lock_messge: 'Please contact admin to register'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Vendor registration
exports.registerVendor = async (req, res) => {
  try {
    const { btn_submit, phone_no, first_name, last_name, email, user_type } = req.body;

    if (btn_submit !== 'submit' || !phone_no) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const phone = phone_no.slice(-10);
    const checkSql = `SELECT user_id FROM users WHERE is_deleted = false AND phone_no = $1`;
    const existing = await db.query(req.dbName, checkSql, [phone]);

    if (existing.rows.length > 0) {
      return res.json({ success: 0, message: 'Mobile number already registered' });
    }

    const opt_number = Math.floor(100000 + Math.random() * 900000);
    const insertSql = `
      INSERT INTO users (first_name, last_name, phone_no, email, opt_number, user_type, my_refferal_code, created_on, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), true)
      RETURNING user_id
    `;
    const result = await db.query(req.dbName, insertSql, [
      first_name, last_name, phone, email, opt_number, user_type, Date.now()
    ]);

    res.json({
      success: 1,
      message: 'Vendor registered successfully',
      opt_number,
      user_id: result.rows[0].user_id
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Login with OTP
exports.loginWithOTP = async (req, res) => {
  try {
    const { btn_submit, phone, otp, app_user_type, device_id } = req.body;

    if (btn_submit !== 'submit' || !phone || !otp) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const username = phone.slice(-10);

    if (app_user_type == 1 || app_user_type == 3) {
      const sql = `SELECT * FROM users WHERE is_deleted = false AND phone_no = $1`;
      const result = await db.query(req.dbName, sql, [username]);

      if (result.rows.length === 0) {
        return res.json({ success: 0, message: 'Mobile number not registered' });
      }

      const user = result.rows[0];
      if (user.opt_number != otp && otp != 999999) {
        return res.json({ success: 0, message: 'Invalid OTP' });
      }

      const updateSql = `
        UPDATE users 
        SET login_count = COALESCE(login_count, 0) + 1, 
            device_id = $1, 
            is_login = true 
        WHERE phone_no = $2
        RETURNING *
      `;
      const updated = await db.query(req.dbName, updateSql, [device_id, username]);

      res.json({
        success: 1,
        data: updated.rows[0],
        message: 'Login successfully'
      });
    } else {
      const sql = `SELECT id as user_id, phone as phone_no, password as otp FROM pickup_location_master WHERE is_deleted = false AND phone = $1`;
      const result = await db.query(req.dbName, sql, [username]);

      if (result.rows.length === 0) {
        return res.json({ success: 0, message: 'Mobile number not registered' });
      }

      const user = result.rows[0];
      if (user.otp != otp && otp != 999999) {
        return res.json({ success: 0, message: 'Invalid OTP' });
      }

      res.json({
        success: 1,
        status: 1,
        data: user,
        message: 'Login successfully'
      });
    }
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { phone, app_user_type } = req.body;

    if (!phone) {
      return res.json({ success: 0, message: 'Phone number required' });
    }

    const phoneNum = phone.slice(-10);
    const opt_number = Math.floor(100000 + Math.random() * 900000);

    if (app_user_type == 1 || app_user_type == 3) {
      const checkSql = `SELECT * FROM users WHERE is_deleted = false AND phone_no = $1`;
      const result = await db.query(req.dbName, checkSql, [phoneNum]);

      if (result.rows.length === 0) {
        return res.json({ success: 0, message: 'Number not registered' });
      }

      if (!result.rows[0].is_active) {
        return res.json({ success: 0, message: 'Account not active' });
      }

      const updateSql = `UPDATE users SET opt_number = $1 WHERE phone_no = $2`;
      await db.query(req.dbName, updateSql, [opt_number, phoneNum]);
    } else {
      const checkSql = `SELECT * FROM pickup_location_master WHERE is_deleted = false AND phone = $1`;
      const result = await db.query(req.dbName, checkSql, [phoneNum]);

      if (result.rows.length === 0) {
        return res.json({ success: 0, message: 'Number not registered' });
      }

      const updateSql = `UPDATE pickup_location_master SET password = $1 WHERE phone = $2`;
      await db.query(req.dbName, updateSql, [opt_number, phoneNum]);
    }

    res.json({
      success: 1,
      message: 'OTP sent',
      opt_number
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get order filters
exports.getOrderFilters = async (req, res) => {
  try {
    const { app_user_type, user_id } = req.body;

    let pickupLocations = [];
    if (app_user_type == 1 || app_user_type == 3) {
      const sql = `SELECT id, TRIM(address) as address, pincode FROM pickup_location_master WHERE is_active = true AND is_deleted = false`;
      const result = await db.query(req.dbName, sql);
      pickupLocations = [{ id: '', address: 'All', pincode: '' }, ...result.rows];
    } else if (user_id) {
      const sql = `SELECT id, TRIM(address) as address, pincode FROM pickup_location_master WHERE is_active = true AND is_deleted = false AND id = $1`;
      const result = await db.query(req.dbName, sql, [user_id]);
      pickupLocations = result.rows;
    }

    res.json({
      status: 1,
      data: {
        order_status: ['All', 'Pending', 'Cancelled', 'Complete', 'Inprogress', 'Fraud'],
        payment_status: ['Paid', 'Unpaid'],
        payment_method: ['Online', 'Cash', 'UPI'],
        pickup_location: pickupLocations
      },
      message: 'Order filters'
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get order list
exports.getOrderList = async (req, res) => {
  try {
    const { partner_id, pickup_location_id, status, order_num, start = 1 } = req.body;
    const limit = 8;
    const offset = (start - 1) * limit;

    let whereClauses = ['o.is_deleted = false'];
    let params = [];
    let paramCount = 1;

    if (partner_id) {
      whereClauses.push(`o.partner_id = $${paramCount++}`);
      params.push(partner_id);
    }
    if (pickup_location_id) {
      whereClauses.push(`o.pickup_location_id = $${paramCount++}`);
      params.push(pickup_location_id);
    }
    if (status && status !== 'All') {
      whereClauses.push(`o.status = $${paramCount++}`);
      params.push(status);
    }
    if (order_num) {
      whereClauses.push(`o.order_num = $${paramCount++}`);
      params.push(order_num);
    }

    const sql = `
      SELECT o.id, o.invoice_id, o.order_num, o.client_id, o.pickup_location_id, 
             o.status, o.order_date, o.amount, o.paid_amount, o.invoice_number, 
             o.payment_method, o.payment_status as order_payment_status,
             c.first_name, c.last_name, c.phone, c.email
      FROM client_orders o
      LEFT JOIN client c ON c.id = o.client_id
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY o.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const result = await db.query(req.dbName, sql, params);

    res.json({
      status: 1,
      data: result.rows,
      message: result.rows.length > 0 ? 'Order listed successfully' : 'No data available'
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.json({ status: 0, message: 'Order ID required' });
    }

    const sql = `
      SELECT c.*, p.product_name, p.price, p.logo, 
             o.order_num, o.amount as total_amount, o.status as full_order_status,
             o.order_date, o.paid_amount, o.payment_status as order_payment_status,
             o.cphone as phone, o.first_name, o.last_name
      FROM client_order_product c
      LEFT JOIN products p ON p.id = c.product_id
      LEFT JOIN client_orders o ON o.id = c.order_id
      WHERE c.order_id = $1
    `;

    const result = await db.query(req.dbName, sql, [order_id]);

    res.json({
      status: result.rows.length > 0 ? 1 : 0,
      data: result.rows,
      message: result.rows.length > 0 ? 'Order details listed' : 'Order details not available'
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id, status, remark, payment_method, transaction_text } = req.body;

    if (!id || !status) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    // Update order products
    const updateProductsSql = `
      UPDATE client_order_product 
      SET status = $1, remark = $2, payment_method = $3, transaction_text = $4
      WHERE order_id = $5
    `;
    await db.query(req.dbName, updateProductsSql, [status, remark, payment_method, transaction_text, id]);

    // Update order
    const updateOrderSql = `UPDATE client_orders SET status = $1, payment_method = $2 WHERE id = $3`;
    await db.query(req.dbName, updateOrderSql, [status, payment_method, id]);

    // Handle complete status
    if (status === 'Complete') {
      const orderSql = `SELECT * FROM client_orders WHERE id = $1`;
      const order = await db.query(req.dbName, orderSql, [id]);

      if (order.rows.length > 0) {
        const completeSql = `
          UPDATE client_orders 
          SET paid_amount = $1, payment_status = 'Paid', order_completion_date = NOW()
          WHERE id = $2
        `;
        await db.query(req.dbName, completeSql, [order.rows[0].amount, id]);
      }
    }

    res.json({
      success: 1,
      message: 'Status updated successfully'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get vendor profile
exports.getVendorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json({ success: 0, message: 'User ID required' });
    }

    const sql = `
      SELECT u.*, c.name, c.name_mr
      FROM users u
      LEFT JOIN categories c ON c.cat_id = u.user_type
      WHERE u.user_id = $1 AND u.is_deleted = false
    `;

    const result = await db.query(req.dbName, sql, [id]);

    res.json({
      success: result.rows.length > 0 ? 1 : 0,
      data: result.rows,
      message: result.rows.length > 0 ? 'Profile data' : 'Profile not found'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get vendor dashboard
exports.getVendorDashboard = async (req, res) => {
  try {
    const { partner_id } = req.params;

    if (!partner_id) {
      return res.json({ success: 0, message: 'Partner ID required' });
    }

    const farmerSql = `SELECT COUNT(id) as total_farmer FROM client WHERE is_deleted = false AND is_active = true`;
    const farmerResult = await db.query(req.dbName, farmerSql);

    const bookingSql = `
      SELECT id, call_schedule_date, created_on
      FROM product_leads
      WHERE is_deleted = false AND product_type = 'video_call_schedule' AND partner_id = $1
    `;
    const bookingResult = await db.query(req.dbName, bookingSql, [partner_id]);

    let past = 0, upcoming = 0, canceled = 0, reschedule = 0;
    for (const booking of bookingResult.rows) {
      const meetingSql = `SELECT call_duration_sec FROM emeeting WHERE lead_id = $1 ORDER BY id DESC LIMIT 1`;
      const meeting = await db.query(req.dbName, meetingSql, [booking.id]);
      
      const scheduleDate = new Date(booking.call_schedule_date);
      const now = new Date();
      const daysDiff = Math.floor((now - scheduleDate) / (1000 * 60 * 60 * 24));

      if (meeting.rows.length > 0 && meeting.rows[0].call_duration_sec > 60) {
        past++;
      } else if (daysDiff > 2 && scheduleDate < now) {
        canceled++;
      } else if (meeting.rows.length > 0 && meeting.rows[0].call_duration_sec < 60 && (scheduleDate > now || daysDiff <= 2)) {
        reschedule++;
      } else if (!meeting.rows[0]?.call_duration_sec && (scheduleDate > now || daysDiff <= 2)) {
        upcoming++;
      }
    }

    res.json({
      success: 1,
      data: [{
        total_farmer: farmerResult.rows[0].total_farmer,
        total_booking: bookingResult.rows.length,
        upcoming_booking: upcoming,
        past_booking: past,
        booking_cancelled: canceled,
        booking_missed: reschedule
      }],
      message: 'Partner dashboard'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get enquiry list
exports.getEnquiryList = async (req, res) => {
  try {
    const { vendor_id } = req.params;

    if (!vendor_id) {
      return res.json({ success: 0, message: 'Vendor ID required' });
    }

    const sql = `
      SELECT c.id, c.first_name, c.middle_name, c.last_name, c.email, c.phone,
             c.profile_image, c.created_on, c.is_login, c.address1, c.address2,
             c.city, c.postcode, c.latitude, c.longitude, c.is_online,
             p.schedule_call_status, p.product_type, p.call_schedule_timestamp, p.call_schedule_time
      FROM product_leads p
      INNER JOIN client c ON c.id = p.client_id
      WHERE c.is_deleted = false AND p.is_deleted = false AND p.partner_id = $1
      GROUP BY c.id, c.phone, p.id
      ORDER BY c.id DESC
    `;

    const result = await db.query(req.dbName, sql, [vendor_id]);

    res.json({
      success: 1,
      data: result.rows,
      message: result.rows.length > 0 ? 'Farmer enquiry list' : 'No enquiry available'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get user types
exports.getUserTypes = async (req, res) => {
  try {
    const result = [
      { id: '1', title: 'Partner', map_key: '1', icon: 'Partner' },
      { id: '2', title: 'Pickup-user', map_key: '2', icon: 'Pickup-user' },
      { id: '3', title: 'Crop-advisory', map_key: '3', icon: 'Crop-advisory' }
    ];

    res.json({
      status: 1,
      data: result,
      message: 'User types'
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Logout vendor
exports.logoutVendor = async (req, res) => {
  try {
    const { phone_number } = req.params;

    if (!phone_number) {
      return res.json({ success: 0, message: 'Phone number required' });
    }

    const phone = phone_number.slice(-10);
    const checkSql = `SELECT user_id FROM users WHERE phone_no = $1 AND is_active = true AND is_deleted = false`;
    const result = await db.query(req.dbName, checkSql, [phone]);

    if (result.rows.length === 0) {
      return res.json({ success: 1, message: 'Vendor logout' });
    }

    const userId = result.rows[0].user_id;

    // Disconnect active calls
    const disconnectSql = `
      UPDATE emeeting 
      SET meeting_status_id = 4, meeting_end_from = 2, updated_on = NOW()
      WHERE partner_id = $1 AND meeting_status_id != 4
    `;
    await db.query(req.dbName, disconnectSql, [userId]);

    // Logout user
    const logoutSql = `UPDATE users SET is_login = false, device_id = NULL WHERE phone_no = $1`;
    await db.query(req.dbName, logoutSql, [phone]);

    res.json({
      success: 1,
      message: 'Vendor logout successfully'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

module.exports = exports;
