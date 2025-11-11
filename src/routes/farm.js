const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const cropController = require('../controllers/cropController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/v16/farm/add_land_details_new:
 *   post:
 *     summary: Add new farm land
 *     tags: [Farm Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               landName:
 *                 type: string
 *               area:
 *                 type: number
 *               location:
 *                 type: string
 *               soilType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Farm added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/add_land_details_new', verifyToken, farmController.addFarm);

/**
 * @swagger
 * /api/v16/farm/update_land_details:
 *   post:
 *     summary: Update farm land details
 *     tags: [Farm Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               landId:
 *                 type: string
 *               landName:
 *                 type: string
 *               area:
 *                 type: number
 *               location:
 *                 type: string
 *               soilType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Farm updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/update_land_details', verifyToken, farmController.updateFarm);

/**
 * @swagger
 * /api/v16/farm/my_land/{farmer_id}:
 *   get:
 *     summary: Get farmer's lands
 *     tags: [Farm Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: farmer_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Farmer ID
 *     responses:
 *       200:
 *         description: List of farmer's lands
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my_land/:farmer_id', verifyToken, farmController.getMyFarms);

/**
 * @swagger
 * /api/v16/farm/land_detail/{land_id}:
 *   get:
 *     summary: Get land details by ID
 *     tags: [Farm Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: land_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Land ID
 *     responses:
 *       200:
 *         description: Land details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/land_detail/:land_id', verifyToken, farmController.getFarmDetail);


/**
 * @swagger
 * /api/v16/farm/delete_land_crop/{land_id}:
 *   delete:
 *     summary: Delete farm land
 *     tags: [Farm Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: land_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Land ID
 *     responses:
 *       200:
 *         description: Farm deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/delete_land_crop/:land_id', verifyToken, farmController.deleteFarm);

/**
 * @swagger
 * /api/v16/farm/add_crop_details:
 *   post:
 *     summary: Add crop details
 *     tags: [Crop Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               landId:
 *                 type: string
 *               crop:
 *                 type: string
 *               cropType:
 *                 type: string
 *               durationFrom:
 *                 type: string
 *                 format: date
 *               durationTo:
 *                 type: string
 *                 format: date
 *               areaUnderCultivation:
 *                 type: number
 *               cropName:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/add_crop_details', verifyToken, cropController.addCrop);

/**
 * @swagger
 * /api/v16/farm/update_crop_details:
 *   post:
 *     summary: Update crop details
 *     tags: [Crop Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cropId:
 *                 type: string
 *               crop:
 *                 type: string
 *               cropType:
 *                 type: string
 *               durationFrom:
 *                 type: string
 *                 format: date
 *               durationTo:
 *                 type: string
 *                 format: date
 *               areaUnderCultivation:
 *                 type: number
 *               cropName:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

router.post('/update_crop_details', verifyToken, cropController.updateCrop);

/**
 * @swagger
 * /api/v16/farm/my_crops/{client_id}:
 *   get:
 *     summary: Get user's crops
 *     tags: [Crop Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: List of user's crops
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/my_crops/:client_id', verifyToken, cropController.getMyCrops);

/**
 * @swagger
 * /api/v16/farm/delete_crop_details/{id}:
 *   delete:
 *     summary: Delete crop
 *     tags: [Crop Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Crop ID
 *     responses:
 *       200:
 *         description: Crop deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/delete_crop_details/:id', verifyToken, cropController.deleteCrop);

module.exports = router;
