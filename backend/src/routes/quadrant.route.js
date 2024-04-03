const express = require("express");
const { StarSystem, StarSystemFactory } = require("../core/starsystem/StarSystem.class");

const router = express.Router()

router.get("/:quadrant", getQuadrant);

async function getQuadrant(req, res) {
    try {
        const quadrant = req.params.quadrant;
        res.status(200).json(StarSystemFactory.createQuadrant(quadrant))
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

module.exports = router;