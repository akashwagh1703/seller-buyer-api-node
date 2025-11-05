const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/trade/get_listing/{listing_name}:
 *   get:
 *     summary: Get master listings (Protected)
 *     tags: [Trade]
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
 *         name: listing_name
 *         schema:
 *           type: string
 *           enum: [product_category, season, product_unit, trade_status_list, prod_details]
 *         description: Optional - leave empty to get all listings
 *     responses:
 *       200:
 *         description: Listings retrieved successfully
 */
router.get('/get_listing/:listing_name?', verifyToken, tradeController.getListings);

/**
 * @swagger
 * /api/v16/trade/add_trade_product:
 *   post:
 *     summary: Add or update trade product (Protected)
 *     tags: [Trade]
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
 *             required:
 *               - user_id
 *               - prod_cat_id
 *               - prod_type_id
 *               - prod_id
 *               - step
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Trade product ID (for update)
 *                 example: null
 *               step:
 *                 type: integer
 *                 description: Step number (1 or 2)
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 5940
 *               prod_cat_id:
 *                 type: integer
 *                 description: 1=Agri, 2=Contract Farming
 *                 example: 1
 *               prod_type_id:
 *                 type: integer
 *                 example: 1
 *               prod_id:
 *                 type: integer
 *                 example: 1
 *               prod_variety_id:
 *                 type: integer
 *                 example: 1
 *               prod_details:
 *                 type: integer
 *                 description: Required if prod_cat_id=2
 *                 example: 1
 *               surplus:
 *                 type: number
 *                 example: 100
 *               surplus_unit:
 *                 type: integer
 *                 example: 1
 *               sell_qty:
 *                 type: number
 *                 example: 50
 *               sell_qty_unit:
 *                 type: integer
 *                 example: 1
 *               price:
 *                 type: number
 *                 example: 5000
 *               price_unit:
 *                 type: integer
 *                 example: 1
 *               with_logistic_partner:
 *                 type: string
 *                 enum: [true, false]
 *                 example: "false"
 *               with_packging:
 *                 type: string
 *                 enum: [true, false]
 *                 example: "false"
 *               packaging_master_id:
 *                 type: integer
 *                 example: null
 *               storage_type_id:
 *                 type: integer
 *                 example: 1
 *               state:
 *                 type: string
 *                 example: "21"
 *               city:
 *                 type: string
 *                 example: "1234"
 *               pickup_location:
 *                 type: string
 *                 example: "Farm Gate"
 *               produce_to_highway_distance:
 *                 type: string
 *                 example: "5 km"
 *               advance_payment:
 *                 type: string
 *                 example: "true"
 *               negotiations:
 *                 type: string
 *                 example: "true"
 *               certifcations:
 *                 type: string
 *                 example: "false"
 *               active_till_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               season_from:
 *                 type: integer
 *                 description: Step 1 - Season start (if prod_cat_id!=2)
 *                 example: 1
 *               season_to:
 *                 type: integer
 *                 description: Step 1 - Season end (if prod_cat_id!=2)
 *                 example: 2
 *               availability_from:
 *                 type: string
 *                 description: Step 1 - Availability start (if prod_cat_id=2)
 *                 example: "2024-01-01"
 *               availability_to:
 *                 type: string
 *                 description: Step 1 - Availability end (if prod_cat_id=2)
 *                 example: "2024-06-30"
 *               yield_from:
 *                 type: number
 *                 description: Step 1 - Yield from (if prod_cat_id=2)
 *                 example: 10
 *               yield_from_unit:
 *                 type: integer
 *                 description: Step 1 - Yield from unit (if prod_cat_id=2)
 *                 example: 1
 *               yield_to:
 *                 type: number
 *                 description: Step 1 - Yield to (if prod_cat_id=2)
 *                 example: 20
 *               yield_to_unit:
 *                 type: integer
 *                 description: Step 1 - Yield to unit (if prod_cat_id=2)
 *                 example: 1
 *               railway:
 *                 type: string
 *                 description: Step 2 - Distance to railway
 *                 example: "10 km"
 *               airport:
 *                 type: string
 *                 description: Step 2 - Distance to airport
 *                 example: "50 km"
 *               post_office:
 *                 type: string
 *                 description: Step 2 - Distance to post office
 *                 example: "2 km"
 *               godown:
 *                 type: string
 *                 description: Step 2 - Distance to godown
 *                 example: "5 km"
 *               national_highway:
 *                 type: string
 *                 description: Step 2 - Distance to national highway
 *                 example: "15 km"
 *               state_highway:
 *                 type: string
 *                 description: Step 2 - Distance to state highway
 *                 example: "8 km"
 *     responses:
 *       200:
 *         description: Trade product added/updated successfully
 */
router.post('/add_trade_product', verifyToken, tradeController.addTradeProduct);

/**
 * @swagger
 * /api/v16/trade/trade_product:
 *   post:
 *     summary: Get list of trade products (Protected)
 *     tags: [Trade]
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
 *               user_id:
 *                 type: integer
 *                 description: Filter by seller user ID
 *                 example: 5940
 *               id:
 *                 type: integer
 *                 description: Get specific trade product by ID
 *                 example: null
 *               prod_cat_id:
 *                 type: integer
 *                 description: Filter by product category (1=Agri, 2=Contract Farming)
 *                 example: 1
 *               trade_status:
 *                 type: integer
 *                 description: Filter by status (1=Pending, 3=Live, 4=Sold, 5=Completed, 6=Expired, 7=Self Sold, 8=Draft, 9=Bid Locked)
 *                 example: 3
 *               start:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Trade products listed successfully
 */
router.post('/trade_product', verifyToken, tradeController.getTradeProducts);

/**
 * @swagger
 * /api/v16/trade/remove_trade_product/{id}:
 *   get:
 *     summary: Delete trade product (Protected)
 *     tags: [Trade]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trade product deleted successfully
 */
router.get('/remove_trade_product/:id', verifyToken, tradeController.deleteTradeProduct);

/**
 * @swagger
 * /api/v16/trade/trade_bidding:
 *   post:
 *     summary: Get bidding list (Protected)
 *     tags: [Trade]
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
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: Trade product ID to get bidding list
 *                 example: 123
 *               id:
 *                 type: integer
 *                 description: Get specific bid by ID
 *                 example: null
 *               start:
 *                 type: integer
 *                 description: Page number for pagination
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Bidding list retrieved successfully
 */
router.post('/trade_bidding', verifyToken, tradeController.getTradeBidding);

/**
 * @swagger
 * /api/v16/trade/seller_action:
 *   post:
 *     summary: Seller action on bid (Protected)
 *     tags: [Trade]
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
 *             required:
 *               - product_id
 *               - seller_id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Bid ID (required for actions 1,2,3,5,9)
 *                 example: 456
 *               product_id:
 *                 type: integer
 *                 description: Trade product ID
 *                 example: 123
 *               seller_id:
 *                 type: integer
 *                 description: Seller user ID
 *                 example: 5940
 *               buyer_id:
 *                 type: integer
 *                 description: Buyer user ID (optional)
 *                 example: 6789
 *               status:
 *                 type: string
 *                 enum: ['1', '2', '3', '5', '7', '9']
 *                 description: 1=Accept, 2=Revoke, 3=Reject, 5=Complete, 7=Self Sold, 9=Bid Lock
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Seller action completed successfully
 */
router.post('/seller_action', verifyToken, tradeController.sellerAction);

module.exports = router;
