const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/location/states:
 *   post:
 *     summary: Get states list
 *     tags: [Location]
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
 *               country_id:
 *                 type: integer
 *                 description: Filter by country ID
 *     responses:
 *       200:
 *         description: States listed successfully
 */
router.post('/states', verifyToken, locationController.getStates);

/**
 * @swagger
 * /api/v16/location/cities:
 *   post:
 *     summary: Get cities list
 *     tags: [Location]
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
 *               - state_id
 *             properties:
 *               state_id:
 *                 type: integer
 *                 description: State ID to get cities for
 *     responses:
 *       200:
 *         description: Cities listed successfully
 */
router.post('/cities', verifyToken, locationController.getCities);

/**
 * @swagger
 * /api/v16/location/countries:
 *   get:
 *     summary: Get countries list
 *     tags: [Location]
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
 *         description: Countries listed successfully
 */
router.get('/countries', verifyToken, locationController.getCountries);

/**
 * @swagger
 * /api/v16/location/check_referral_code/{code}:
 *   get:
 *     summary: Check referral code validity
 *     tags: [Location]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral code to check
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
 *         description: Referral code found
 *       404:
 *         description: Invalid referral code
 */
router.get('/check_referral_code/:code', verifyToken, locationController.checkReferralCode);

/**
 * @swagger
 * /api/v16/location/generate_referral_code:
 *   post:
 *     summary: Generate referral code
 *     tags: [Location]
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
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Referral code generated successfully
 */
router.post('/generate_referral_code', verifyToken, locationController.generateReferralCode);

/**
 * @swagger
 * /api/v16/location/request_invitation:
 *   post:
 *     summary: Request invitation code
 *     tags: [Location]
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
 *               - mobile
 *               - device_id
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               device_id:
 *                 type: string
 *                 example: "device123"
 *     responses:
 *       200:
 *         description: Invitation request submitted successfully
 */
router.post('/request_invitation', verifyToken, locationController.requestInvitation);

module.exports = router;