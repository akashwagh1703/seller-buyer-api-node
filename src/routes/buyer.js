const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/buyer/is_user_regsitered:
 *   post:
 *     summary: Check if buyer is registered
 *     tags: [Buyer]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *     summary: Register buyer with OTP
 *     tags: [Buyer]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *               btn_submit:
 *                 type: string
 *                 example: "submit"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/register_otp', buyerController.registerOTP);

/**
 * @swagger
 * /api/v16/buyer/trade_product:
 *   post:
 *     summary: Get trade products (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 example: 123
 *               prod_cat_id:
 *                 type: integer
 *                 description: Product category (1=Agri, 2=Contract Farming)
 *                 default: 1
 *                 example: 1
 *               start:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trade products listed successfully
 */
router.post('/trade_product', verifyToken, buyerController.tradeProduct);

/**
 * @swagger
 * /api/v16/buyer/manage_product:
 *   post:
 *     summary: Manage buyer products (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 example: 123
 *               prod_cat_id:
 *                 type: integer
 *                 description: Filter by product category
 *                 example: 1
 *               start:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Products listed successfully
 */
router.post('/manage_product', verifyToken, buyerController.manageProduct);

/**
 * @swagger
 * /api/v16/buyer/trade_product_bidding:
 *   post:
 *     summary: Bid on trade product (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *               - product_id
 *               - buyer_id
 *               - bid_price
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: Trade product ID
 *                 example: 123
 *               buyer_id:
 *                 type: integer
 *                 description: Buyer user ID
 *                 example: 456
 *               qty:
 *                 type: number
 *                 description: Bid quantity
 *                 example: 50
 *               qty_unit:
 *                 type: integer
 *                 description: Quantity unit ID
 *                 example: 1
 *               bid_price:
 *                 type: number
 *                 description: Bid price
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Bid placed successfully
 */
router.post('/trade_product_bidding', verifyToken, buyerController.tradeProductBidding);

/**
 * @swagger
 * /api/v16/buyer/buyer_action:
 *   post:
 *     summary: Perform buyer action on bid (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Bid ID
 *                 example: 789
 *               status:
 *                 type: string
 *                 description: Action status
 *                 example: "1"
 *               product_id:
 *                 type: integer
 *                 example: 123
 *               buyer_id:
 *                 type: integer
 *                 example: 456
 *     responses:
 *       200:
 *         description: Action completed successfully
 */
router.post('/buyer_action', verifyToken, buyerController.buyerAction);

/**
 * @swagger
 * /api/v16/buyer/add_interest_onproduct:
 *   post:
 *     summary: Add or remove interest on product (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *               - buyer_id
 *               - trade_product_id
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 example: 456
 *               trade_product_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Interest added/removed successfully
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
 *           default: buyer
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prod_cat_id:
 *                 type: integer
 *                 description: Product category (1=Agri, 2=Contract Farming)
 *                 default: 1
 *                 example: 1
 *               start:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: New products listed successfully
 */
router.post('/new_product', verifyToken, buyerController.newProduct);

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
 *           default: buyer
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prod_cat_id:
 *                 type: integer
 *                 description: Product category (1=Agri, 2=Contract Farming)
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trending products listed successfully
 */
router.post('/trending_product', verifyToken, buyerController.trendingProduct);

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
 *           default: buyer
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
 *               - buyer_id
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 example: 456
 *               prod_cat_id:
 *                 type: integer
 *                 description: Filter by product category
 *                 example: 1
 *               year:
 *                 type: integer
 *                 description: Filter by year
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Buyer statistics retrieved successfully
 */
router.post('/my_stats', verifyToken, buyerController.myStats);

/**
 * @swagger
 * /api/v16/buyer/get_home_filter:
 *   get:
 *     summary: Get home filters (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
 *       - in: header
 *         name: appname
 *         required: true
 *         schema:
 *           type: string
 *           default: seller_buyer
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 */
router.get('/get_home_filter', verifyToken, buyerController.getHomeFilter);

/**
 * @swagger
 * /api/v16/buyer/add_trade_product_rating:
 *   post:
 *     summary: Add or update product rating (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *               - buyer_id
 *               - rating_id
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 example: 456
 *               trade_product_id:
 *                 type: integer
 *                 description: Trade product ID (optional)
 *                 example: 123
 *               seller_id:
 *                 type: integer
 *                 description: Seller ID (required if no trade_product_id)
 *                 example: 789
 *               rating_id:
 *                 type: string
 *                 description: Rating (1=Happy, 2=Average, 3=Poor)
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Rating added/updated successfully
 */
router.post('/add_trade_product_rating', verifyToken, buyerController.addTradeProductRating);

/**
 * @swagger
 * /api/v16/buyer/show_buyer_rating/{buyer_id}:
 *   get:
 *     summary: Show buyer rating summary (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *         description: Buyer user ID
 *     responses:
 *       200:
 *         description: Buyer rating summary retrieved
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
 *           default: buyer
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
 *         description: Buyer user ID
 *     responses:
 *       200:
 *         description: Account deletion request submitted
 */
router.get('/delete_buyer/:buyer_id', verifyToken, buyerController.deleteBuyer);

/**
 * @swagger
 * /api/v16/buyer/logout_buyer/{buyer_id}:
 *   get:
 *     summary: Logout buyer by ID (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *         description: Buyer user ID
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout_buyer/:buyer_id', verifyToken, buyerController.logoutBuyer);

/**
 * @swagger
 * /api/v16/buyer/logout_check/{phone}:
 *   get:
 *     summary: Logout buyer by phone (Protected)
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *           default: buyer
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
 *         description: Buyer phone number
 *         example: "9876543210"
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout_check/:phone', verifyToken, buyerController.logoutCheck);

module.exports = router;
