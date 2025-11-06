const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/market/nearby_market/{lat}/{long}:
 *   get:
 *     summary: Get nearby market data
 *     tags: [Market]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lat
 *         schema:
 *           type: string
 *           default: "19.997454"
 *         description: Latitude
 *       - in: path
 *         name: long
 *         schema:
 *           type: string
 *           default: "73.789803"
 *         description: Longitude
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
 *         description: Market data retrieved successfully
 */
router.get('/nearby_market/:lat/:long', verifyToken, marketController.getNearbyMarket);

/**
 * @swagger
 * /api/v16/market/nearby_market_all_data:
 *   post:
 *     summary: Get nearby market data with pagination
 *     tags: [Market]
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
 *               apmc_market:
 *                 type: string
 *                 description: Market name (optional)
 *               lat:
 *                 type: string
 *                 default: "19.997454"
 *               long:
 *                 type: string
 *                 default: "73.789803"
 *               start:
 *                 type: integer
 *                 default: 1
 *                 description: Page number
 *     responses:
 *       200:
 *         description: Market data with pagination
 */
router.post('/nearby_market_all_data', verifyToken, marketController.getNearbyMarketAllData);

/**
 * @swagger
 * /api/v16/market/markets:
 *   get:
 *     summary: Get all APMC markets
 *     tags: [Market]
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
 *         description: Markets listed successfully
 */
router.get('/markets', verifyToken, marketController.getMarkets);

/**
 * @swagger
 * /api/v16/market/seller_markets:
 *   get:
 *     summary: Get seller markets
 *     tags: [Market]
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
 *         description: Seller markets listed successfully
 */
router.get('/seller_markets', verifyToken, marketController.getSellerMarkets);

/**
 * @swagger
 * /api/v16/market/commodity_details:
 *   post:
 *     summary: Get commodity price details
 *     tags: [Market]
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
 *               - commodity_name
 *               - market_name
 *             properties:
 *               commodity_name:
 *                 type: string
 *                 example: "Onion"
 *               market_name:
 *                 type: string
 *                 example: "Nashik"
 *               varity:
 *                 type: string
 *                 example: "Red"
 *               is_encode:
 *                 type: integer
 *                 default: 0
 *                 description: 1 if data is base64 encoded
 *     responses:
 *       200:
 *         description: Commodity details retrieved successfully
 */
router.post('/commodity_details', verifyToken, marketController.getCommodityDetails);

module.exports = router;