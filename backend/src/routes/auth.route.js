const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { generateAccessToken, generateRefreshToken, randomCordinates } = require("../utils")
const { StarSystemFactory } = require("../core/starsystem/StarSystem.class");
const { STARTER_PLANETS } = require("../core/starsystem/Planet.class");
const router = express.Router();

class UserResponse {
  constructor(user, token) {
    this._id = user.id,
      this.name = user.name,
      this.email = user.email,
      this.auth = {
        token: token.token,
        refresh: token.refreshToken,
      }
      this.startSystem = user.startSystem;
  }
}

router.post('/refresh', refreshToken);
router.delete('/logout', logout)
router.post('/login', login);

async function login(req, res) {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    res.status(400).send('cannot find user')
    return;
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = {
        token: generateAccessToken(user.id),
        refreshToken: generateRefreshToken(user.id)
      }
      if(!user.startSystem || user.startSystem.length === 0) {

        let startSystem = '';
        const tries = 0;
        while(tries < 1000) {
          startSystem = randomCordinates();
          const system = StarSystemFactory.createStarSystem(startSystem);
          starterPlanets = system.planets.filter(p => STARTER_PLANETS.includes(p.type));
          if (starterPlanets.length > 0) {
            const planet = starterPlanets[Math.floor(Math.random() * starterPlanets.length)]
            startSystem += '/' + system.planets.indexOf(planet);
            break;
          }
          tries++;
        }
        await User.updateOne({id: user._id, startSystem});
      }

      await User.findByIdAndUpdate(user.id, token);
      const responseUser = new UserResponse(user, token);
      if (user.isAdmin) {
        responseUser.isAdmin = true;
      }
      if (user.isSuperAdmin) {
        responseUser.isSuperAdmin = true;
      }
      res.status(200).json(responseUser);
    } else {
      res.status(403).send();
    }
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
}



function refreshToken(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.status(400).send();
  } else {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
      console.log(err)
      if (err) return res.status(403).send();
      const userId = result.userId;
      const token = {
        token: generateAccessToken(userId), refreshToken: generateRefreshToken(userId)
      };
      await User.findByIdAndUpdate(userId, token);
      const user = await User.findById(userId);
      const responseUser = new UserResponse(user, token);
      if (user.isAdmin) {
        responseUser.isAdmin = true;
      }
      if (user.isSuperAdmin) {
        responseUser.isSuperAdmin = true;
      }
      res.status(200).json(responseUser);
    })
  }
}

async function logout(req, res) {
  const refreshToken = req.body.token;
  if (refreshToken === null) {
    res.status(401).send();
  } else {
    const user = await User.findOne({ refreshToken: refreshToken })
    if (!user) return res.status(403).send();
    const userId = user.id
    const token = {
      token: "", refreshToken: ""
    };
    await User.findByIdAndUpdate(userId, token);
    res.status(200).json();
  }
}

module.exports = router;