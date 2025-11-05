const jwt = require('jsonwebtoken');

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: true,
      status: 401,
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.headers['token'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: true,
      status: 401,
      message: 'Token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: true,
      status: 401,
      message: 'Invalid or expired token'
    });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers['token'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  }
  
  next();
};

module.exports = { verifyApiKey, verifyToken, optionalAuth };
