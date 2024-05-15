const { HexGrid } = require("../grid/Grid");
const PseudoRandom = require("../../utils/PseudoRandom");
const { getPlanets, planetDistances, Planet } = require("./Planet.class");
const { StarFactory } = require("./Star.class");
const Moon = require("../starsystem/Moon.class");

class StarSystem {
    constructor(sun) {
        this.sun = sun;
        this.planets = [];
        this.grid = [[]]
    }

    get rings() {
        // return Math.ceil(this.sun.planetCountRange[1] *1.5);
        return Math.max(...Object.values(planetDistances[this.sun.type]).map(p => p.max)) + 1;
        // return Object.values().map(p => p.max);
    }

    generatePlanets(amount, sun, seed) {
        this.planets = getPlanets(this.sun.type, 0.25, amount, sun, seed)
    }
}

class StarSystemFactory {
    static createStarSystem(seed) {
        const prng = new PseudoRandom(seed);
        const star = StarFactory.create(seed);
        const starSystem = new StarSystem(star, seed);
        starSystem.generatePlanets(star.planetCount, star, seed);
        const hexGrid =  new HexGrid(starSystem.rings);
        hexGrid.grid[hexGrid.centerX][hexGrid.centerY].body = star;
        for(let i = 0; starSystem.planets.length > i; i++) {
            const currentPlanet = starSystem.planets[i];
            const planetTile = prng.choice(hexGrid.grid.flat().filter(t =>  t.ring === currentPlanet.distance && !t.planet));
            const moons = prng.choice([...new Array(50).fill(0),...new Array(100).fill(1), ...new Array(50).fill(2), ...new Array(25).fill(3), ...new Array(12).fill(4), ...new Array(6).fill(5), ...new Array(2).fill(6)]);
            const cordDef = ['a', 'b', 'c', 'd', 'e', 'f'];
            for(let i = 0; i < moons; i++) {
                currentPlanet.moons.push(new Moon(currentPlanet.coords + cordDef[i]));
            }
            planetTile.body = currentPlanet;
        }
        let i = 0;
        for(let x = 0; x < hexGrid.grid.length; x++) {
            for (let y = 0; y< hexGrid.grid[x].length; y++) {
                let currentTile = hexGrid.grid[x][y];
                if (currentTile?.body?.moons?.length > 0) {
                    if (currentTile?.body instanceof Planet) {
                        const possibleSpots = [
                            {
                                x: x - 1,
                                y: y
                            },
                            {
                                x: x - 1,
                                y: x % 2 === 0 ? y - 1 : y + 1
                            },
                            {
                                x: x,
                                y: y - 1
                            },
                            {
                                x: x,
                                y: y + 1
                            },
                            {
                                x: x + 1,
                                y: y
                            },
                            {
                                x: x + 1,
                                y: x % 2 === 0 ? y - 1 : y + 1
                            },
                        ];
                    for (let i = 0; i < currentTile.body.moons.length; i++) {
                        const possibleTiles = possibleSpots.map(coords => hexGrid.grid[coords.x][coords.y]).filter(tile => tile && !tile.body);
                        if(possibleTiles.length > 0) {
                            const choice = prng.choice(possibleTiles);
                            choice.body = currentTile.body.moons[i];
                        }
                    }
                    } 
                } 
            }
        }
        starSystem.grid = hexGrid;
        return starSystem;
    }

    static createQuadrant(quadrant) {
        const systems = [];
        for(let i = 0; i < 12; i++) {
            const seed = `${quadrant}/${i+1}`;
            const star = StarFactory.create(seed);
            const starSystem = new StarSystem(star, seed)
            starSystem.generatePlanets(star.planetCount, star, seed);
            starSystem.cords = seed;
            systems.push(starSystem);
        }
        return systems;
    }
}

module.exports=  {
    StarSystem,
StarSystemFactory
}