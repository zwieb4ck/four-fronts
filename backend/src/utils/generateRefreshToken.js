const jwt = require("jsonwebtoken");

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1W' })
}

module.exports = generateRefreshToken;