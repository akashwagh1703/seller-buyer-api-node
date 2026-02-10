const db = require('../config/database');
const logger = require('../utils/logger');
const { getClientDetail, showRating, calculateRevokeTime, tradeActivityLogs, calculateManageProductStatus } = require('../utils/helpers');

const isUserRegistered = async (req, res) => {
  try {
    const { phone } = req.body;
    const domain = req.domain || '';
    const isBuyer = domain.toLowerCase().includes('buyer');
    
    const step_list = isBuyer ? ['Registration', 'Profile', 'Complete'] : ['Registration', 'Complete'];
    const show_referral = '0';
    const registration_lock = '0';
    const registration_lock_messge = '';
    const app_user_type = '0';
    
    if (!phone) {
      return res.json({ success: 0, error: 1, status: 1, data: [], message: 'Missing_Parameter', app_user_type, show_referral, registration_lock, registration_lock_messge });
    }
    
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    const sql = `SELECT *, (SELECT name FROM cities_new WHERE id::varchar = client.city) as new_city_name, (SELECT name FROM states_new WHERE id::varchar = client.state) as new_state_name FROM client WHERE is_deleted = false AND phone::varchar = $1::varchar`;
    const result = await db.query(req.dbName, sql, [cleanPhone]);
    const user = result.rows[0];
    
    if (user) {
      const is_profile_complete = user.active_step == 3 ? 1 : 0;
      
      if (user.client_type && isBuyer) {
        if (parseInt(user.client_type) === 1) {
          if (user.is_active) {
            return res.json({ success: 1, error: 0, status: 1, data: result.rows, step_list, message: 'Already_Register', is_registered: 1, app_user_type, show_referral, is_profile_complete, registration_lock, registration_lock_messge });
          } else {
            return res.json({ success: 1, error: 0, status: 0, data: null, step_list, message: 'Mobile_Deactivated', is_registered: 1, app_user_type, show_referral, is_profile_complete, registration_lock, registration_lock_messge });
          }
        } else {
          return res.json({ success: 0, error: 1, status: 1, data: [], message: 'Buyer_Login_Failed', app_user_type, show_referral, registration_lock, registration_lock_messge });
        }
      } else {
        if (user.is_active) {
          return res.json({ success: 1, error: 0, status: 1, data: result.rows, step_list, message: 'Already_Register', is_registered: 1, app_user_type, show_referral, is_profile_complete, registration_lock, registration_lock_messge });
        } else {
          return res.json({ success: 1, error: 0, status: 0, data: null, step_list, message: 'Mobile_Deactivated', is_registered: 1, app_user_type, show_referral, is_profile_complete, registration_lock, registration_lock_messge });
        }
      }
    } else {
      return res.json({ success: 1, error: 0, status: 0, data: null, step_list, message: 'Not_Register', is_registered: 0, app_user_type, show_referral, is_profile_complete: 0, registration_lock, registration_lock_messge });
    }
  } catch (error) {
    logger.error('Check user error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: error.message || 'Error_Checking_User' });
  }
};

const registerOTP = async (req, res) => {
  try {
    const { phone, btn_submit } = req.body;
    
    if (btn_submit !== 'submit' || !phone) {
      return res.json({ success: 0, error: 1, status: 1, data: {}, message: 'Missing_Parameter' });
    }
    
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    const checkSql = `SELECT * FROM client WHERE is_deleted = false AND phone::varchar = $1::varchar`;
    const checkResult = await db.query(req.dbName, checkSql, [cleanPhone]);
    
    if (checkResult.rows.length > 0) {
      return res.json({ success: 0, error: 1, status: 1, data: 'NULL', user_id: checkResult.rows[0].id, active_step: checkResult.rows[0].active_step, message: 'Already_Register' });
    }
    
    const otp = cleanPhone === '9876543210' || cleanPhone === '9976543210' ? '643215' : Math.floor(100000 + Math.random() * 900000).toString();
    const isBuyer = req.domain && req.domain.toLowerCase().includes('buyer');
    
    const insertData = {
      phone: cleanPhone,
      opt_number: otp,
      is_active: true,
      is_whitelabeled: false,
      client_type: isBuyer ? 1 : null,
      my_refferal_code: Date.now().toString(),
      created_on: new Date()
    };
    
    const fields = Object.keys(insertData).join(', ');
    const values = Object.values(insertData);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const insertSql = `INSERT INTO client (${fields}) VALUES (${placeholders}) RETURNING id, active_step`;
    const insertResult = await db.query(req.dbName, insertSql, values);
    
    return res.json({ success: 1, error: 0, status: 1, data: {}, message: 'Register_Successfully', opt_number: otp, user_id: insertResult.rows[0].id, active_step: insertResult.rows[0].active_step });
  } catch (error) {
    logger.error('Register OTP error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: {}, message: 'Registration_Failed' });
  }
};

const tradeProduct = async (req, res) => {
  try {
    const { buyer_id, prod_cat_id = 1, start = 1 } = req.body;
    const limit = 10;
    const offset = (start - 1) * limit;
    
    let excludeProductIds = [];
    if (buyer_id && prod_cat_id != 2) {
      const interestQuery = `SELECT trade_product_id FROM trade_product_interest 
                             WHERE buyer_id = $1 AND is_deleted = false AND is_active = true`;
      const interestResult = await db.query(req.dbName, interestQuery, [buyer_id]);
      excludeProductIds = interestResult.rows.map(r => r.trade_product_id);
    }
    
    let sql = `SELECT tp.*, pm.title as product_title, pm.logo as product_logo,
               c.first_name as seller_first_name, c.last_name as seller_last_name,
               sn.name as state_name, cn.name as city_name,
               (SELECT COUNT(*) FROM trade_product_bidding WHERE trade_product_id = tp.id AND is_deleted = false) as bid_count,
               (SELECT MAX(bid_price) FROM trade_product_bidding WHERE trade_product_id = tp.id AND is_deleted = false AND is_active = true) as highest_bid
               FROM trade_product tp
               LEFT JOIN prod_master pm ON pm.id = tp.prod_id
               LEFT JOIN client c ON c.id = tp.user_id
               LEFT JOIN states_new sn ON sn.id::varchar = tp.state
               LEFT JOIN cities_new cn ON cn.id::varchar = tp.city
               WHERE tp.is_deleted = false AND tp.is_active = true 
               AND tp.status = '3' AND tp.prod_cat_id = $1`;
    
    if (excludeProductIds.length > 0) {
      sql += ` AND tp.id NOT IN (${excludeProductIds.join(',')})`;
    }
    
    sql += ` ORDER BY tp.approved_date DESC LIMIT $2 OFFSET $3`;
    
    const result = await db.query(req.dbName, sql, [prod_cat_id, limit, offset]);
    
    if (result.rows.length > 0) {
      const data = await Promise.all(result.rows.map(async (row) => {
        const rating_details = await showRating(req.dbName, row.user_id, 'seller');
        return {
          ...row,
          seller_name: `${row.seller_first_name || ''} ${row.seller_last_name || ''}`.trim(),
          prod_images: row.prod_images ? JSON.parse(row.prod_images) : {},
          other_details: row.other_details ? JSON.parse(row.other_details) : {},
          other_distance: row.other_distance ? JSON.parse(row.other_distance) : {},
          rating_details,
          highestBid: row.highest_bid || row.price,
          prod_thumbnail: `http://localhost:3000/uploads/config_master/prod_master/${row.product_logo}`
        };
      }));
      return res.json({ success: 1, data, message: 'Listed_Successfully', total: result.rows.length });
    } else {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('Trade product error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const manageProduct = async (req, res) => {
  try {
    const { buyer_id, prod_cat_id, start = 1 } = req.body;
    const limit = 60;
    const offset = (start - 1) * limit;
    
    const sql = `SELECT tp.*, pm.title as product_title, pm.logo as product_logo,
                 c.first_name as seller_first_name, c.last_name as seller_last_name,
                 sn.name as state_name, cn.name as city_name,
                 (SELECT COUNT(*) FROM trade_product_bidding tpb WHERE tpb.trade_product_id = tp.id AND tpb.buyer_id = $3 AND tpb.is_deleted = false) as my_bid_count
                 FROM trade_product tp
                 LEFT JOIN prod_master pm ON pm.id = tp.prod_id
                 LEFT JOIN client c ON c.id = tp.user_id
                 LEFT JOIN states_new sn ON sn.id::varchar = tp.state
                 LEFT JOIN cities_new cn ON cn.id::varchar = tp.city
                 WHERE tp.is_deleted = false AND tp.is_active = true
                 ${prod_cat_id ? `AND tp.prod_cat_id = ${prod_cat_id}` : ''}
                 ORDER BY tp.updated_on DESC LIMIT $1 OFFSET $2`;
    
    const result = await db.query(req.dbName, sql, [limit, offset, buyer_id]);
    
    if (result.rows.length > 0) {
      const data = result.rows.map(row => ({
        ...row,
        seller_name: `${row.seller_first_name || ''} ${row.seller_last_name || ''}`.trim(),
        prod_images: row.prod_images ? JSON.parse(row.prod_images) : {},
        other_details: row.other_details ? JSON.parse(row.other_details) : {},
        other_distance: row.other_distance ? JSON.parse(row.other_distance) : {}
      }));
      return res.json({ success: 1, data, message: 'Listed_Successfully', total: result.rows.length });
    } else {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('Manage product error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const tradeProductBidding = async (req, res) => {
  try {
    const { product_id, buyer_id, qty, qty_unit, bid_price } = req.body;
    
    if (!product_id || !buyer_id || !bid_price) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }
    
    const productSql = `SELECT * FROM trade_product WHERE id = $1 AND is_deleted = false AND is_active = true`;
    const productResult = await db.query(req.dbName, productSql, [product_id]);
    
    if (productResult.rows.length === 0) {
      return res.json({ success: 0, data: [], message: 'Current product is not available!' });
    }
    
    const product = productResult.rows[0];
    
    // Validate expiry date
    if (new Date(product.expiry_date) < new Date()) {
      return res.json({ success: 0, data: [], message: 'Current product is expired!' });
    }
    
    // Validate quantity
    if (qty && product.sell_qty < qty) {
      return res.json({ success: 0, data: { sell_qty: product.sell_qty, request_qty: qty }, message: 'Request quantity does not match with sell quantity!' });
    }
    
    const seller_id = product.user_id;
    const current_date = new Date();
    
    // Check for existing bid
    const existingBidSql = `SELECT * FROM trade_product_bidding 
                            WHERE buyer_id = $1 AND seller_id = $2 AND trade_product_id = $3 
                            AND is_deleted = false AND is_active = true`;
    const existingBidResult = await db.query(req.dbName, existingBidSql, [buyer_id, seller_id, product_id]);
    
    if (existingBidResult.rows.length > 0) {
      const existingBid = existingBidResult.rows[0];
      // Check if bid can be updated
      if ([1, 2, 3].includes(parseInt(existingBid.seller_action)) || [1, 2, 3].includes(parseInt(existingBid.buyer_action))) {
        const updateSql = `UPDATE trade_product_bidding 
                           SET qty = $1, qty_unit = $2, bid_price = $3, bid_date = $4, 
                               buyer_action = 1, seller_action = NULL, buyer_action_date = $5, 
                               bid_status = 1, bid_count = bid_count + 1, updated_on = $6
                           WHERE id = $7`;
        await db.query(req.dbName, updateSql, [qty, qty_unit, bid_price, current_date, current_date, current_date, existingBid.id]);
        return res.json({ success: 1, data: { id: existingBid.id }, message: 'Updated Successfully' });
      } else {
        return res.json({ success: 0, data: [], message: 'Already Bid on this product!' });
      }
    }
    
    const insertSql = `INSERT INTO trade_product_bidding (buyer_id, seller_id, trade_product_id, qty, qty_unit, bid_price, bid_date, buyer_action, buyer_action_date, bid_status, bid_count)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, 1, 1) RETURNING id`;
    const insertResult = await db.query(req.dbName, insertSql, [buyer_id, seller_id, product_id, qty, qty_unit, bid_price, current_date, current_date]);
    
    return res.json({ success: 1, data: { inserted_id: insertResult.rows[0].id }, message: 'Added_Successfully' });
  } catch (error) {
    logger.error('Trade product bidding error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Processing_Bid' });
  }
};

const buyerAction = async (req, res) => {
  try {
    const { id, status, product_id, buyer_id } = req.body;
    const current_date = new Date();
    let reason = null, trade_product_status = 3, is_deleted = false;
    
    if (status === '2') { reason = 'Revoked by buyer'; }
    if (status === '3') { reason = 'Canceled by buyer'; is_deleted = true; }
    
    await db.query(req.dbName, `UPDATE trade_product SET status = $1, reason = $2, updated_on = $3 WHERE id = $4`, 
      [trade_product_status, reason, current_date, product_id]);
    
    await db.query(req.dbName, `UPDATE trade_product_bidding SET buyer_action = $1, buyer_action_date = $2, bid_status = $3, seller_action = NULL, updated_on = $4, is_deleted = $5 WHERE id = $6`, 
      [status, current_date, status, current_date, is_deleted, id]);
    
    await tradeActivityLogs(req.dbName, {
      title: 'Buyer Action', description: `Buyer action: ${reason}`, userid: buyer_id, user_type: 'Buyer',
      trade_product_id: product_id, trade_product_status, user_action: status, reason
    });
    
    return res.json({ success: 1, data: {}, message: 'Status_Updated_Successfully' });
  } catch (error) {
    logger.error('Buyer action error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Updating_Status' });
  }
};

const addInterestOnProduct = async (req, res) => {
  try {
    const { buyer_id, trade_product_id } = req.body;
    
    if (!buyer_id || !trade_product_id) {
      return res.json({ status: 0, data: [], message: 'Missing_Parameter' });
    }
    
    const checkSql = `SELECT * FROM trade_product_interest WHERE trade_product_id = $1 AND buyer_id = $2`;
    const checkResult = await db.query(req.dbName, checkSql, [trade_product_id, buyer_id]);
    
    if (checkResult.rows.length > 0) {
      const deleteSql = `DELETE FROM trade_product_interest WHERE trade_product_id = $1 AND buyer_id = $2`;
      await db.query(req.dbName, deleteSql, [trade_product_id, buyer_id]);
      return res.json({ status: 1, data: [], message: 'Interest_revoke_Msg' });
    } else {
      const productSql = `SELECT user_id FROM trade_product WHERE is_deleted = false AND id = $1`;
      const productResult = await db.query(req.dbName, productSql, [trade_product_id]);
      
      const insertSql = `INSERT INTO trade_product_interest (buyer_id, trade_product_id, seller_id, created_on) VALUES ($1, $2, $3, $4)`;
      await db.query(req.dbName, insertSql, [buyer_id, trade_product_id, productResult.rows[0].user_id, new Date()]);
      return res.json({ status: 1, data: true, message: 'Interest_Shown_Msg' });
    }
  } catch (error) {
    logger.error('Add interest error', { error: error.message });
    return res.json({ status: 0, data: [], message: 'Error_Processing_Interest' });
  }
};

const newProduct = async (req, res) => {
  try {
    const { prod_cat_id = 1, start = 1 } = req.body;
    const limit = 4;
    const offset = (start - 1) * limit;
    
    const sql = `SELECT tp.id, tp.prod_id, tp.price, tp.price_unit, tp.sell_qty, tp.sell_qty_unit,
                 pm.title as product_title, pm.logo as product_logo,
                 c.first_name as seller_first_name, c.last_name as seller_last_name,
                 sn.name as state_name, cn.name as city_name
                 FROM trade_product tp
                 LEFT JOIN prod_master pm ON pm.id = tp.prod_id
                 LEFT JOIN client c ON c.id = tp.user_id
                 LEFT JOIN states_new sn ON sn.id::varchar = tp.state
                 LEFT JOIN cities_new cn ON cn.id::varchar = tp.city
                 WHERE tp.is_deleted = false AND tp.is_active = true AND tp.status = '3' AND tp.prod_cat_id = $1
                 ORDER BY tp.id DESC LIMIT $2 OFFSET $3`;
    
    const result = await db.query(req.dbName, sql, [prod_cat_id, limit, offset]);
    
    if (result.rows.length > 0) {
      const data = result.rows.map(row => ({
        ...row,
        seller_name: `${row.seller_first_name || ''} ${row.seller_last_name || ''}`.trim(),
        prod_thumbnail: `http://localhost:3000/uploads/config_master/prod_master/${row.product_logo}`
      }));
      return res.json({ success: 1, data, message: 'Listed_Successfully' });
    } else {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('New product error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const trendingProduct = async (req, res) => {
  try {
    const { prod_cat_id = 1 } = req.body;
    
    const sql = `SELECT tp.prod_id, pm.logo as product_logo, pm.title as product_title, 
                 COUNT(*) AS total_sales,
                 AVG(tp.price) as avg_price,
                 MIN(tp.price) as min_price,
                 MAX(tp.price) as max_price
                 FROM trade_product tp
                 JOIN prod_master pm ON tp.prod_id = pm.id
                 WHERE tp.status IN ('4', '5') AND tp.prod_cat_id = $1 AND tp.is_deleted = false AND tp.is_active = true
                 GROUP BY tp.prod_id, pm.logo, pm.title
                 ORDER BY total_sales DESC LIMIT 4`;
    
    const result = await db.query(req.dbName, sql, [prod_cat_id]);
    
    if (result.rows.length > 0) {
      const data = result.rows.map(row => ({
        ...row,
        prod_thumbnail: `http://localhost:3000/uploads/config_master/prod_master/${row.product_logo}`
      }));
      return res.json({ success: 1, data, message: 'Listed_Successfully' });
    } else {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('Trending product error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const myStats = async (req, res) => {
  try {
    const { buyer_id, prod_cat_id, year = new Date().getFullYear() } = req.body;
    
    let sql, result;
    
    if (prod_cat_id === 2) {
      // Contract Farming - use trade_product_interest
      sql = `SELECT 
               CASE WHEN tpi.is_deleted = false THEN 1 ELSE 2 END as status,
               COUNT(*) as row_count,
               tp.prod_cat_id
             FROM trade_product_interest tpi
             LEFT JOIN trade_product tp ON tp.id = tpi.trade_product_id
             WHERE tpi.buyer_id = $1 AND tp.prod_cat_id = $2
             AND EXTRACT(YEAR FROM tpi.created_on) = $3
             GROUP BY tpi.is_deleted, tp.prod_cat_id`;
      result = await db.query(req.dbName, sql, [buyer_id, prod_cat_id, year]);
      
      // Map to readable format
      const data = result.rows.map(row => ({
        ...row,
        status_title: row.status === 1 ? 'Interest Shown' : 'Interest Revoked',
        status_class: ''
      }));
      return res.json({ success: 1, data, message: 'Listed_Successfully' });
    } else {
      // Regular products - use trade_product_bidding
      sql = `SELECT tpib.bid_status as status, COUNT(*) AS row_count, tp.prod_cat_id,
                   SUM(COALESCE(tpib.bid_price, 0) * COALESCE(tpib.qty, 0)) as total_amount,
                   AVG(tpib.bid_price) as avg_bid_price
             FROM trade_product_bidding tpib
             INNER JOIN trade_product tp ON tp.id = tpib.trade_product_id
             WHERE tpib.is_deleted = false AND tpib.is_active = true AND tpib.buyer_id = $1
             ${prod_cat_id ? `AND tp.prod_cat_id = ${prod_cat_id}` : ''}
             AND EXTRACT(YEAR FROM tpib.bid_date) = $2
             GROUP BY tpib.bid_status, tp.prod_cat_id
             ORDER BY tpib.bid_status`;
      result = await db.query(req.dbName, sql, [buyer_id, year]);
      
      if (result.rows.length > 0) {
        return res.json({ success: 1, data: result.rows, message: 'Listed_Successfully' });
      } else {
        return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
      }
    }
  } catch (error) {
    logger.error('My stats error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const getHomeFilter = async (req, res) => {
  try {
    const report_filter = [
      { id: 1, title: 'Year', value: new Date().getFullYear().toString() },
      { id: 2, title: 'Month', value: (new Date().getMonth() + 1).toString().padStart(2, '0') },
      { id: 3, title: 'Day', value: new Date().getDate().toString().padStart(2, '0') }
    ];
    return res.json({ success: 1, data: report_filter, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get home filter error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const addTradeProductRating = async (req, res) => {
  try {
    const { buyer_id, trade_product_id, rating_id, seller_id } = req.body;
    
    if (!buyer_id || !rating_id) {
      return res.json({ status: 0, data: [], message: 'Missing_Parameter' });
    }
    
    const checkSql = `SELECT * FROM trade_product_rating WHERE buyer_id = $1 AND ${trade_product_id ? 'trade_product_id = $2' : 'seller_id = $2 AND trade_product_id = 0'}`;
    const checkResult = await db.query(req.dbName, checkSql, [buyer_id, trade_product_id || seller_id]);
    
    if (checkResult.rows.length > 0) {
      const updateSql = `UPDATE trade_product_rating SET rating_id = $1, updated_on = $2 WHERE buyer_id = $3 AND ${trade_product_id ? 'trade_product_id = $4' : 'seller_id = $4'}`;
      await db.query(req.dbName, updateSql, [rating_id, new Date(), buyer_id, trade_product_id || seller_id]);
      return res.json({ status: 1, data: true, message: 'Updated_Successfully' });
    } else {
      const insertSql = `INSERT INTO trade_product_rating (buyer_id, trade_product_id, seller_id, rating_id, created_on) VALUES ($1, $2, $3, $4, $5)`;
      await db.query(req.dbName, insertSql, [buyer_id, trade_product_id || 0, seller_id, rating_id, new Date()]);
      return res.json({ status: 1, data: true, message: 'Added_Successfully' });
    }
  } catch (error) {
    logger.error('Add rating error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Processing_Rating' });
  }
};

const showBuyerRating = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    
    if (!buyer_id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }
    
    const sql = `SELECT buyer_id, COUNT(CASE WHEN rating_id = '1' THEN 1 END) as happy_count,
                 COUNT(CASE WHEN rating_id = '2' THEN 1 END) as average_count,
                 COUNT(CASE WHEN rating_id = '3' THEN 1 END) as poor_count
                 FROM trade_product_rating
                 WHERE buyer_id = $1 AND is_deleted = false AND trade_product_id = 0
                 GROUP BY buyer_id`;
    
    const result = await db.query(req.dbName, sql, [buyer_id]);
    
    const data = result.rows.length > 0 ? result.rows[0] : { buyer_id, happy_count: 0, average_count: 0, poor_count: 0 };
    return res.json({ status: 1, data, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Show buyer rating error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Fetching_Data' });
  }
};

const deleteBuyer = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    
    const updateSql = `UPDATE client SET is_active = false, is_deleted = true, deleted_on = $1, deleted_by_id = $2, is_login = false, device_id = NULL WHERE id = $3`;
    await db.query(req.dbName, updateSql, [new Date(), buyer_id, buyer_id]);
    
    return res.json({ success: 1, data: [], message: 'Your account deletion request has been submitted. Once the admin verifies it, your account will be deleted from our platform.' });
  } catch (error) {
    logger.error('Delete buyer error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Error_Deleting_Account' });
  }
};

const logoutBuyer = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    
    const checkSql = `SELECT id, phone FROM client WHERE is_deleted = true AND id = $1`;
    const checkResult = await db.query(req.dbName, checkSql, [buyer_id]);
    
    if (checkResult.rows.length > 0) {
      return res.json({ success: 1, data: [], message: 'Your account has already been deleted from our platform.' });
    }
    
    const updateSql = `UPDATE client SET is_login = false, device_id = NULL WHERE id = $1`;
    await db.query(req.dbName, updateSql, [buyer_id]);
    
    return res.json({ success: 1, data: [], message: 'Logout_Successfully' });
  } catch (error) {
    logger.error('Logout buyer error', { error: error.message });
    return res.json({ success: 0, data: [], message: 'Logout_Failed' });
  }
};

const logoutCheck = async (req, res) => {
  try {
    const { phone } = req.params;
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    
    const updateSql = `UPDATE client SET is_login = false, device_id = NULL WHERE phone::varchar = $1::varchar AND is_active = true AND is_deleted = false`;
    await db.query(req.dbName, updateSql, [cleanPhone]);
    
    return res.json({ success: 1, error: 0, status: 1, data: null, message: 'Logout_Successfully' });
  } catch (error) {
    logger.error('Logout check error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Logout_Failed' });
  }
};

module.exports = {
  isUserRegistered,
  registerOTP,
  tradeProduct,
  manageProduct,
  tradeProductBidding,
  buyerAction,
  addInterestOnProduct,
  newProduct,
  trendingProduct,
  myStats,
  getHomeFilter,
  addTradeProductRating,
  showBuyerRating,
  deleteBuyer,
  logoutBuyer,
  logoutCheck
};
