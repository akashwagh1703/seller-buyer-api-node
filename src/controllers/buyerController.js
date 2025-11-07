const buyerModel = require('../models/buyerModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const getBuyerDashboard = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const dashboard = await buyerModel.getDashboardData(req.dbName, buyer_id);
    sendSuccess(res, dashboard, 'Dashboard_Retrieved');
  } catch (error) {
    logger.error('Buyer dashboard error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const orders = await buyerModel.getBuyerOrders(req.dbName, buyer_id);
    sendSuccess(res, orders, 'Orders_Retrieved');
  } catch (error) {
    logger.error('Get orders error', { error: error.message });
    sendError(res, 'Error_Retrieving_Orders', 500);
  }
};

const placeOrder = async (req, res) => {
  try {
    const order = await buyerModel.createOrder(req.dbName, req.body);
    sendSuccess(res, order, 'Order_Placed');
  } catch (error) {
    logger.error('Place order error', { error: error.message });
    sendError(res, 'Order_Failed', 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    const order = await buyerModel.updateOrder(req.dbName, order_id, { status });
    sendSuccess(res, order, 'Order_Updated');
  } catch (error) {
    logger.error('Update order error', { error: error.message });
    sendError(res, 'Update_Failed', 500);
  }
};

const getBuyerProfile = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const profile = await buyerModel.getBuyerById(req.dbName, buyer_id);
    sendSuccess(res, profile, 'Profile_Retrieved');
  } catch (error) {
    logger.error('Get buyer profile error', { error: error.message });
    sendError(res, 'Error_Retrieving_Profile', 500);
  }
};

module.exports = { getBuyerDashboard, getMyOrders, placeOrder, updateOrderStatus, getBuyerProfile };