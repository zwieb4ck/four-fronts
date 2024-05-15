import { Mesh, Color, SphereGeometry, MeshBasicMaterial, DoubleSide, MeshStandardMaterial, Object3D, RingGeometry } from "three";
import { STAR_TYPES, Star } from "./Star.class";
import { mathRange } from "src/app/core/utils/randomRange";

export enum PLANET_TYPES {
    TERRESTRIALPLANET = "TerrestrialPlanet",
    GASGIANT = "GasGiant",
    ICEGIANT = "IceGiant",
    EXOPLANET = "Exoplanet",
    HABITABLEPLANET = "HabitablePlanet",
    DESERTPLANET = "DesertPlanet",
    OCEANWORLD = "OceanWorld",
    HOTJUPITER = "HotJupiter",
    DWARFPLANET = "DwarfPlanet",
}

function randomColor() {
    const minHelligkeit = 200; // Mindesthelligkeit (0-255)
    const hexBuchstaben = "0123456789ABCDEF";
    let farbe = "#";

    for (let i = 0; i < 3; i++) {
        let hexWert = Math.floor(Math.random() * 256);
        while (hexWert < minHelligkeit) {
            hexWert = Math.floor(Math.random() * 256);
        }
        let hexString = hexWert.toString(16);
        if (hexString.length === 1) {
            hexString = "0" + hexString;
        }
        farbe += hexString;
    }

    return farbe;
}

export class Planet {
    public mesh!: Mesh;
    public color: Color = new Color('#000000');
    public planetObj: Object3D;
    public coords: string = "";
    public grid: any[][] = [[]]
    public static type: PLANET_TYPES;

    public static getRandomGravity() {
        return 1;
    }

    public static getRandomMass() {
        return 1;
    }

    public static getRandomLuminosity() {
        return 1;
    }

    public static getRandomPlanetCount() {
        return 0;
    }

    constructor(public type: PLANET_TYPES, public distance: number, public speed: number, public mass: number) {
        this.planetObj = this.createMesh();
    }

    // protected createMesh(): void {
    //     const geometry = new SphereGeometry(1, 24, 24);
    //     const material = new MeshBasicMaterial({ color: this.color });
    //     this.mesh = new Mesh(geometry, material);
    // }

    public static calculateOrbitalSpeed(distanceAU: number, sunMass: number) {
        const G = 6.674 * Math.pow(10, -11); // Gravitationskonstante in m^3 kg^-1 s^-2
        const massOfSun = sunMass * Math.pow(10, 30); // Masse der Sonne in kg
        const AU = 1.496 * Math.pow(10, 11); // Astronomische Einheit in Metern

        // Umwandlung der Entfernung von AE in Meter
        const distanceMeters = distanceAU * AU;

        // Berechnung der Umlaufgeschwindigkeit
        const speed = Math.sqrt(G * massOfSun / distanceMeters);

        return speed; // Geschwindigkeit in Metern pro Sekunde
    }

    public get orbitalPeriod() {
        const AU = 1.496 * Math.pow(10, 11); // Astronomische Einheit in Metern
        const circumference = 2 * Math.PI * this.distance * AU; // Umlaufbahn in Metern
        const periodSeconds = circumference / this.speed; // Umlaufzeit in Sekunden
        const periodDays = periodSeconds / (60 * 60 * 24); // Umlaufzeit in Tagen

        return periodDays;
    }

    public createMesh() {
        const size = this.mass / 10;
        const x = this.distance;
        const planetGeometry = new SphereGeometry(size, 50, 50);
        const planetMaterial = new MeshStandardMaterial({
            color: new Color(randomColor()),
        });
        console.log(randomColor())
        const planet = new Mesh(planetGeometry, planetMaterial);
        const planetObj = new Object3D();
        planet.position.set(x, 0, 0);
        // scene.add(planetObj);

        planetObj.add(planet);

        const ringGeo = new RingGeometry(x, x + 0.05);
        const ringMat = new MeshBasicMaterial({ color: new Color('#ffffff'), side: DoubleSide });
        const ringMesh = new Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        // createLineLoopWithMesh(x, 0xffffff, 3);
        return planetObj;
    }
}

