const { HexGrid } = require("../grid/Grid");
const PseudoRandom = require("../util/PseudoRandom");
const { getPlanets, planetDistances } = require("./Planet.class");
const { StarFactory } = require("./Star.class");

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
        for(let i = 0; starSystem.planets.length > i; i++) {
            const currentPlanet = starSystem.planets[i];
            const planetTile = prng.choice(hexGrid.grid.flat().filter(t =>  t.ring === currentPlanet.distance && !t.planet));
            planetTile.planet = currentPlanet;
        }
        starSystem.grid = hexGrid;
        return starSystem;
    }
}

module.exports=  {
    StarSystem,
StarSystemFactory
}