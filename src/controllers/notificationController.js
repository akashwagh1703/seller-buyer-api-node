const notificationModel = require('../models/notificationModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const sendNotification = async (req, res) => {
  try {
    const notification = await notificationModel.createNotification(req.dbName, req.body);
    // TODO: Implement actual push notification sending
    sendSuccess(res, notification, 'Notification_Sent');
  } catch (error) {
    logger.error('Send notification error', { error: error.message });
    sendError(res, 'Notification_Failed', 500);
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const notifications = await notificationModel.getUserNotifications(req.dbName, user_id, page, limit);
    sendSuccess(res, notifications, 'Notifications_Retrieved');
  } catch (error) {
    logger.error('Get notifications error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await notificationModel.markAsRead(req.dbName, notification_id);
    sendSuccess(res, notification, 'Notification_Marked_Read');
  } catch (error) {
    logger.error('Mark notification error', { error: error.message });
    sendError(res, 'Update_Failed', 500);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    await notificationModel.markAllAsRead(req.dbName, user_id);
    sendSuccess(res, null, 'All_Notifications_Marked_Read');
  } catch (error) {
    logger.error('Mark all notifications error', { error: error.message });
    sendError(res, 'Update_Failed', 500);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    await notificationModel.deleteNotification(req.dbName, notification_id);
    sendSuccess(res, null, 'Notification_Deleted');
  } catch (error) {
    logger.error('Delete notification error', { error: error.message });
    sendError(res, 'Delete_Failed', 500);
  }
};

const getNotificationSettings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const settings = await notificationModel.getUserSettings(req.dbName, user_id);
    sendSuccess(res, settings, 'Settings_Retrieved');
  } catch (error) {
    logger.error('Get notification settings error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const settings = await notificationModel.updateUserSettings(req.dbName, user_id, req.body);
    sendSuccess(res, settings, 'Settings_Updated');
  } catch (error) {
    logger.error('Update notification settings error', { error: error.message });
    sendError(res, 'Update_Failed', 500);
  }
};

module.exports = { 
  sendNotification, 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getNotificationSettings, 
  updateNotificationSettings 
};