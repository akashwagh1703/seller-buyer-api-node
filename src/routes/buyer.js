const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/buyer/dashboard/{buyer_id}:
 *   get:
 *     summary: Get buyer dashboard
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: buyer_id
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
 *         description: Dashboard data retrieved
 */
router.get('/dashboard/:buyer_id', verifyToken, buyerController.getBuyerDashboard);

/**
 * @swagger
 * /api/v16/buyer/orders/{buyer_id}:
 *   get:
 *     summary: Get buyer orders
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orders retrieved
 */
router.get('/orders/:buyer_id', verifyToken, buyerController.getMyOrders);

/**
 * @swagger
 * /api/v16/buyer/place_order:
 *   post:
 *     summary: Place new order
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyer_id
 *               - seller_id
 *               - product_id
 *               - quantity
 *               - price
 *             properties:
 *               buyer_id:
 *                 type: integer
 *               seller_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               total_amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order placed successfully
 */
router.post('/place_order', verifyToken, buyerController.placeOrder);

/**
 * @swagger
 * /api/v16/buyer/update_order/{order_id}:
 *   put:
 *     summary: Update order status
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.put('/update_order/:order_id', verifyToken, buyerController.updateOrderStatus);

/**
 * @swagger
 * /api/v16/buyer/profile/{buyer_id}:
 *   get:
 *     summary: Get buyer profile
 *     tags: [Buyer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
router.get('/profile/:buyer_id', verifyToken, buyerController.getBuyerProfile);

module.exports = router;