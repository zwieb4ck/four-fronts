const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.model")
const { generateAccessToken, generateRefreshToken, authenticateToken } = require("../utils");

const router = express.Router();

router.get('', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.post('', createUser);

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users)
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).send()
    }
    res.status(200).json(user)
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}



function canDelete(reqUser, user) {
  if (!user.isSuperAdmin && !user.isAdmin) {
    return true;
  }
  return reqUser.isSuperAdmin || false;
}

function canEdit(reqUser, user) {
  if (reqUser.isSuperAdmin) return true;
  if (reqUser.isAdmin && !user.isSuperAdmin) return true;
  return false;
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send();
    }
    if (!canEdit(req.user, user)) {
      return res.status(403).send();
    }
    const password = req.body.password && req.body.password.length > 0 ? await bcrypt.hash(req.body.password, 10) : user.password;
    const userUpdate = {
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      isSuperAdmin: req.body.isSuperAdmin,
      password: password,
    }
    await User.findByIdAndUpdate(userId, userUpdate)
    return res.status(200).send()
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

async function deleteUser(req, res) {
  try {

    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send();
    }
    if (!canDelete(req.user, user)) {
      return res.status(403).send();
    }
    await User.findByIdAndDelete(userId);
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send()
  }
}

async function createUser(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { name: req.body.name, password: hashedPassword, email: req.body.email };
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send(409).send();
    }
    const user = new User(userData);
    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.token = token;
    user.refreshToken = refreshToken;
    user.save()

    res.status(201).send();
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
}

module.exports = router;