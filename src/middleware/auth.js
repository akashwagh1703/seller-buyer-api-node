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

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.header("authorization")?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, msg: "A token is required for authorization" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usersModel = require('../models/usersModel');
    
    // Try to find user by phone first, then by userId
    let user = null;
    if (decoded.phone) {
      user = await usersModel.findByPhone(req.dbName, decoded.phone);
    } else if (decoded.userId) {
      const sql = 'SELECT * FROM client WHERE is_deleted = false AND id = $1';
      const result = await require('../config/database').query(req.dbName, sql, [decoded.userId]);
      user = result.rows[0];
    }
    
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid user associated with the token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, msg: "Invalid Token" });
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
