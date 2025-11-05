const cropModel = require('../models/cropModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const addCrop = async (req, res) => {
  try {
    const crop = await cropModel.createCrop(req.dbName, req.body);
    sendSuccess(res, crop, 'Added_Successfully');
  } catch (error) {
    logger.error('Add crop error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Add', 500);
  }
};

const updateCrop = async (req, res) => {
  try {
    const { id, ...cropData } = req.body;
    const crop = await cropModel.updateCrop(req.dbName, id, cropData);
    
    if (!crop) {
      return sendError(res, 'Crop_Not_Found', 404);
    }
    
    sendSuccess(res, crop, 'Updated_Successfully');
  } catch (error) {
    logger.error('Update crop error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Update', 500);
  }
};

const getMyCrops = async (req, res) => {
  try {
    const { client_id } = req.params;
    const crops = await cropModel.getCropsByFarmer(req.dbName, client_id);
    sendSuccess(res, crops, 'Listed_Successfully');
  } catch (error) {
    logger.error('Get crops error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Error_Retrieving_Data', 500);
  }
};

const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await cropModel.deleteCrop(req.dbName, id);
    
    if (!crop) {
      return sendError(res, 'Crop_Not_Found', 404);
    }
    
    sendSuccess(res, crop, 'Deleted_Successfully');
  } catch (error) {
    logger.error('Delete crop error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Delete', 500);
  }
};

module.exports = { addCrop, updateCrop, getMyCrops, deleteCrop };
