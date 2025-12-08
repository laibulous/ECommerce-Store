// ============================================
// backend/utils/generateToken.js
// ============================================
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.test.JWT_SECRET, {
    expiresIn: process.env.test.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken;
