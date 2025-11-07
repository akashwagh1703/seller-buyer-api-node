const usersService = require('../services/usersService');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/jwt');

const createUser = asyncHandler(async (req, res) => {
  const phone = req.body.phone;
  const user = await require('../models/usersModel').findByPhone(req.dbName, phone);
  
  if (!user) {
    const result = await usersService.registerOTP(req.dbName, req.body);
    if (!result.success) {
      throw new Error(result.message);
    }
    res.json({ user_id: result.userId, active_step: result.activeStep, opt_number: result.otp });
  } else {
    throw new Error(`User ${phone} Already Exists`);
  }
});

const registerOTP = createUser;

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
    const result = await usersService.loginWithOTP(req.dbName, phone, otp, { latitude, longitude, city_name, device_id, loc_addresss });
    
    if (!result.success) {
      return sendError(res, result.message, 400);
    }

    const userData = {
      token: result.token,
      user_id: result.user.id,
      first_name: result.user.first_name,
      last_name: result.user.last_name,
      email: result.user.email,
      phone: result.user.phone,
      profile_image: result.user.profile_image,
      group_id: result.user.group_id,
      app_user_type: result.user.app_user_type,
      active_step: result.user.active_step,
      logged_in: true
    };

    res.setHeader('Authorization', result.token);
    sendSuccess(res, userData, 'Login_Successfully');
  } catch (error) {
    logger.error('Login OTP error', { error: error.message });
    sendError(res, 'Login_Failed', 400);
  }
};

const getProfile = async (req, res) => {
  try {
    // req.user is already the full user object from auth middleware
    const user = req.user;
    
    if (!user) {
      return sendError(res, 'User_Not_Found', 404);
    }

    sendSuccess(res, { user }, 'Profile_Retrieved');
  } catch (error) {
    logger.error('Get profile error', { error: error.message });
    sendError(res, 'Error_Retrieving_Profile', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, ...profileData } = req.body;
    const updatedUser = await usersService.updateUserProfile(req.dbName, id, profileData);
    
    if (!updatedUser) {
      return sendError(res, 'Not_Able_Update', 400);
    }

    sendSuccess(res, { user: updatedUser }, 'Updated_Successfully');
  } catch (error) {
    logger.error('Update profile error', { error: error.message });
    sendError(res, 'Not_Able_Update', 500);
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
    await require('../models/usersModel').updateProfile(req.dbName, cleanPhone, { is_login: false, device_id: null });
    sendSuccess(res, null, 'Logout_Successfully');
  } catch (error) {
    logger.error('Logout error', { error: error.message });
    sendError(res, 'Logout_Failed', 500);
  }
};

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const usersModel = require('../models/usersModel');
  
  const user = await usersModel.findByPhone(req.dbName, username);
  const { verifyPassword } = require('../utils/password');
  const encryptionKey = process.env.ENCRYPTION_KEY || 'your_encryption_key';
  
  if (user && verifyPassword(password, user.password, encryptionKey)) {
    res.json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

const login = loginUserCtrl;

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

module.exports = { registerOTP, verifyOTP, loginOTP, getProfile, updateProfile, resendOTP, isUserRegistered, logoutCheck, login, register, getMasterData, aboutUs, categories };
