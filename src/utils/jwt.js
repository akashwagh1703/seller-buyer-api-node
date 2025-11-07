const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  // Ensure payload is an object
  const tokenPayload = typeof payload === 'object' ? payload : { userId: payload };
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
