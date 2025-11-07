const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/payment/initiate:
 *   post:
 *     summary: Initiate payment
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - order_id
 *               - amount
 *               - payment_method
 *             properties:
 *               user_id:
 *                 type: integer
 *               order_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [card, upi, netbanking, wallet]
 *               gateway:
 *                 type: string
 *                 enum: [paytm, razorpay, payphi]
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 */
router.post('/initiate', verifyToken, paymentController.initiatePayment);

/**
 * @swagger
 * /api/v16/payment/verify:
 *   post:
 *     summary: Verify payment
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *               - transaction_id
 *               - status
 *             properties:
 *               payment_id:
 *                 type: integer
 *               transaction_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [success, failed, pending]
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post('/verify', verifyToken, paymentController.verifyPayment);

/**
 * @swagger
 * /api/v16/payment/history/{user_id}:
 *   get:
 *     summary: Get payment history
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment history retrieved
 */
router.get('/history/:user_id', verifyToken, paymentController.getPaymentHistory);

/**
 * @swagger
 * /api/v16/payment/refund/{payment_id}:
 *   post:
 *     summary: Initiate refund
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refund_amount
 *               - reason
 *             properties:
 *               refund_amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund initiated successfully
 */
router.post('/refund/:payment_id', verifyToken, paymentController.refundPayment);

/**
 * @swagger
 * /api/v16/payment/methods:
 *   get:
 *     summary: Get available payment methods
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved
 */
router.get('/methods', verifyToken, paymentController.getPaymentMethods);

module.exports = router;