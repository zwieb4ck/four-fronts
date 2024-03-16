const express = require("express");
const { StarSystemFactory } = require("../core/starsystem/StarSystem.class");
const router = express.Router();

router.get("", getSolarSystem);
router.get("/:seed", getSolarSystemBySeed);

async function getSolarSystem(req, res) {
  try {
    res.status(200).json(StarSystemFactory.createStarSystem());
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}
async function getSolarSystemBySeed(req, res) {
  const seed = req.params.seed;

  try {
    res.status(200).json(StarSystemFactory.createStarSystem(seed));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
}

module.exports = router;
