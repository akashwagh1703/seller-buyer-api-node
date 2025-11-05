const farmModel = require('../models/farmModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const addFarm = async (req, res) => {
  try {
    const farm = await farmModel.createFarm(req.dbName, req.body);
    sendSuccess(res, farm, 'Added_Successfully');
  } catch (error) {
    logger.error('Add farm error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Add', 500);
  }
};

const updateFarm = async (req, res) => {
  try {
    const { land_id, ...farmData } = req.body;
    const farm = await farmModel.updateFarm(req.dbName, land_id, farmData);
    
    if (!farm) {
      return sendError(res, 'Farm_Not_Found', 404);
    }
    
    sendSuccess(res, farm, 'Updated_Successfully');
  } catch (error) {
    logger.error('Update farm error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Update', 500);
  }
};

const getMyFarms = async (req, res) => {
  try {
    const { farmer_id } = req.params;
    const farms = await farmModel.getFarmsByFarmer(req.dbName, farmer_id);
    sendSuccess(res, farms, 'Listed_Successfully');
  } catch (error) {
    logger.error('Get farms error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Error_Retrieving_Data', 500);
  }
};

const getFarmDetail = async (req, res) => {
  try {
    const { land_id } = req.params;
    const farm = await farmModel.getFarmById(req.dbName, land_id);
    
    if (!farm) {
      return sendError(res, 'Farm_Not_Found', 404);
    }
    
    sendSuccess(res, farm, 'Farm_Retrieved');
  } catch (error) {
    logger.error('Get farm detail error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Error_Retrieving_Data', 500);
  }
};

const deleteFarm = async (req, res) => {
  try {
    const { land_id } = req.params;
    const farm = await farmModel.deleteFarm(req.dbName, land_id);
    
    if (!farm) {
      return sendError(res, 'Farm_Not_Found', 404);
    }
    
    sendSuccess(res, farm, 'Deleted_Successfully');
  } catch (error) {
    logger.error('Delete farm error', { error: error.message, stack: error.stack });
    sendError(res, error.message || 'Not_Able_Delete', 500);
  }
};

module.exports = { addFarm, updateFarm, getMyFarms, getFarmDetail, deleteFarm };
