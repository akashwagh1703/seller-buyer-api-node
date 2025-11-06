const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/tradingController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/trading/commodities:
 *   get:
 *     summary: Get all commodity listings
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Commodities retrieved successfully
 */
router.get('/commodities', verifyToken, tradingController.getCommodities);

/**
 * @swagger
 * /api/v16/trading/commodities/{id}:
 *   get:
 *     summary: Get commodity details by ID
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Commodity details retrieved successfully
 */
router.get('/commodities/:id', verifyToken, tradingController.getCommodityById);

/**
 * @swagger
 * /api/v16/trading/commodities:
 *   post:
 *     summary: Create new commodity listing
 *     tags: [Trading & Marketplace]
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
 *               - commodity_id
 *               - quantity
 *               - unit
 *               - price_per_unit
 *               - location
 *             properties:
 *               commodity_id:
 *                 type: integer
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               price_per_unit:
 *                 type: number
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Commodity listing created successfully
 */
router.post('/commodities', verifyToken, tradingController.createCommodityListing);

/**
 * @swagger
 * /api/v16/trading/commodities/{id}:
 *   put:
 *     summary: Update commodity listing
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               price_per_unit:
 *                 type: number
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Commodity listing updated successfully
 */
router.put('/commodities/:id', verifyToken, tradingController.updateCommodityListing);

/**
 * @swagger
 * /api/v16/trading/commodities/{id}:
 *   delete:
 *     summary: Delete commodity listing
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Commodity listing deleted successfully
 */
router.delete('/commodities/:id', verifyToken, tradingController.deleteCommodityListing);

/**
 * @swagger
 * /api/v16/trading/my-listings:
 *   get:
 *     summary: Get user's commodity listings
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, sold, deleted]
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
 *         description: User commodity listings retrieved successfully
 */
router.get('/my-listings', verifyToken, tradingController.getUserCommodityListings);

/**
 * @swagger
 * /api/v16/trading/search:
 *   get:
 *     summary: Search commodities
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Commodity search completed successfully
 */
router.get('/search', verifyToken, tradingController.searchCommodities);

/**
 * @swagger
 * /api/v16/trading/categories:
 *   get:
 *     summary: Get commodity categories
 *     tags: [Trading & Marketplace]
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
 *         description: Commodity categories retrieved successfully
 */
router.get('/categories', verifyToken, tradingController.getCommodityCategories);

/**
 * @swagger
 * /api/v16/trading/bids:
 *   post:
 *     summary: Create bid on commodity
 *     tags: [Trading & Marketplace]
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
 *               - commodity_listing_id
 *               - bid_amount
 *               - quantity
 *             properties:
 *               commodity_listing_id:
 *                 type: integer
 *               bid_amount:
 *                 type: number
 *               quantity:
 *                 type: number
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bid created successfully
 */
router.post('/bids', verifyToken, tradingController.createBid);

/**
 * @swagger
 * /api/v16/trading/commodities/{commodity_id}/bids:
 *   get:
 *     summary: Get bids for commodity
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commodity_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Commodity bids retrieved successfully
 */
router.get('/commodities/:commodity_id/bids', verifyToken, tradingController.getCommodityBids);

/**
 * @swagger
 * /api/v16/trading/bids/{bid_id}/status:
 *   put:
 *     summary: Accept/Reject bid
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bid_id
 *         required: true
 *         schema:
 *           type: integer
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Bid status updated successfully
 */
router.put('/bids/:bid_id/status', verifyToken, tradingController.updateBidStatus);

/**
 * @swagger
 * /api/v16/trading/my-bids:
 *   get:
 *     summary: Get user's bids
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
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
 *         description: User bids retrieved successfully
 */
router.get('/my-bids', verifyToken, tradingController.getUserBids);

/**
 * @swagger
 * /api/v16/trading/orders:
 *   post:
 *     summary: Create order
 *     tags: [Trading & Marketplace]
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
 *               - commodity_listing_id
 *               - seller_id
 *               - quantity
 *               - unit_price
 *               - total_amount
 *               - delivery_address
 *               - payment_method
 *             properties:
 *               commodity_listing_id:
 *                 type: integer
 *               seller_id:
 *                 type: integer
 *               quantity:
 *                 type: number
 *               unit_price:
 *                 type: number
 *               total_amount:
 *                 type: number
 *               delivery_address:
 *                 type: string
 *               payment_method:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 */
router.post('/orders', verifyToken, tradingController.createOrder);

/**
 * @swagger
 * /api/v16/trading/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [buy, sell]
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
 *         description: User orders retrieved successfully
 */
router.get('/orders', verifyToken, tradingController.getUserOrders);

/**
 * @swagger
 * /api/v16/trading/orders/{order_id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.put('/orders/:order_id/status', verifyToken, tradingController.updateOrderStatus);

/**
 * @swagger
 * /api/v16/trading/orders/{order_id}:
 *   get:
 *     summary: Get order details
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Order details retrieved successfully
 */
router.get('/orders/:order_id', verifyToken, tradingController.getOrderDetails);

/**
 * @swagger
 * /api/v16/trading/stats:
 *   get:
 *     summary: Get trading statistics
 *     tags: [Trading & Marketplace]
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
 *         description: Trading statistics retrieved successfully
 */
router.get('/stats', verifyToken, tradingController.getTradingStats);

/**
 * @swagger
 * /api/v16/trading/market-trends:
 *   get:
 *     summary: Get market trends
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: commodity_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
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
 *         description: Market trends retrieved successfully
 */
router.get('/market-trends', verifyToken, tradingController.getMarketTrends);

/**
 * @swagger
 * /api/v16/trading/watchlist:
 *   post:
 *     summary: Add to watchlist
 *     tags: [Trading & Marketplace]
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
 *               - commodity_id
 *             properties:
 *               commodity_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Added to watchlist successfully
 */
router.post('/watchlist', verifyToken, tradingController.addToWatchlist);

/**
 * @swagger
 * /api/v16/trading/watchlist:
 *   get:
 *     summary: Get user watchlist
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Watchlist retrieved successfully
 */
router.get('/watchlist', verifyToken, tradingController.getUserWatchlist);

/**
 * @swagger
 * /api/v16/trading/watchlist/{commodity_id}:
 *   delete:
 *     summary: Remove from watchlist
 *     tags: [Trading & Marketplace]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commodity_id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Removed from watchlist successfully
 */
router.delete('/watchlist/:commodity_id', verifyToken, tradingController.removeFromWatchlist);

module.exports = router;