import { Planet, getPlanets } from "./Planet.class";
import { Star, StarFactory } from "./Star.class";

export class StarSystem {
    public planets: Planet[] = [];

    constructor(public sun: Star) {}

    public generatePlanets(amount: number, sun: Star): void {
        this.planets = getPlanets(this.sun.type, 0.25, amount, sun)
    }
}

export class StarSystemFactory {
    public static createRandom() {
        const StarConstructor = StarFactory.getRandomType();
        const planets = StarConstructor.getRandomPlanetCount();
        const star = StarFactory.create(StarConstructor.type, StarConstructor.getRandomGravity(), StarConstructor.getRandomMass(), StarConstructor.getRandomLuminosity());
        const starSystem = new StarSystem(star);
        starSystem.generatePlanets(planets, star);
        return starSystem;
    }
}