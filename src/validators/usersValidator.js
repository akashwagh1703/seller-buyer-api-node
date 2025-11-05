const { body, validationResult } = require('express-validator');

const registerOTPRules = [
  body('phone').notEmpty().withMessage('Phone is required').isMobilePhone().withMessage('Invalid phone number'),
  body('btn_submit').equals('submit').withMessage('Invalid submission')
];

const verifyOTPRules = [
  body('phone').notEmpty().withMessage('Phone is required'),
  body('otp').notEmpty().withMessage('OTP is required').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

const updateProfileRules = [
  body('id').notEmpty().withMessage('User ID is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: true,
      status: 400,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = { registerOTPRules, verifyOTPRules, updateProfileRules, validate };
