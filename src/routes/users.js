const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { registerOTPRules, verifyOTPRules, updateProfileRules, validate } = require('../validators/usersValidator');
const { verifyToken, optionalAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/users/register_otp:
 *   post:
 *     summary: Register new user and send OTP
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - btn_submit
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               btn_submit:
 *                 type: string
 *                 example: "submit"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/register_otp', registerOTPRules, validate, usersController.registerOTP);

/**
 * @swagger
 * /api/v16/users/verify_otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "643215"
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verify_otp', verifyOTPRules, validate, usersController.verifyOTP);

/**
 * @swagger
 * /api/v16/users/login_otp:
 *   post:
 *     summary: Login with OTP
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login_otp', verifyOTPRules, validate, usersController.loginOTP);

/**
 * @swagger
 * /api/v16/users/resend_otp:
 *   post:
 *     summary: Resend OTP (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent
 *       401:
 *         description: Unauthorized
 */
router.post('/resend_otp', verifyToken, usersController.resendOTP);

/**
 * @swagger
 * /api/v16/users/profile:
 *   get:
 *     summary: Get user profile (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: Profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, usersController.getProfile);

/**
 * @swagger
 * /api/v16/users/update_profile:
 *   post:
 *     summary: Update user profile (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.post('/update_profile', verifyToken, updateProfileRules, validate, usersController.updateProfile);

/**
 * @swagger
 * /api/v16/users/is_user_regsitered:
 *   post:
 *     summary: Check if user is registered
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User status
 */
router.post('/is_user_regsitered', usersController.isUserRegistered);

/**
 * @swagger
 * /api/v16/users/logout_check/{phone}:
 *   get:
 *     summary: Logout user (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get('/logout_check/:phone', verifyToken, usersController.logoutCheck);

/**
 * @swagger
 * /api/v16/users/login:
 *   post:
 *     summary: Login with username/password
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', usersController.login);

/**
 * @swagger
 * /api/v16/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 */
router.post('/register', usersController.register);

/**
 * @swagger
 * /api/v16/users/master_data:
 *   get:
 *     summary: Get master data (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: Master data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/master_data', verifyToken, usersController.getMasterData);

/**
 * @swagger
 * /api/v16/users/about_us:
 *   get:
 *     summary: Get about us information (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: About us data
 *       401:
 *         description: Unauthorized
 */
router.get('/about_us', verifyToken, usersController.aboutUs);

/**
 * @swagger
 * /api/v16/users/categories:
 *   get:
 *     summary: Get categories list (Protected)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: seller
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: Categories list
 *       401:
 *         description: Unauthorized
 */
router.get('/categories', verifyToken, usersController.categories);

module.exports = router;
