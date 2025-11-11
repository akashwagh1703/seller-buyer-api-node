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
 *           enum: [product_category, season, product_unit, trade_status_list, prod_details, all_products]
 *         description: Optional - leave empty to get all listings. Use 'all_products' to get all trade products
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
 * /api/v16/trade/trade_product/{id}:
 *   get:
 *     summary: Get single trade product by ID (Protected)
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
 *         description: Trade product ID
 *     responses:
 *       200:
 *         description: Trade product retrieved successfully
 */
router.get('/trade_product/:id', verifyToken, tradeController.getTradeProductById);

/**
 * @swagger
 * /api/v16/trade/trade_product/{id}:
 *   delete:
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
 *         description: Trade product ID to delete
 *     responses:
 *       200:
 *         description: Trade product deleted successfully
 */
router.delete('/trade_product/:id', verifyToken, tradeController.deleteTradeProduct);

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

/**
 * @swagger
 * /api/v16/trade/product_type:
 *   get:
 *     summary: Get product types (Protected)
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
 *     responses:
 *       200:
 *         description: Product types list
 */
router.get('/product_type', verifyToken, tradeController.getProductType);

/**
 * @swagger
 * /api/v16/trade/product_data:
 *   post:
 *     summary: Get product data (Protected)
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
 *             properties:
 *               product_category:
 *                 type: integer
 *               product_type:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product data list
 */
router.post('/product_data', verifyToken, tradeController.getProductData);

/**
 * @swagger
 * /api/v16/trade/product_variety/{product_id}:
 *   get:
 *     summary: Get product varieties (Protected)
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
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product varieties list
 */
router.get('/product_variety/:product_id', verifyToken, tradeController.getProductVariety);

/**
 * @swagger
 * /api/v16/trade/packaging_list:
 *   get:
 *     summary: Get packaging list (Protected)
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
 *     responses:
 *       200:
 *         description: Packaging list
 */
router.get('/packaging_list', verifyToken, tradeController.getPackagingList);

/**
 * @swagger
 * /api/v16/trade/storage_type:
 *   get:
 *     summary: Get storage types (Protected)
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
 *     responses:
 *       200:
 *         description: Storage types list
 */
router.get('/storage_type', verifyToken, tradeController.getStorageType);

/**
 * @swagger
 * /api/v16/trade/upload_trade_images:
 *   post:
 *     summary: Upload trade product images (Protected)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
router.post('/upload_trade_images', verifyToken, tradeController.uploadTradeImages);

/**
 * @swagger
 * /api/v16/trade/remove_image:
 *   post:
 *     summary: Remove uploaded image (Protected)
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
 *             properties:
 *               id:
 *                 type: integer
 *               image:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image removed successfully
 */
router.post('/remove_image', verifyToken, tradeController.removeImage);

/**
 * @swagger
 * /api/v16/trade/incentive_list:
 *   get:
 *     summary: Get incentive list (Protected)
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
 *     responses:
 *       200:
 *         description: Incentive list
 */
router.get('/incentive_list', verifyToken, tradeController.getIncentiveList);

/**
 * @swagger
 * /api/v16/trade/apply_for_incentive:
 *   post:
 *     summary: Apply for incentive (Protected)
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
 *             properties:
 *               incentive_id:
 *                 type: integer
 *               trade_bidding_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Incentive applied successfully
 */
router.post('/apply_for_incentive', verifyToken, tradeController.applyForIncentive);

/**
 * @swagger
 * /api/v16/trade/upload_invoice:
 *   post:
 *     summary: Upload invoice (Protected)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               trade_bidding_id:
 *                 type: integer
 *               action_by:
 *                 type: string
 *               invoice:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Invoice uploaded successfully
 */
router.post('/upload_invoice', verifyToken, tradeController.uploadInvoice);

/**
 * @swagger
 * /api/v16/trade/add_interest_onproduct:
 *   post:
 *     summary: Add interest on product (Protected)
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
 *             properties:
 *               buyer_id:
 *                 type: integer
 *               trade_product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Interest added successfully
 */
router.post('/add_interest_onproduct', verifyToken, tradeController.addInterestOnProduct);

/**
 * @swagger
 * /api/v16/trade/buyers_interest_product_list:
 *   post:
 *     summary: Get buyers interest product list (Protected)
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
 *             properties:
 *               seller_id:
 *                 type: integer
 *               trade_product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buyers interest list
 */
router.post('/buyers_interest_product_list', verifyToken, tradeController.getBuyersInterestProductList);

/**
 * @swagger
 * /api/v16/trade/upcoming_product_list/{seller_id}:
 *   get:
 *     summary: Get upcoming product list (Protected)
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
 *         name: seller_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Upcoming products list
 */
router.get('/upcoming_product_list/:seller_id', verifyToken, tradeController.getUpcomingProductList);

/**
 * @swagger
 * /api/v16/trade/add_demand_product:
 *   post:
 *     summary: Add demand product (Protected)
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
 *             properties:
 *               buyer_id:
 *                 type: integer
 *               demand_type:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               prod_cat_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Demand product added successfully
 */
router.post('/add_demand_product', verifyToken, tradeController.addDemandProduct);

/**
 * @swagger
 * /api/v16/trade/buyers_demand_product_list:
 *   post:
 *     summary: Get buyers demand product list (Protected)
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
 *               prod_cat_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               demand_type:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buyers demand product list
 */
router.post('/buyers_demand_product_list', verifyToken, tradeController.getBuyersDemandProductList);

/**
 * @swagger
 * /api/v16/trade/product_list:
 *   post:
 *     summary: Get product list (Protected)
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
 *               product_category:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product list
 */
router.post('/product_list', verifyToken, tradeController.getProductList);

/**
 * @swagger
 * /api/v16/trade/trade_product_report:
 *   post:
 *     summary: Get trade product report (Protected)
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
 *             properties:
 *               user_id:
 *                 type: integer
 *               year:
 *                 type: string
 *               month:
 *                 type: string
 *               day:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trade product report
 */
router.post('/trade_product_report', verifyToken, tradeController.getTradeProductReport);

/**
 * @swagger
 * /api/v16/trade/get_home_filter:
 *   get:
 *     summary: Get home filter options (Protected)
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
 *     responses:
 *       200:
 *         description: Home filter options
 */
router.get('/get_home_filter', verifyToken, tradeController.getHomeFilter);

/**
 * @swagger
 * /api/v16/trade/marketable_surplus:
 *   post:
 *     summary: Get marketable surplus (Protected)
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
 *             properties:
 *               user_id:
 *                 type: integer
 *               prod_cat_id:
 *                 type: integer
 *               start:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Marketable surplus data
 */
router.post('/marketable_surplus', verifyToken, tradeController.getMarketableSurplus);

/**
 * @swagger
 * /api/v16/trade/self_sold:
 *   post:
 *     summary: Mark product as self sold (Protected)
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
 *             properties:
 *               product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product marked as self sold
 */
router.post('/self_sold', verifyToken, tradeController.markSelfSold);

// Legacy endpoint for backward compatibility
router.get('/remove_trade_product/:id', verifyToken, tradeController.deleteTradeProduct);

module.exports = router;
