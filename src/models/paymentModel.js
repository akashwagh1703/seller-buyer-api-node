const { query } = require('../config/database');

const createPayment = async (dbName, paymentData) => {
  const { user_id, order_id, amount, payment_method, gateway } = paymentData;
  const sql = `INSERT INTO payments (user_id, order_id, amount, payment_method, gateway, status, created_on) 
    VALUES ($1, $2, $3, $4, $5, 'pending', NOW()) RETURNING *`;
  const result = await query(dbName, sql, [user_id, order_id, amount, payment_method, gateway]);
  return result.rows[0];
};

const updatePayment = async (dbName, paymentId, updateData) => {
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

  values.push(paymentId);
  const sql = `UPDATE payments SET ${fields.join(', ')}, updated_on = NOW() WHERE id = $${paramCount} RETURNING *`;
  const result = await query(dbName, sql, values);
  return result.rows[0];
};

const getUserPayments = async (dbName, userId) => {
  const sql = `SELECT p.*, o.total_amount as order_amount 
    FROM payments p 
    LEFT JOIN orders o ON o.id = p.order_id 
    WHERE p.user_id = $1 
    ORDER BY p.created_on DESC`;
  const result = await query(dbName, sql, [userId]);
  return result.rows;
};

const createRefund = async (dbName, refundData) => {
  const { payment_id, refund_amount, reason, status } = refundData;
  const sql = `INSERT INTO refunds (payment_id, refund_amount, reason, status, created_on) 
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
  const result = await query(dbName, sql, [payment_id, refund_amount, reason, status]);
  return result.rows[0];
};

const getPaymentMethods = async (dbName) => {
  const sql = 'SELECT * FROM payment_methods WHERE is_active = true ORDER BY sort_order';
  const result = await query(dbName, sql, []);
  return result.rows;
};

const getPaymentById = async (dbName, paymentId) => {
  const sql = 'SELECT * FROM payments WHERE id = $1';
  const result = await query(dbName, sql, [paymentId]);
  return result.rows[0];
};

module.exports = { createPayment, updatePayment, getUserPayments, createRefund, getPaymentMethods, getPaymentById };