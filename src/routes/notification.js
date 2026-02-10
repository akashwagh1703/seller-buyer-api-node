const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * /api/v16/notification/userwise_notification_count:
 *   post:
 *     tags: [Notification]
 *     summary: Get unread notification count for user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id: { type: integer }
 *     responses:
 *       200:
 *         description: Notification count retrieved
 */
router.post('/userwise_notification_count', notificationController.getNotificationCount);

/**
 * @swagger
 * /api/v16/notification/userwise_notification_data:
 *   post:
 *     tags: [Notification]
 *     summary: Get all notifications for user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id: { type: integer }
 *     responses:
 *       200:
 *         description: Notification data retrieved
 */
router.post('/userwise_notification_data', notificationController.getNotificationData);

/**
 * @swagger
 * /api/v16/notification/read_notification:
 *   post:
 *     tags: [Notification]
 *     summary: Mark notification as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, notification_id]
 *             properties:
 *               user_id: { type: integer }
 *               notification_id: { type: integer }
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.post('/read_notification', notificationController.readNotification);

/**
 * @swagger
 * /api/v16/notification/notifyuser:
 *   post:
 *     tags: [Notification]
 *     summary: Mark all notifications as notified for user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id: { type: integer }
 *     responses:
 *       200:
 *         description: Notifications marked as notified
 */
router.post('/notifyuser', notificationController.notifyUser);

module.exports = router;
