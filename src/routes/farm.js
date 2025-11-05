const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const cropController = require('../controllers/cropController');
const { verifyToken } = require('../middleware/auth');

// Farm Management
router.post('/add_land_details_new', verifyToken, farmController.addFarm);
router.post('/update_land_details', verifyToken, farmController.updateFarm);
router.get('/my_land/:farmer_id', verifyToken, farmController.getMyFarms);
router.get('/land_detail/:land_id', verifyToken, farmController.getFarmDetail);
router.delete('/delete_land_crop/:land_id', verifyToken, farmController.deleteFarm);

// Crop Management
router.post('/add_crop_details', verifyToken, cropController.addCrop);
router.post('/update_crop_details', verifyToken, cropController.updateCrop);
router.get('/my_crops/:client_id', verifyToken, cropController.getMyCrops);
router.delete('/delete_crop_details/:id', verifyToken, cropController.deleteCrop);

module.exports = router;