export type PlanetConfig = {
    exist: boolean
    min: number,
    max: number,
    minMass: number,
    maxMass: number,
}

const planetDistances: { [key: string]: { [key: string]: PlanetConfig } } = {
    MainSequenceStar: {
        TerrestrialPlanet: { exist: true, min: 0.5, max: 1.5, minMass: 1, maxMass: 2 },
        GasGiant: { exist: true, min: 1.5, max: 5, minMass: 5, maxMass: 7 },
        IceGiant: { exist: true, min: 5, max: 10, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 10, max: 20, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: true, min: 0.8, max: 1.2, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: true, min: 1.2, max: 2, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: true, min: 2, max: 3, minMass: 0.1, maxMass: 2 },
        HotJupiter: { exist: true, min: 0.01, max: 0.5, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 20, max: 40, minMass: 0.5, maxMass: 1 },
    },
    RedGiant: {
        TerrestrialPlanet: { exist: false, min: 0, max: 0, minMass: 0.1, maxMass: 10 },
        GasGiant: { exist: true, min: 10, max: 30, minMass: 5, maxMass: 7 },
        IceGiant: { exist: true, min: 30, max: 50, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 50, max: 70, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: true, min: 5, max: 10, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 70, max: 100, minMass: 0.5, maxMass: 1 },
    },
    WhiteDwarf: {
        TerrestrialPlanet: { exist: true, min: 0.05, max: 0.5, minMass: 1, maxMass: 2 },
        GasGiant: { exist: false, min: 0, max: 0, minMass: 5, maxMass: 7 },
        IceGiant: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: true, min: 0.5, max: 2, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: true, min: 0.1, max: 0.5, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: true, min: 0.5, max: 1, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: true, min: 1, max: 1.5, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: false, min: 0, max: 0, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 2, max: 5, minMass: 0.5, maxMass: 1 },
    },
    NeutronStar: {
        TerrestrialPlanet: { exist: false, min: 0, max: 0., minMass: 1, maxMass: 2 },
        GasGiant: { exist: false, min: 0, max: 0, minMass: 5, maxMass: 7 },
        IceGiant: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        Exoplanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        HabitablePlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        DesertPlanet: { exist: false, min: 0, max: 0, minMass: 1, maxMass: 2 },
        OceanWorld: { exist: false, min: 0, max: 1.5, minMass: 1, maxMass: 2 },
        HotJupiter: { exist: false, min: 0, max: 0, minMass: 7, maxMass: 10 },
        DwarfPlanet: { exist: true, min: 0.1, max: 1, minMass: 0.5, maxMass: 1 },
    }
};

export function getPlanets(type: STAR_TYPES, minGap: number, amount: number, sun: Star) {
    const planetTypes = Object.entries(planetDistances[type]).filter(([key, val]) => val.exist === true).map(([key, val]) => key);
    const result = [];
    let lastMax = 0;

    for (let i = 0; i < amount; i++) {
        const planetType = planetTypes[i % planetTypes.length];
        const planet = planetDistances[type][planetType];
        const distanceRange = planetDistances[type][planetType];
        const distance = mathRange(distanceRange.min, distanceRange.max) + i + minGap + planet.maxMass;
        const mass = mathRange(planet.minMass, planet.maxMass);

        // Stellen Sie sicher, dass der Abstand innerhalb der max-Grenze bleibt
        // if (distance > distanceRange.max) {
        //     distance = distanceRange.min;
        // }

        result.push(new Planet(planetType as PLANET_TYPES, distance, Planet.calculateOrbitalSpeed(distance, sun.mass), mass));
        lastMax = distance;
    }

    return result;
}
