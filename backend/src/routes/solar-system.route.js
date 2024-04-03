const express = require("express");
const { StarSystemFactory } = require("../core/starsystem/StarSystem.class");
const router = express.Router();

router.get("", noop);
router.get("/:quadrant/:system", getSolarSystemBySeed);
// router.get("/:seed/:planet", getSolarSystemBySeed);

function noop(res) {
res.send(403);
}

async function getSolarSystem(req, res) {
  try {
    res.status(200).json(StarSystemFactory.createStarSystem());
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}
async function getSolarSystemBySeed(req, res) {
  
  const seed = `${req.params['quadrant']}/${req.params['system']}`;

  try {
    res.status(200).json(StarSystemFactory.createStarSystem(seed));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

module.exports = router;
