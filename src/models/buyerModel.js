const { query } = require('../config/database');

const getDashboardData = async (dbName, buyerId) => {
  const sql = `SELECT 
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_spent
    FROM orders WHERE buyer_id = $1 AND is_deleted = false`;
  const result = await query(dbName, sql, [buyerId]);
  return result.rows[0];
};

const getBuyerOrders = async (dbName, buyerId) => {
  const sql = `SELECT o.*, p.name as product_name, s.first_name as seller_name 
    FROM orders o 
    LEFT JOIN products p ON p.id = o.product_id 
    LEFT JOIN client s ON s.id = o.seller_id 
    WHERE o.buyer_id = $1 AND o.is_deleted = false 
    ORDER BY o.created_on DESC`;
  const result = await query(dbName, sql, [buyerId]);
  return result.rows;
};

const createOrder = async (dbName, orderData) => {
  const { buyer_id, seller_id, product_id, quantity, price, total_amount } = orderData;
  const sql = `INSERT INTO orders (buyer_id, seller_id, product_id, quantity, price, total_amount, status, created_on) 
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) RETURNING *`;
  const result = await query(dbName, sql, [buyer_id, seller_id, product_id, quantity, price, total_amount]);
  return result.rows[0];
};

const updateOrder = async (dbName, orderId, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  values.push(orderId);
  const sql = `UPDATE orders SET ${fields.join(', ')}, updated_on = NOW() WHERE id = $${paramCount} RETURNING *`;
  const result = await query(dbName, sql, values);
  return result.rows[0];
};

const getBuyerById = async (dbName, buyerId) => {
  const sql = 'SELECT * FROM client WHERE id = $1 AND is_deleted = false';
  const result = await query(dbName, sql, [buyerId]);
  return result.rows[0];
};

module.exports = { getDashboardData, getBuyerOrders, createOrder, updateOrder, getBuyerById };