const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const getStates = async (req, res) => {
  try {
    const { country_id } = req.body;
    
    let sql = 'SELECT * FROM states_new WHERE is_deleted = false';
    const params = [];
    
    if (country_id) {
      sql += ' AND country_id = $1';
      params.push(country_id);
    }
    
    sql += ' ORDER BY name ASC';
    
    const result = await query(req.dbName, sql, params);
    
    if (result.rows.length > 0) {
      sendSuccess(res, 'States_Listed_Successfully', result.rows);
    } else {
      sendError(res, 'No_States_Found', 404);
    }
  } catch (error) {
    logger.error('Get states error', { error: error.message });
    sendError(res, 'Error_Retrieving_States', 500);
  }
};

const getCities = async (req, res) => {
  try {
    const { state_id } = req.body;
    
    if (!state_id) {
      return sendError(res, 'State_ID_Required', 400);
    }
    
    const sql = `
      SELECT * FROM cities_new 
      WHERE state_id = $1 AND is_deleted = false 
      ORDER BY name ASC
    `;
    
    const result = await query(req.dbName, sql, [state_id]);
    
    if (result.rows.length > 0) {
      sendSuccess(res, 'Cities_Listed_Successfully', result.rows);
    } else {
      sendError(res, 'No_Cities_Found', 404);
    }
  } catch (error) {
    logger.error('Get cities error', { error: error.message });
    sendError(res, 'Error_Retrieving_Cities', 500);
  }
};

const getCountries = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM countries 
      WHERE is_deleted = false 
      ORDER BY name ASC
    `;
    
    const result = await query(req.dbName, sql, []);
    
    if (result.rows.length > 0) {
      sendSuccess(res, 'Countries_Listed_Successfully', result.rows);
    } else {
      sendError(res, 'No_Countries_Found', 404);
    }
  } catch (error) {
    logger.error('Get countries error', { error: error.message });
    sendError(res, 'Error_Retrieving_Countries', 500);
  }
};

const checkReferralCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      return sendError(res, 'Referral_Code_Required', 400);
    }
    
    // Check in users table
    let sql = `
      SELECT first_name, phone_no, first_name, last_name 
      FROM users 
      WHERE (phone_no = $1 OR my_refferal_code = $1) 
        AND is_active = true AND is_deleted = false 
      LIMIT 1
    `;
    
    let result = await query(req.dbName, sql, [code]);
    
    if (result.rows.length > 0) {
      return sendSuccess(res, 'Referral_Code_Found', result.rows[0]);
    }
    
    // Check in client table
    sql = `
      SELECT first_name, phone, middle_name, last_name 
      FROM client 
      WHERE (phone = $1 OR my_refferal_code = $1) 
        AND is_active = true AND is_deleted = false 
      LIMIT 1
    `;
    
    result = await query(req.dbName, sql, [code]);
    
    if (result.rows.length > 0) {
      return sendSuccess(res, 'Referral_Code_Found', result.rows[0]);
    }
    
    // Check in client_group_master table
    sql = `
      SELECT name 
      FROM client_group_master 
      WHERE referral_code = $1 
        AND is_active = true AND is_deleted = false 
      LIMIT 1
    `;
    
    result = await query(req.dbName, sql, [code]);
    
    if (result.rows.length > 0) {
      return sendSuccess(res, 'Referral_Code_Found', result.rows[0]);
    }
    
    sendError(res, 'Invalid_Referral_Code', 404);
  } catch (error) {
    logger.error('Check referral code error', { error: error.message });
    sendError(res, 'Error_Checking_Referral_Code', 500);
  }
};

const generateReferralCode = async (req, res) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return sendError(res, 'Mobile_Number_Required', 400);
    }
    
    const insert = {
      mobile,
      created_on: new Date()
    };
    
    const sql = 'INSERT INTO request_invitation (mobile, created_on) VALUES ($1, $2) RETURNING id';
    const result = await query(req.dbName, sql, [mobile, insert.created_on]);
    
    if (result.rows.length > 0) {
      const timestamp = Date.now();
      const refCode = '9607005004';
      const referralCode = `${refCode}-${timestamp}`;
      
      const response = {
        referral_code: referralCode,
        request_id: result.rows[0].id
      };
      
      sendSuccess(res, 'Referral_Code_Generated', response);
    } else {
      sendError(res, 'Failed_To_Generate_Code', 500);
    }
  } catch (error) {
    logger.error('Generate referral code error', { error: error.message });
    sendError(res, 'Error_Generating_Referral_Code', 500);
  }
};

const requestInvitation = async (req, res) => {
  try {
    const { mobile, device_id } = req.body;
    
    if (!mobile || !device_id) {
      return sendError(res, 'Mobile_And_Device_ID_Required', 400);
    }
    
    const phone = mobile.replace(/\s+/g, '').slice(-10);
    
    // Check if already exists
    const checkSql = 'SELECT id FROM client WHERE phone = $1';
    const existingResult = await query(req.dbName, checkSql, [phone]);
    
    if (existingResult.rows.length > 0) {
      return sendSuccess(res, 'Referral_Code_Request_Already_Sent', null);
    }
    
    const insert = {
      mobile,
      device_id,
      created_on: new Date()
    };
    
    const sql = 'INSERT INTO request_invitation (mobile, device_id, created_on) VALUES ($1, $2, $3) RETURNING id';
    const result = await query(req.dbName, sql, [mobile, device_id, insert.created_on]);
    
    if (result.rows.length > 0) {
      // Send SMS notification (implement SMS service)
      const smsText = 'Thank you for downloading Famrut App. We will send the referral code soon.';
      
      // Send email notification (implement email service)
      // this.Email_model.send_mail(...)
      
      sendSuccess(res, 'Invitation_Request_Submitted', { request_id: result.rows[0].id });
    } else {
      sendError(res, 'Failed_To_Submit_Request', 500);
    }
  } catch (error) {
    logger.error('Request invitation error', { error: error.message });
    sendError(res, 'Error_Submitting_Request', 500);
  }
};

module.exports = {
  getStates,
  getCities,
  getCountries,
  checkReferralCode,
  generateReferralCode,
  requestInvitation
};