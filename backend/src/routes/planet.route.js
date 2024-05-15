const express = require("express");
const { StarSystemFactory } = require("../core/starsystem/StarSystem.class");
const RandomWalkGenerator = require("../core/grid/Walker");
const PseudoRandom = require("../utils/PseudoRandom");
const {planetGridConfig} = require("../core/starsystem/Planet.class");
const { HexGrid } = require("../core/grid/Grid");

const router = express.Router()

router.get("/:quadrant/:system/:planet", getPlanet);

const moons = ['a', 'b', 'c', 'd', 'e', 'f'];

async function getPlanet(req, res) {
    try {
        const {quadrant, system} = req.params.quadrant;
        const starSystem = StarSystemFactory.createStarSystem(`${quadrant}/${system}`);
        const [planet, moonIndex] = req.params.planet.match(/[a-zA-Z]+|[0-9]+/g);
        const body = !moonIndex ? starSystem.planets[parseInt(planet, 10) - 1] : starSystem.planets[parseInt(planet, 10) - 1].moons[moons.indexOf(moonIndex)];
        const seed = `${quadrant}/${system}/${planet}`;
        const prng = new PseudoRandom(seed);
        if(!body) {
            console.log(seed);
        }
        if (planetGridConfig[body.type].type === "procedual") {
            const height = prng.nextRange(planetGridConfig[body.type].minSize,planetGridConfig[body.type].maxSize);
            const width = prng.nextRange(planetGridConfig[body.type].minSize,planetGridConfig[body.type].maxSize);
            const walker = new RandomWalkGenerator(width, height, seed, planetGridConfig[body.type].fillPercentage);
            body.grid = walker.grid;
            res.status(200).json(body)
        } else if(planetGridConfig[body.type].type === "ring") {
            const innerRings = planetGridConfig[body.type].innerRings;
            const outerRings = planetGridConfig[body.type].outerRings;
            const grid = new HexGrid(outerRings);
            grid.grid.forEach((row, x) => {
                row.forEach((t, y)=>{
                    if (t.ring && t.ring < innerRings) {
                        grid.grid[x][y] = undefined;
                    }
                })
            })
            console.log(grid.grid)
            body.config = planetGridConfig[body.type];
            body.grid = grid.grid;
            res.status(200).json(body);
        } else{
            res.status(200).json("notfound")
        }
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }
}

module.exports = router;