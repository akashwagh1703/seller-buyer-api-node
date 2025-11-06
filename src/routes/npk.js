const express = require('express');
const router = express.Router();
const npkController = require('../controllers/npkController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/npk/crop_npk/{crop_id}/{n}/{p}/{k}/{size}/{unit}:
 *   get:
 *     summary: Calculate NPK requirements for crop
 *     tags: [NPK Calculator]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: crop_id
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Crop ID
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *           default: 120
 *         description: Nitrogen requirement
 *       - in: path
 *         name: p
 *         required: true
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Phosphorus requirement
 *       - in: path
 *         name: k
 *         required: true
 *         schema:
 *           type: integer
 *           default: 120
 *         description: Potassium requirement
 *       - in: path
 *         name: size
 *         required: true
 *         schema:
 *           type: number
 *           default: 1
 *         description: Farm size
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hectare, acre]
 *           default: hectare
 *         description: Area unit
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
 *         description: NPK calculations completed successfully
 */
router.get('/crop_npk/:crop_id/:n/:p/:k/:size/:unit', verifyToken, npkController.getCropNPK);

/**
 * @swagger
 * /api/v16/npk/crop_npks_details:
 *   post:
 *     summary: Get detailed NPK calculations
 *     tags: [NPK Calculator]
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
 *               - crop_id
 *             properties:
 *               crop_id:
 *                 type: integer
 *                 default: 1
 *                 description: Crop ID
 *               n:
 *                 type: integer
 *                 default: 100
 *                 description: Nitrogen requirement
 *               p:
 *                 type: integer
 *                 default: 50
 *                 description: Phosphorus requirement
 *               k:
 *                 type: integer
 *                 default: 50
 *                 description: Potassium requirement
 *               s:
 *                 type: integer
 *                 default: 30
 *                 description: Sulfur requirement
 *               size:
 *                 type: number
 *                 default: 1
 *                 description: Farm size
 *               unit:
 *                 type: string
 *                 enum: [hectare, acre]
 *                 default: hectare
 *                 description: Area unit
 *               season:
 *                 type: string
 *                 enum: [Kharif, Rabi, Late kharif]
 *                 default: Kharif
 *                 description: Growing season
 *     responses:
 *       200:
 *         description: Detailed NPK calculations retrieved successfully
 */
router.post('/crop_npks_details', verifyToken, npkController.getCropNPKDetails);

module.exports = router;