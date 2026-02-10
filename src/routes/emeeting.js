const express = require('express');
const router = express.Router();
const emeetingController = require('../controllers/emeetingController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/emeeting/start_call:
 *   post:
 *     summary: Start video call
 *     tags: [EMeeting]
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
 *               - user_id
 *               - farmer_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               farmer_id:
 *                 type: integer
 *               lead_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Call initiated
 */
router.post('/start_call', verifyToken, emeetingController.startCallMeeting);

/**
 * @swagger
 * /api/v16/emeeting/disconnect_call:
 *   post:
 *     summary: Disconnect video call
 *     tags: [EMeeting]
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
 *               - meeting_link
 *             properties:
 *               partner_id:
 *                 type: integer
 *               farmer_id:
 *                 type: integer
 *               meeting_link:
 *                 type: string
 *               call_status_flag:
 *                 type: integer
 *                 default: 4
 *     responses:
 *       200:
 *         description: Call disconnected
 */
router.post('/disconnect_call', verifyToken, emeetingController.disconnectCall);

/**
 * @swagger
 * /api/v16/emeeting/accept_call:
 *   post:
 *     summary: Accept video call
 *     tags: [EMeeting]
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
 *               - meeting_link
 *             properties:
 *               partner_id:
 *                 type: integer
 *               farmer_id:
 *                 type: integer
 *               meeting_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Call accepted
 */
router.post('/accept_call', verifyToken, emeetingController.acceptCall);

/**
 * @swagger
 * /api/v16/emeeting/booked_slots:
 *   post:
 *     summary: Get booked time slots
 *     tags: [EMeeting]
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
 *               - partner_id
 *             properties:
 *               partner_id:
 *                 type: integer
 *               crop_id:
 *                 type: integer
 *               schedule_call_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booked slots retrieved
 */
router.post('/booked_slots', verifyToken, emeetingController.getBookedSlots);

/**
 * @swagger
 * /api/v16/emeeting/call_history/{partner_id}:
 *   get:
 *     summary: Get call history
 *     tags: [EMeeting]
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
 *         name: partner_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Call history retrieved
 */
router.get('/call_history/:partner_id', verifyToken, emeetingController.getCallHistory);

module.exports = router;
