const db = require('../config/database');
const logger = require('./logger');

// Get client details
const getClientDetail = async (dbName, clientId) => {
  try {
    const sql = `SELECT id, first_name, last_name, profile_image, phone FROM client WHERE id = $1 AND is_deleted = false`;
    const result = await db.query(dbName, sql, [clientId]);
    return result.rows[0] || {};
  } catch (error) {
    logger.error('Get client detail error', { error: error.message });
    return {};
  }
};

// Show rating for seller/buyer
const showRating = async (dbName, userId, type = 'seller') => {
  try {
    const field = type === 'seller' ? 'seller_id' : 'buyer_id';
    const sql = `SELECT 
      COUNT(CASE WHEN rating_id = '1' THEN 1 END) as happy_count,
      COUNT(CASE WHEN rating_id = '2' THEN 1 END) as average_count,
      COUNT(CASE WHEN rating_id = '3' THEN 1 END) as poor_count
      FROM trade_product_rating
      WHERE ${field} = $1 AND is_deleted = false AND trade_product_id = 0`;
    const result = await db.query(dbName, sql, [userId]);
    return result.rows[0] || { happy_count: 0, average_count: 0, poor_count: 0 };
  } catch (error) {
    logger.error('Show rating error', { error: error.message });
    return { happy_count: 0, average_count: 0, poor_count: 0 };
  }
};

// Calculate revoke expiry time
const calculateRevokeTime = (sellerActionDate, revokeMinutes = 20) => {
  const actionDate = new Date(sellerActionDate);
  const revokeTime = new Date(actionDate.getTime() + revokeMinutes * 60000);
  const currentTime = new Date();
  
  const isExpired = revokeTime > currentTime;
  const timeLeftMinutes = isExpired ? (revokeTime - currentTime) / 60000 : 0;
  
  return {
    revoke_time: revokeTime.toISOString(),
    revoke_expire: isExpired,
    revoke_time_left: timeLeftMinutes,
    current_time: currentTime.toISOString()
  };
};

// Trade activity logs
const tradeActivityLogs = async (dbName, data) => {
  try {
    const insertSql = `INSERT INTO trade_activity_logs 
      (title, description, user_id, user_type, trade_product_id, trade_product_status, user_action, reason, created_on)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    await db.query(dbName, insertSql, [
      data.title,
      data.description,
      data.userid,
      data.user_type,
      data.trade_product_id,
      data.trade_product_status,
      data.user_action,
      data.reason,
      new Date()
    ]);
  } catch (error) {
    logger.error('Trade activity logs error', { error: error.message });
  }
};

// Calculate manage product status
const calculateManageProductStatus = (bidData, productStatus) => {
  const sellerAction = parseInt(bidData.seller_action);
  const buyerAction = parseInt(bidData.buyer_action);
  
  if ([1, 2].includes(buyerAction) && productStatus === 3) {
    if ([2, 3].includes(sellerAction)) {
      return { status: sellerAction, type: 'seller' };
    } else {
      return { status: buyerAction, type: 'buyer' };
    }
  }
  
  return { status: productStatus, type: 'product' };
};

module.exports = {
  getClientDetail,
  showRating,
  calculateRevokeTime,
  tradeActivityLogs,
  calculateManageProductStatus
};
