const jwt = require("jsonwebtoken");
const User = require("../models/User.model")

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).send(err)
      }
      req.user = await User.findById(user.userId);
      if (req.user) {
        next();
      } else {
        res.sendStatus(401)
      }
    })
  } else {
    res.sendStatus(401)
  }
}

function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.sendStatus(403);
  }
}

function isSuperAdmin(req, res, next) {
  if (req.user.isSuperAdmin) {
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = { authenticateToken, isAdmin, isSuperAdmin };