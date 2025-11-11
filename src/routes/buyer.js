const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/buyer/is_user_regsitered:
 *   post:
 *     summary: Check if user is registered
 *     tags: [Buyer]
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
 *         description: User registration status
 */
router.post('/is_user_regsitered', buyerController.isUserRegistered);

/**
 * @swagger
 * /api/v16/buyer/register_otp:
 *   post:
 *     summary: Register user with OTP
 *     tags: [Buyer]
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
 *               btn_submit:
 *                 type: string
 *                 example: "submit"
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
 *         description: Registration OTP sent
 */
router.post('/register_otp', buyerController.registerOTP);

/**
 * @swagger
 * /api/v16/buyer/trade_product:
 *   post:
 *     summary: Get trade products for buyers (Protected)
 *     tags: [Buyer]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               prod_name:
 *                 type: string
 *               prod_variety:
 *                 type: integer
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               buyer_id:
 *                 type: integer
 *               start:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Trade products for buyers
 */
router.post('/trade_product', verifyToken, buyerController.getTradeProducts);

/**
 * @swagger
 * /api/v16/buyer/manage_product:
 *   post:
 *     summary: Manage product listings (Protected)
 *     tags: [Buyer]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyer_id:
 *                 type: integer
 *               start:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Managed products list
 */
router.post('/manage_product', verifyToken, buyerController.manageProduct);

/**
 * @swagger
 * /api/v16/buyer/trade_product_bidding:
 *   post:
 *     summary: Place bid on trade product (Protected)
 *     tags: [Buyer]
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
 *               product_id:
 *                 type: integer
 *               buyer_id:
 *                 type: integer
 *               qty:
 *                 type: number
 *               qty_unit:
 *                 type: integer
 *               bid_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bid placed successfully
 */
router.post('/trade_product_bidding', verifyToken, buyerController.placeBid);

/**
 * @swagger
 * /api/v16/buyer/buyer_action:
 *   post:
 *     summary: Buyer action on bid (Protected)
 *     tags: [Buyer]
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
 *               status:
 *                 type: string
 *               product_id:
 *                 type: integer
 *               seller_id:
 *                 type: integer
 *               buyer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buyer action completed
 */
router.post('/buyer_action', verifyToken, buyerController.buyerAction);

/**
 * @swagger
 * /api/v16/buyer/add_interest_onproduct:
 *   post:
 *     summary: Add interest on product (Protected)
 *     tags: [Buyer]
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
 *               buyer_id:
 *                 type: integer
 *               trade_product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Interest added successfully
 */
router.post('/add_interest_onproduct', verifyToken, buyerController.addInterestOnProduct);

/**
 * @swagger
 * /api/v16/buyer/new_product:
 *   post:
 *     summary: Get new products (Protected)
 *     tags: [Buyer]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prod_cat_id:
 *                 type: integer
 *                 default: 1
 *               status:
 *                 type: integer
 *                 default: 3
 *               start:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: New products list
 */
router.post('/new_product', verifyToken, buyerController.getNewProducts);

/**
 * @swagger
 * /api/v16/buyer/trending_product:
 *   post:
 *     summary: Get trending products (Protected)
 *     tags: [Buyer]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prod_cat_id:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Trending products list
 */
router.post('/trending_product', verifyToken, buyerController.getTrendingProducts);

/**
 * @swagger
 * /api/v16/buyer/my_stats:
 *   post:
 *     summary: Get buyer statistics (Protected)
 *     tags: [Buyer]
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
 *               buyer_id:
 *                 type: integer
 *               prod_cat_id:
 *                 type: integer
 *               year:
 *                 type: string
 *               month:
 *                 type: string
 *               day:
 *                 type: string
 *     responses:
 *       200:
 *         description: Buyer statistics
 */
router.post('/my_stats', verifyToken, buyerController.getMyStats);

/**
 * @swagger
 * /api/v16/buyer/get_home_filter:
 *   get:
 *     summary: Get home filter options (Protected)
 *     tags: [Buyer]
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
 *         description: Home filter options
 */
router.get('/get_home_filter', verifyToken, buyerController.getHomeFilter);

/**
 * @swagger
 * /api/v16/buyer/add_trade_product_rating:
 *   post:
 *     summary: Add product rating (Protected)
 *     tags: [Buyer]
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
 *               buyer_id:
 *                 type: integer
 *               trade_product_id:
 *                 type: integer
 *               rating_id:
 *                 type: integer
 *               seller_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating added successfully
 */
router.post('/add_trade_product_rating', verifyToken, buyerController.addProductRating);

/**
 * @swagger
 * /api/v16/buyer/show_buyer_rating/{buyer_id}:
 *   get:
 *     summary: Show buyer rating (Protected)
 *     tags: [Buyer]
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
 *       - in: path
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buyer rating details
 */
router.get('/show_buyer_rating/:buyer_id', verifyToken, buyerController.showBuyerRating);

/**
 * @swagger
 * /api/v16/buyer/delete_buyer/{buyer_id}:
 *   get:
 *     summary: Delete buyer account (Protected)
 *     tags: [Buyer]
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
 *       - in: path
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buyer account deleted
 */
router.get('/delete_buyer/:buyer_id', verifyToken, buyerController.deleteBuyer);

/**
 * @swagger
 * /api/v16/buyer/logout_buyer/{buyer_id}:
 *   get:
 *     summary: Logout buyer (Protected)
 *     tags: [Buyer]
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
 *       - in: path
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buyer logged out
 */
router.get('/logout_buyer/:buyer_id', verifyToken, buyerController.logoutBuyer);

/**
 * @swagger
 * /api/v16/buyer/logout_check/{phone}:
 *   get:
 *     summary: Logout check by phone (Protected)
 *     tags: [Buyer]
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
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout_check/:phone', verifyToken, buyerController.logoutCheck);

module.exports = router;