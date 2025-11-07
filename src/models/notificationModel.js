const { query } = require('../config/database');

const createNotification = async (dbName, notificationData) => {
  const { user_id, title, message, type, data } = notificationData;
  const sql = `INSERT INTO notifications (user_id, title, message, type, data, is_read, created_on) 
    VALUES ($1, $2, $3, $4, $5, false, NOW()) RETURNING *`;
  const result = await query(dbName, sql, [user_id, title, message, type, JSON.stringify(data)]);
  return result.rows[0];
};

const getUserNotifications = async (dbName, userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = `SELECT * FROM notifications 
    WHERE user_id = $1 AND is_deleted = false 
    ORDER BY created_on DESC 
    LIMIT $2 OFFSET $3`;
  const result = await query(dbName, sql, [userId, limit, offset]);
  return result.rows;
};

const markAsRead = async (dbName, notificationId) => {
  const sql = 'UPDATE notifications SET is_read = true, read_on = NOW() WHERE id = $1 RETURNING *';
  const result = await query(dbName, sql, [notificationId]);
  return result.rows[0];
};

const markAllAsRead = async (dbName, userId) => {
  const sql = 'UPDATE notifications SET is_read = true, read_on = NOW() WHERE user_id = $1 AND is_read = false';
  const result = await query(dbName, sql, [userId]);
  return result.rowCount;
};

const deleteNotification = async (dbName, notificationId) => {
  const sql = 'UPDATE notifications SET is_deleted = true WHERE id = $1';
  const result = await query(dbName, sql, [notificationId]);
  return result.rowCount;
};

const getUserSettings = async (dbName, userId) => {
  const sql = 'SELECT * FROM notification_settings WHERE user_id = $1';
  const result = await query(dbName, sql, [userId]);
  return result.rows[0] || {
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
    order_updates: true,
    price_alerts: true,
    marketing: false
  };
};

const updateUserSettings = async (dbName, userId, settings) => {
  const sql = `INSERT INTO notification_settings (user_id, push_enabled, email_enabled, sms_enabled, order_updates, price_alerts, marketing, updated_on) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
    ON CONFLICT (user_id) DO UPDATE SET 
    push_enabled = $2, email_enabled = $3, sms_enabled = $4, 
    order_updates = $5, price_alerts = $6, marketing = $7, updated_on = NOW() 
    RETURNING *`;
  const { push_enabled, email_enabled, sms_enabled, order_updates, price_alerts, marketing } = settings;
  const result = await query(dbName, sql, [userId, push_enabled, email_enabled, sms_enabled, order_updates, price_alerts, marketing]);
  return result.rows[0];
};

const getUnreadCount = async (dbName, userId) => {
  const sql = 'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = $1 AND is_read = false AND is_deleted = false';
  const result = await query(dbName, sql, [userId]);
  return result.rows[0].unread_count;
};

module.exports = { 
  createNotification, 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getUserSettings, 
  updateUserSettings, 
  getUnreadCount 
};