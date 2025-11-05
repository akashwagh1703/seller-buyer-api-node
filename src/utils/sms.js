const axios = require('axios');
const logger = require('./logger');

const sendSMS = async (mobile, message, smsType = 'NERACE_OTP_Mobile_Verification') => {
  try {
    const response = await axios.post(process.env.SMS_API_URL, {
      mobile,
      message,
      type: smsType
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    logger.info('SMS sent successfully', { mobile, smsType });
    return { success: true, data: response.data };
  } catch (error) {
    logger.error('SMS sending failed', { mobile, error: error.message });
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
