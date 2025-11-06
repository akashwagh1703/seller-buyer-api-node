const { query } = require('../config/database');

const findByPhone = async (dbName, phone) => {
  const sql = 'SELECT * FROM client WHERE is_deleted = false AND phone::varchar = $1::varchar';
  const result = await query(dbName, sql, [phone]);
  return result.rows[0];
};

const createUser = async (dbName, userData) => {
  const { phone, opt_number, first_name, last_name, email, gender, dob, device_id, referral_code, password, group_id, is_whitelabeled, client_type, app_user_type } = userData;
  
  const sql = `INSERT INTO client (phone, opt_number, first_name, last_name, email, gender, dob, device_id, referral_code, password, group_id, group_ids, is_whitelabeled, client_type, app_user_type, is_active, my_refferal_code, created_on) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true, $16, NOW()) 
               RETURNING id, COALESCE(active_step, 1) as active_step`;
  
  const myRefCode = Date.now().toString();
  const result = await query(dbName, sql, [phone, opt_number, first_name, last_name, email, gender, dob, device_id, referral_code, password, group_id, group_id, is_whitelabeled, client_type, app_user_type, myRefCode]);
  return result.rows[0];
};

const updateOTP = async (dbName, phone, otp) => {
  const sql = 'UPDATE client SET opt_number = $1 WHERE phone::varchar = $2::varchar AND is_deleted = false RETURNING id';
  const result = await query(dbName, sql, [otp, phone]);
  return result.rows[0];
};

const updateLoginData = async (dbName, userId, loginData) => {
  const { latitude, longitude, city_name, device_id, loc_addresss } = loginData;
  const sql = `UPDATE client SET latitude = $1, longitude = $2, city_name = $3, device_id = $4, loc_addresss = $5, is_login = true, is_online = true, login_count = login_count + 1 
               WHERE id = $6 RETURNING *`;
  const result = await query(dbName, sql, [latitude, longitude, city_name, device_id, loc_addresss, userId]);
  return result.rows[0];
};

const updateProfile = async (dbName, userId, profileData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(profileData).forEach(key => {
    if (profileData[key] !== undefined && profileData[key] !== null) {
      fields.push(`${key} = $${paramCount}`);
      values.push(profileData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  values.push(userId);
  const sql = `UPDATE client SET ${fields.join(', ')}, updated_on = NOW() WHERE id = $${paramCount} RETURNING *`;
  const result = await query(dbName, sql, values);
  return result.rows[0];
};

module.exports = { findByPhone, createUser, updateOTP, updateLoginData, updateProfile };
