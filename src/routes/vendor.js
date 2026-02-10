const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/vendor/is_vendor_regsitered:
 *   post:
 *     summary: Check if vendor is registered
 *     tags: [Vendor]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_no
 *               - app_user_type
 *             properties:
 *               phone_no:
 *                 type: string
 *                 example: "9876543210"
 *               app_user_type:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Registration status
 */
router.post('/is_vendor_regsitered', vendorController.isVendorRegistered);

/**
 * @swagger
 * /api/v16/vendor/register_vendor:
 *   post:
 *     summary: Register new vendor
 *     tags: [Vendor]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - btn_submit
 *               - phone_no
 *               - first_name
 *               - last_name
 *             properties:
 *               btn_submit:
 *                 type: string
 *                 example: "submit"
 *               phone_no:
 *                 type: string
 *                 example: "9876543210"
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               user_type:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vendor registered successfully
 */
router.post('/register_vendor', vendorController.registerVendor);

/**
 * @swagger
 * /api/v16/vendor/login_otp:
 *   post:
 *     summary: Login with OTP
 *     tags: [Vendor]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - btn_submit
 *               - phone
 *               - otp
 *               - app_user_type
 *             properties:
 *               btn_submit:
 *                 type: string
 *                 example: "submit"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               app_user_type:
 *                 type: integer
 *                 example: 1
 *               device_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login_otp', vendorController.loginWithOTP);

/**
 * @swagger
 * /api/v16/vendor/resend_otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Vendor]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - app_user_type
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               app_user_type:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/resend_otp', vendorController.resendOTP);

/**
 * @swagger
 * /api/v16/vendor/order_filters:
 *   post:
 *     summary: Get order filter options
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               app_user_type:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order filters retrieved
 */
router.post('/order_filters', verifyToken, vendorController.getOrderFilters);

/**
 * @swagger
 * /api/v16/vendor/order_list:
 *   post:
 *     summary: Get order list
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partner_id:
 *                 type: integer
 *               pickup_location_id:
 *                 type: integer
 *               status:
 *                 type: string
 *               order_num:
 *                 type: string
 *               start:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Order list retrieved
 */
router.post('/order_list', verifyToken, vendorController.getOrderList);

/**
 * @swagger
 * /api/v16/vendor/order_details/{order_id}:
 *   get:
 *     summary: Get order details
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details retrieved
 */
router.get('/order_details/:order_id', verifyToken, vendorController.getOrderDetails);

/**
 * @swagger
 * /api/v16/vendor/update_order_status:
 *   post:
 *     summary: Update order status
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *               remark:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               transaction_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.post('/update_order_status', verifyToken, vendorController.updateOrderStatus);

/**
 * @swagger
 * /api/v16/vendor/profile/{id}:
 *   get:
 *     summary: Get vendor profile
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
router.get('/profile/:id', verifyToken, vendorController.getVendorProfile);

/**
 * @swagger
 * /api/v16/vendor/dashboard/{partner_id}:
 *   get:
 *     summary: Get vendor dashboard
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: partner_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard/:partner_id', verifyToken, vendorController.getVendorDashboard);

/**
 * @swagger
 * /api/v16/vendor/enquiry_list/{vendor_id}:
 *   get:
 *     summary: Get enquiry list
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enquiry list retrieved
 */
router.get('/enquiry_list/:vendor_id', verifyToken, vendorController.getEnquiryList);

/**
 * @swagger
 * /api/v16/vendor/user_types:
 *   get:
 *     summary: Get user types
 *     tags: [Vendor]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User types retrieved
 */
router.get('/user_types', vendorController.getUserTypes);

/**
 * @swagger
 * /api/v16/vendor/logout/{phone_number}:
 *   get:
 *     summary: Logout vendor
 *     tags: [Vendor]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: phone_number
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout/:phone_number', verifyToken, vendorController.logoutVendor);

module.exports = router;
