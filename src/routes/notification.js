const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/notification/send:
 *   post:
 *     summary: Send notification
 *     tags: [Notification]
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
 *               - title
 *               - message
 *               - type
 *             properties:
 *               user_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [order, price_alert, general, marketing]
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */
router.post('/send', verifyToken, notificationController.sendNotification);

/**
 * @swagger
 * /api/v16/notification/list/{user_id}:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Notifications retrieved
 */
router.get('/list/:user_id', verifyToken, notificationController.getUserNotifications);

/**
 * @swagger
 * /api/v16/notification/mark_read/{notification_id}:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put('/mark_read/:notification_id', verifyToken, notificationController.markAsRead);

/**
 * @swagger
 * /api/v16/notification/mark_all_read/{user_id}:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notification]
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
 *         description: All notifications marked as read
 */
router.put('/mark_all_read/:user_id', verifyToken, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/v16/notification/delete/{notification_id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted
 */
router.delete('/delete/:notification_id', verifyToken, notificationController.deleteNotification);

/**
 * @swagger
 * /api/v16/notification/settings/{user_id}:
 *   get:
 *     summary: Get notification settings
 *     tags: [Notification]
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
 *         description: Settings retrieved
 */
router.get('/settings/:user_id', verifyToken, notificationController.getNotificationSettings);

/**
 * @swagger
 * /api/v16/notification/settings/{user_id}:
 *   put:
 *     summary: Update notification settings
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *               push_enabled:
 *                 type: boolean
 *               email_enabled:
 *                 type: boolean
 *               sms_enabled:
 *                 type: boolean
 *               order_updates:
 *                 type: boolean
 *               price_alerts:
 *                 type: boolean
 *               marketing:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/settings/:user_id', verifyToken, notificationController.updateNotificationSettings);

module.exports = router;