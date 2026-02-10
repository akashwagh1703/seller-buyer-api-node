const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/chat/get_chat_data:
 *   post:
 *     summary: Get chat messages
 *     tags: [Chat]
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
 *               - farmer_id
 *               - user_id
 *             properties:
 *               farmer_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Chat data retrieved
 */
router.post('/get_chat_data', verifyToken, chatController.getChatData);

/**
 * @swagger
 * /api/v16/chat/add_chat:
 *   post:
 *     summary: Send chat message
 *     tags: [Chat]
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
 *               - farmer_id
 *               - user_id
 *               - msg
 *             properties:
 *               farmer_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               msg:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/add_chat', verifyToken, chatController.addChat);

/**
 * @swagger
 * /api/v16/chat/chat_list/{user_id}:
 *   get:
 *     summary: Get chat conversations list
 *     tags: [Chat]
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
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat list retrieved
 */
router.get('/chat_list/:user_id', verifyToken, chatController.getChatList);

module.exports = router;
