const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}

module.exports = generateAccessToken;