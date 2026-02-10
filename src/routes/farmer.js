const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

/**
 * @swagger
 * /api/v16/farmer/crop_list:
 *   get:
 *     tags: [Farmer]
 *     summary: Get crop list
 */
router.get('/crop_list', farmerController.getCropList);

/**
 * @swagger
 * /api/v16/farmer/crop_variety/{crop_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get crop varieties by crop ID
 */
router.get('/crop_variety/:crop_id', farmerController.getCropVariety);

/**
 * @swagger
 * /api/v16/farmer/crop_variety_price:
 *   post:
 *     tags: [Farmer]
 *     summary: Get crop variety price
 */
router.post('/crop_variety_price', farmerController.getCropVarietyPrice);

/**
 * @swagger
 * /api/v16/farmer/add_crop_product:
 *   post:
 *     tags: [Farmer]
 *     summary: Add crop product
 */
router.post('/add_crop_product', farmerController.addCropProduct);

/**
 * @swagger
 * /api/v16/farmer/products/{farmer_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get farmer products
 */
router.get('/products/:farmer_id', farmerController.getFarmerProducts);

/**
 * @swagger
 * /api/v16/farmer/product_detail/{crop_product_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get product detail
 */
router.get('/product_detail/:crop_product_id', farmerController.getFarmerProductDetail);

/**
 * @swagger
 * /api/v16/farmer/update_product_status:
 *   post:
 *     tags: [Farmer]
 *     summary: Update product status
 */
router.post('/update_product_status', farmerController.updateCropProductStatus);

/**
 * @swagger
 * /api/v16/farmer/product_invoice/{id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get product invoice
 */
router.get('/product_invoice/:id', farmerController.getFarmerProductInvoice);

/**
 * @swagger
 * /api/v16/farmer/invoice_list/{farmer_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get invoice list
 */
router.get('/invoice_list/:farmer_id', farmerController.getProductInvoiceList);

/**
 * @swagger
 * /api/v16/farmer/dashboard/{farmer_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Get farmer dashboard
 */
router.get('/dashboard/:farmer_id', farmerController.getFarmerDashboard);

/**
 * @swagger
 * /api/v16/farmer/markets:
 *   get:
 *     tags: [Farmer]
 *     summary: Get markets list
 */
router.get('/markets', farmerController.getMarkets);

/**
 * @swagger
 * /api/v16/farmer/about_us:
 *   get:
 *     tags: [Farmer]
 *     summary: Get about us information
 */
router.get('/about_us', farmerController.getAboutUs);

/**
 * @swagger
 * /api/v16/farmer/invoice/{crop_product_id}:
 *   get:
 *     tags: [Farmer]
 *     summary: Generate invoice
 */
router.get('/invoice/:crop_product_id', farmerController.getInvoice);

module.exports = router;
