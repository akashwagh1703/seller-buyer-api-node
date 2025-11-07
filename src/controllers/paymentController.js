const paymentModel = require('../models/paymentModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const initiatePayment = async (req, res) => {
  try {
    const payment = await paymentModel.createPayment(req.dbName, req.body);
    sendSuccess(res, payment, 'Payment_Initiated');
  } catch (error) {
    logger.error('Payment initiation error', { error: error.message });
    sendError(res, 'Payment_Failed', 500);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { payment_id, transaction_id, status } = req.body;
    const payment = await paymentModel.updatePayment(req.dbName, payment_id, {
      transaction_id,
      status,
      verified_on: new Date()
    });
    sendSuccess(res, payment, 'Payment_Verified');
  } catch (error) {
    logger.error('Payment verification error', { error: error.message });
    sendError(res, 'Verification_Failed', 500);
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const payments = await paymentModel.getUserPayments(req.dbName, user_id);
    sendSuccess(res, payments, 'Payment_History_Retrieved');
  } catch (error) {
    logger.error('Payment history error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const refundPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { refund_amount, reason } = req.body;
    const refund = await paymentModel.createRefund(req.dbName, {
      payment_id,
      refund_amount,
      reason,
      status: 'pending'
    });
    sendSuccess(res, refund, 'Refund_Initiated');
  } catch (error) {
    logger.error('Refund error', { error: error.message });
    sendError(res, 'Refund_Failed', 500);
  }
};

const getPaymentMethods = async (req, res) => {
  try {
    const methods = await paymentModel.getPaymentMethods(req.dbName);
    sendSuccess(res, methods, 'Payment_Methods_Retrieved');
  } catch (error) {
    logger.error('Payment methods error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

module.exports = { initiatePayment, verifyPayment, getPaymentHistory, refundPayment, getPaymentMethods };