const usersService = require('../services/usersService');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const registerOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.json({ success: 0, error: 1, status: 1, data: {}, message: 'Missing_Parameter' });
    }
    
    const result = await usersService.registerOTP(req.dbName, req.body, req.domain);
    
    if (!result.success) {
      return res.json({ 
        success: 0, 
        error: 1, 
        status: 1, 
        data: 'NULL', 
        user_id: result.userId, 
        active_step: result.activeStep, 
        message: result.message 
      });
    }

    return res.json({ 
      success: 1, 
      error: 0, 
      status: 1, 
      data: result.data || {}, 
      message: 'Register_Successfully', 
      opt_number: result.otp, 
      user_id: result.userId, 
      active_step: result.activeStep 
    });
  } catch (error) {
    logger.error('Register OTP error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, error: 1, status: 1, data: {}, message: error.message || 'Registration_Failed' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await usersService.verifyOTP(req.dbName, phone, otp);
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }

    sendSuccess(res, { user: result.user }, 'OTP_Matched');
  } catch (error) {
    logger.error('Verify OTP error', { error: error.message });
    sendError(res, 'Invalid_Otp', 400);
  }
};

const loginOTP = async (req, res) => {
  try {
    const { phone, otp, latitude, longitude, city_name, device_id, loc_addresss } = req.body;
    
    if (!phone || !otp) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Missing_Parameter' });
    }
    
    const result = await usersService.loginWithOTP(req.dbName, phone, otp, { latitude, longitude, city_name, device_id, loc_addresss });
    
    if (!result.success) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: result.message, db_otp: result.db_otp });
    }

    const user = result.user;
    const userData = {
      token: result.token,
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address1: user.address1,
      address2: user.address2,
      city: user.city,
      postcode: user.postcode,
      country_name: user.country_name,
      state_name: user.state_name,
      branch_name: user.branch_name,
      bank_name: user.bank_name,
      state: user.state,
      acc_no: user.acc_no,
      ifsc_code: user.ifsc_code,
      village: user.village,
      pan_no: user.pan_no,
      gst_no: user.gst_no,
      company: user.company,
      profile_status: user.profile_status,
      document_status: user.document_status,
      user_type: user.app_user_type == 1 ? 'client' : 'farmer',
      profile_image: user.profile_image,
      pan_no_doc: user.pan_no_doc,
      aadhar_no_doc: user.aadhar_no_doc,
      aadhar_no: user.aadhar_no,
      group_id: user.group_id,
      dob: user.dob,
      gender: user.gender,
      logged_in: true,
      is_login: true,
      my_refferal_code: user.my_refferal_code,
      iot_device_url: user.iot_device_url,
      ACCESS_TOKEN: new Date().toISOString(),
      countries: result.countries || [],
      is_whitelabeled: user.is_whitelabeled,
      is_video_enable: user.is_video_enable,
      is_chat_enable: user.is_chat_enable,
      pacs_master_id: user.pacs_master_id,
      society_master_id: user.society_master_id,
      bank_master_id: user.bank_master_id,
      group_ids: user.group_ids,
      app_user_type: user.app_user_type,
      active_step: user.active_step
    };

    const config_url = result.config_url || {};
    const whitelabel_data = result.whitelabel_data || [];
    const menu = result.menu || [];
    
    res.setHeader('Authorization', result.token);
    return res.json({
      success: 1,
      error: 0,
      status: 1,
      data: userData,
      message: 'Login_Successfully',
      config_url,
      whitelabel_data,
      menu,
      ekyc_enable: result.ekyc_enable || '0'
    });
  } catch (error) {
    logger.error('Login OTP error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Login_Failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sql = `SELECT * FROM client WHERE id = $1 AND is_deleted = false`;
    const result = await require('../config/database').query(req.dbName, sql, [userId]);
    
    if (!result.rows.length) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: 'User_Not_Found' });
    }

    const user = result.rows[0];
    return res.json({ success: 1, error: 0, status: 1, data: { user }, message: 'Profile_Retrieved' });
  } catch (error) {
    logger.error('Get profile error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Error_Retrieving_Profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    logger.info('Update profile request', { body: req.body });
    const { id, ...profileData } = req.body;
    
    if (!id) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Missing_Parameter' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(profileData).forEach(key => {
      if (key !== 'updated_on' && profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(profileData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: 'No_Data_To_Update' });
    }

    updateFields.push('updated_on = NOW()');
    values.push(id);
    const sql = `UPDATE client SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    logger.info('Update SQL', { sql, values });
    const result = await require('../config/database').query(req.dbName, sql, values);
    
    if (!result.rows.length) {
      return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Not_Able_Update' });
    }

    return res.json({ success: 1, error: 0, status: 1, data: { user: result.rows[0] }, message: 'Updated_Successfully' });
  } catch (error) {
    logger.error('Update profile error', { error: error.message, stack: error.stack });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: error.message || 'Not_Able_Update' });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    
    const otp = require('../utils/otp').generateOTP(cleanPhone);
    const updated = await require('../models/usersModel').updateOTP(req.dbName, cleanPhone, otp);
    
    if (!updated) {
      return sendError(res, 'Not_Register', 400);
    }

    if (cleanPhone !== '9876543210' && cleanPhone !== '9976543210') {
      const smsText = `Your OTP for Famrut is: ${otp}. Please enter it on the app to confirm your account. Thanks for using Famrut`;
      await require('../utils/sms').sendSMS(cleanPhone, smsText);
    }

    sendSuccess(res, { opt_number: otp }, 'OTP_Reset_Successfully');
  } catch (error) {
    logger.error('Resend OTP error', { error: error.message });
    sendError(res, 'OTP_Reset_Failed', 500);
  }
};

const isUserRegistered = async (req, res) => {
  try {
    logger.info('isUserRegistered request', { body: req.body, headers: req.headers });
    const { phone } = req.body;
    const domain = req.domain || '';
    const isSeller = domain.toLowerCase().includes('seller');
    
    // Get config data (hardcoded for now, should come from config table)
    const show_referral = '0';
    const registration_lock = '0';
    const registration_lock_messge = '';
    const app_user_type = '0';
    const step_list = isSeller ? ['Registration', 'Profile', 'Complete'] : ['Registration', 'Complete'];
    
    if (!phone) {
      return res.json({
        success: 0,
        error: 1,
        status: 1,
        data: [],
        message: 'Missing_Parameter',
        app_user_type,
        show_referral,
        registration_lock,
        registration_lock_messge
      });
    }
    
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    const sql = `SELECT *, 
                 (SELECT name FROM cities_new WHERE id::varchar = client.city) as new_city_name,
                 (SELECT name FROM states_new WHERE id::varchar = client.state) as new_state_name 
                 FROM client WHERE is_deleted = false AND phone::varchar = $1::varchar`;
    
    const result = await require('../config/database').query(req.dbName, sql, [cleanPhone]);
    const user = result.rows[0];
    
    if (user) {
      const is_profile_complete = user.active_step == 3 ? 1 : 0;
      
      // Check seller login restriction
      if (user.client_type && isSeller) {
        if (parseInt(user.client_type) === 2) {
          if (user.is_active) {
            return res.json({
              success: 1,
              error: 0,
              status: 1,
              data: result.rows,
              step_list,
              message: 'Already_Register',
              is_registered: 1,
              app_user_type,
              show_referral,
              is_profile_complete,
              registration_lock,
              registration_lock_messge
            });
          } else {
            return res.json({
              success: 1,
              error: 0,
              status: 0,
              data: null,
              step_list,
              message: 'Mobile_Deactivated',
              is_registered: 1,
              app_user_type,
              show_referral,
              is_profile_complete,
              registration_lock,
              registration_lock_messge
            });
          }
        } else {
          return res.json({
            success: 0,
            error: 1,
            status: 1,
            data: [],
            message: 'Seller_Login_Failed',
            app_user_type,
            show_referral,
            registration_lock,
            registration_lock_messge
          });
        }
      } else {
        // Normal flow (buyer or no client_type check)
        if (user.is_active) {
          return res.json({
            success: 1,
            error: 0,
            status: 1,
            data: result.rows,
            step_list,
            message: 'Already_Register',
            is_registered: 1,
            app_user_type,
            show_referral,
            is_profile_complete,
            registration_lock,
            registration_lock_messge
          });
        } else {
          return res.json({
            success: 1,
            error: 0,
            status: 0,
            data: null,
            step_list,
            message: 'Mobile_Deactivated',
            is_registered: 1,
            app_user_type,
            show_referral,
            is_profile_complete,
            registration_lock,
            registration_lock_messge
          });
        }
      }
    } else {
      // User not found
      return res.json({
        success: 1,
        error: 0,
        status: 0,
        data: null,
        step_list,
        message: 'Not_Register',
        is_registered: 0,
        app_user_type,
        show_referral,
        is_profile_complete: 0,
        registration_lock,
        registration_lock_messge
      });
    }
  } catch (error) {
    logger.error('Check user error', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: 0,
      error: 1,
      status: 500,
      data: null,
      message: error.message || 'Error_Checking_User'
    });
  }
};

const logoutCheck = async (req, res) => {
  try {
    const { phone } = req.params;
    const cleanPhone = phone.replace(/\s+/g, '').slice(-10);
    
    const sql = `UPDATE client SET is_login = false, is_online = false, device_id = NULL WHERE phone::varchar = $1::varchar AND is_deleted = false`;
    await require('../config/database').query(req.dbName, sql, [cleanPhone]);
    
    // Disconnect any active emeeting calls
    const meetingSql = `UPDATE emeeting SET meeting_status_id = 4, meeting_end_from = 1, updated_on = NOW() 
                        WHERE farmer_id = (SELECT id FROM client WHERE phone::varchar = $1::varchar) 
                        AND meeting_status_id != 4`;
    await require('../config/database').query(req.dbName, meetingSql, [cleanPhone]);
    
    return res.json({ success: 1, error: 0, status: 1, data: null, message: 'Logout_Successfully' });
  } catch (error) {
    logger.error('Logout error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: null, message: 'Logout_Failed' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await require('../models/usersModel').findByPhone(req.dbName, username);
    
    if (!user) {
      return sendError(res, 'User_Not_Found', 404);
    }
    
    // Password verification would go here
    const token = require('../utils/jwt').generateToken({ userId: user.id, phone: user.phone });
    res.setHeader('Authorization', token);
    sendSuccess(res, { token, user }, 'Login_Successfully');
  } catch (error) {
    logger.error('Login error', { error: error.message });
    sendError(res, 'Login_Failed', 500);
  }
};

const register = async (req, res) => {
  try {
    const result = await usersService.registerOTP(req.dbName, req.body);
    if (!result.success) {
      return sendError(res, result.message, 400);
    }
    sendSuccess(res, { user_id: result.userId }, 'Register_Successfully');
  } catch (error) {
    logger.error('Register error', { error: error.message });
    sendError(res, 'Registration_Failed', 500);
  }
};

const getMasterData = async (req, res) => {
  try {
    const constants = require('../config/constants');
    sendSuccess(res, constants, 'Master_Data_Retrieved');
  } catch (error) {
    logger.error('Master data error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const aboutUs = async (req, res) => {
  try {
    const data = {
      phone1: '+91 9607005004',
      email: 'getintouch@famrut.com',
      address: 'Plot No. B-24 & 25, NICE Industrial Area, Satpur MIDC, Nashik 422 007',
      about_us: 'Famrut App provides agri related business services...'
    };
    sendSuccess(res, data, 'About_Us_Retrieved');
  } catch (error) {
    logger.error('About us error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const categories = async (req, res) => {
  try {
    const sql = 'SELECT cat_id, name, logo, name_mr, mob_icon FROM categories WHERE is_deleted = false AND is_active = true ORDER BY seq ASC';
    const result = await require('../config/database').query(req.dbName, sql, []);
    sendSuccess(res, result.rows, 'Listed_Successfully');
  } catch (error) {
    logger.error('Categories error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getStates = async (req, res) => {
  try {
    const sql = 'SELECT id, name FROM states_new WHERE is_deleted = false ORDER BY name ASC';
    const result = await require('../config/database').query(req.dbName, sql, []);
    return res.json({ success: 1, error: 0, status: 1, data: result.rows, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get states error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: [], message: 'Error_Retrieving_Data' });
  }
};

const getCities = async (req, res) => {
  try {
    const { state_id } = req.params;
    const sql = 'SELECT id, name FROM cities_new WHERE state_id = $1 AND is_deleted = false ORDER BY name ASC';
    const result = await require('../config/database').query(req.dbName, sql, [state_id]);
    return res.json({ success: 1, error: 0, status: 1, data: result.rows, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get cities error', { error: error.message });
    return res.json({ success: 0, error: 1, status: 1, data: [], message: 'Error_Retrieving_Data' });
  }
};

module.exports = { registerOTP, verifyOTP, loginOTP, getProfile, updateProfile, resendOTP, isUserRegistered, logoutCheck, login, register, getMasterData, aboutUs, categories, getStates, getCities };
