const sendSuccess = (res, data = null, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    error: false,
    status,
    data,
    message
  });
};

const sendError = (res, message = 'Error', status = 400, data = null) => {
  return res.status(status).json({
    success: false,
    error: true,
    status,
    data,
    message
  });
};

module.exports = { sendSuccess, sendError };
