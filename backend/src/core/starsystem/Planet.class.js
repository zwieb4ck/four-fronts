const PseudoRandom = require("../../utils/PseudoRandom");

const PLANET_TYPES = {
    TERRESTRIALPLANET: "TerrestrialPlanet",
    GASGIANT: "GasGiant",
    ICEGIANT: "IceGiant",
    EXOPLANET: "Exoplanet",
    HABITABLEPLANET: "HabitablePlanet",
    DESERTPLANET: "DesertPlanet",
    OCEANWORLD: "OceanWorld",
    HOTJUPITER: "HotJupiter",
    DWARFPLANET: "DwarfPlanet",
}

const STARTER_PLANETS = [
    PLANET_TYPES.TERRESTRIALPLANET,
    PLANET_TYPES.ICEGIANT,
    PLANET_TYPES.EXOPLANET,
    PLANET_TYPES.HABITABLEPLANET,
    PLANET_TYPES.DESERTPLANET,
]

class Planet {
    static type = PLANET_TYPES;


    static getRandomGravity() {
        return 1;
    }

    static getRandomMass() {
        return 1;
    }

    static getRandomLuminosity() {
        return 1;
    }

    static getRandomPlanetCount() {
        return 0;
    }

    constructor(type, distance, speed, mass) {
        this.type = type;
        this.distance = distance;
        this.speed = speed;
        this.mass = mass;
        this.moons = [];
    }

    static calculateOrbitalSpeed(distanceAU, sunMass) {
        const G = 6.674 * Math.pow(10, -11); // Gravitationskonstante in m^3 kg^-1 s^-2
        const massOfSun = sunMass * Math.pow(10, 30); // Masse der Sonne in kg
        const AU = 1.496 * Math.pow(10, 11); // Astronomische Einheit in Metern
        // Umwandlung der Entfernung von AE in Meter
        const distanceMeters = distanceAU * AU;
        // Berechnung der Umlaufgeschwindigkeit
        const speed = Math.sqrt(G * massOfSun / distanceMeters);
        return speed; // Geschwindigkeit in Metern pro Sekunde
    }

    get orbitalPeriod() {
        const AU = 1.496 * Math.pow(10, 11); // Astronomische Einheit in Metern
        const circumference = 2 * Math.PI * this.distance * AU; // Umlaufbahn in Metern
        const periodSeconds = circumference / this.speed; // Umlaufzeit in Sekunden
        const periodDays = periodSeconds / (60 * 60 * 24); // Umlaufzeit in Tagen

        return periodDays;
    }
}

const planetGridConfig = {
    TerrestrialPlanet: {type: "procedual", maxMass: 2, minSize: 15, maxSize: 35, fillPercentage: 55 },
    GasGiant: {type: "ring", innerRings: 7, outerRings: 10},
    IceGiant: {type: "procedual", minSize: 30, maxSize: 50, fillPercentage: 40},
    Exoplanet: {type: "procedual", minSize: 25, maxSize: 40, fillPercentage: 70},
    HabitablePlanet: {type: "procedual", minSize: 25, maxSize: 40, fillPercentage: 65},
    DesertPlanet: {type: "procedual", minSize: 25, maxSize: 4, fillPercentage: 75},
    OceanWorld: {type: "circle", minSize: 15, maxSize: 40 },
    HotJupiter: {type: "ring", innerRings: 9, outerRings: 12},
    DwarfPlanet: {type: "procedual", minSize: 10, maxSize: 25, fillPercentage: 80},
    Moon: { type: "square", minSize: 5, maxSize: 10 }
}

const planetDistances = {
    MainSequenceStar: {
        TerrestrialPlanet: { exist: true, min: 2, max: 3, minMass: 1, maxMass: 2 },
        GasGiant: { exist: true, min: 3, max: 4, minMass: 5, maxMass: 7 },
        IceGiant: { exist: true, min: 4, max: 5, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 5, max: 5, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: true, min: 6, max: 6, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: true, min: 7, max: 8, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: true, min: 9, max: 10, minMass: 0.1, maxMass: 2 },
        HotJupiter: { exist: true, min: 11, max: 12, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 13, max: 14, minMass: 0.5, maxMass: 1 },
    },
    RedGiant: {
        TerrestrialPlanet: { exist: false, min: 0, max: 0, minMass: 0.1, maxMass: 10 },
        GasGiant: { exist: true, min: 5, max: 8, minMass: 5, maxMass: 7 },
        IceGiant: { exist: true, min: 5, max: 8, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 5, max: 9, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: true, min: 2, max: 4, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 10, max: 15, minMass: 0.5, maxMass: 1 },
    },
    WhiteDwarf: {
        TerrestrialPlanet: { exist: true, min: 2, max: 3, minMass: 1, maxMass: 2 },
        GasGiant: { exist: false, min: 0, max: 0, minMass: 5, maxMass: 7 },
        IceGiant: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 3, max: 5, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: true, min: 3, max: 5, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: true, min: 4, max: 6, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: true, min: 5, max: 6, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: false, min: 0, max: 0, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 6, max: 9, minMass: 0.5, maxMass: 1 },
    },
    NeutronStar: {
        TerrestrialPlanet: { exist: false, min: 0, max: 0., minMass: 1, maxMass: 2 },
        GasGiant: { exist: false, min: 0, max: 0, minMass: 5, maxMass: 7 },
        IceGiant: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: false, min: 0, max: 0, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 5, max: 7, minMass: 0.5, maxMass: 1 },
    }
};

function getPlanets(type, minGap, amount, sun, seed) {
    const planetTypes = Object.entries(planetDistances[type]).filter(([key, val]) => val.exist === true).map(([key, val]) => key);
    const result = [];
    const prng = new PseudoRandom(seed);
    let lastMax = 0;

    for (let i = 0; i < amount; i++) {
        const planetType = planetTypes[i % planetTypes.length];
        const planet = planetDistances[type][planetType];
        const distanceRange = planetDistances[type][planetType];
        const distance = prng.nextRange(distanceRange.min, distanceRange.max);
        const mass = prng.nextRange(planet.minMass, planet.maxMass);
        const newPlanet = new Planet(planetType, distance, Planet.calculateOrbitalSpeed(distance, sun.mass), mass)
        newPlanet.coords = seed + '/' + (i + 1);
        result.push(newPlanet);
        lastMax = distance;
    }

    return result;
}

module.exports = {PLANET_TYPES, Planet, planetDistances, getPlanets, STARTER_PLANETS, planetGridConfig}