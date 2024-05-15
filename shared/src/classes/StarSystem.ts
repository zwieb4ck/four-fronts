import { Vector2 } from "three";
import { HexGrid } from "./Grid";
import { PRNG } from "./PRNG";

export enum STAR_CATEGORIES {
    Pop1, // old
    Pop2, // midaged
    Pop3, // young
}

type SpectralClass = {
    key: string;
    min: number;
    max: number;
    type: string[];
    innerRing: number;
    minRings: number;
    maxRings: number;
    assets: string[];
};

const SPECTRAL_CLASS = [
    { key: "M", min: 750, max: 3500, innerRing: 1, minRings: 4, maxRings: 5, type: ["Red Dwarf", "Red Giant"], assets: ["assets/images/suns/red-giant.png"] },
    { key: "K", min: 3500, max: 5000, innerRing: 2, minRings: 5, maxRings: 7, type: ["Red Dwarf", "Red Giant"], assets: ["assets/images/suns/red-giant.png"] },
    { key: "G", min: 5000, max: 6000, innerRing: 3, minRings: 6, maxRings: 9, type: ["Main Sequence"], assets: ["assets/images/suns/main-sequence.png"] },
    { key: "F", min: 6000, max: 7500, innerRing: 4, minRings: 7, maxRings: 11, type: ["Neutron Star"], assets: ["assets/images/suns/neutron-star.png"] },
    { key: "A", min: 7500, max: 10000, innerRing: 5, minRings: 8, maxRings: 12, type: ["White Dwarf", " White Giant"], assets: ["assets/images/suns/white-dwarf.png"] },
    { key: "B", min: 10000, max: 30000, innerRing: 6, minRings: 9, maxRings: 13, type: ["Blue Dwarf", "Blue Giant"], assets: ["assets/images/suns/blue-giant.png"] },
    {
        key: "O",
        min: 30000,
        max: 150000,
        innerRing: 7,
        minRings: 10,
        maxRings: 14,
        type: ["Blue Giant", " Blue Hypergiant"],
        assets: ["assets/images/suns/blue-giant.png"]
    },
    {
        key: "BH",
        min: 150000,
        max: Infinity,
        innerRing: -1,
        minRings: 0,
        maxRings: 0,
        type: ["Black Hole"], 
        assets: ["assets/images/suns/black-hole.png"]
    }
];

export class Body {
    protected random: PRNG;
    protected childen: Body[] = [];
    public type!: string;
    public mass: number = 0;

    public image = new Image();
    public imageLoaded = false;

    protected get childBodiesCount(): number {
        return 0;
    }

    constructor(public coordinates: string) {
        this.random = new PRNG(coordinates);
    }

    public draw(
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        context: CanvasRenderingContext2D) {}
}

export class Sun extends Body {
    public categorie: STAR_CATEGORIES = this.random.choice([
        STAR_CATEGORIES.Pop1,
        STAR_CATEGORIES.Pop2,
        STAR_CATEGORIES.Pop3,
    ]);
    public mass: number;
    public temperatur: number;
    public class: SpectralClass;
    public innerRing = 0;
    public outerRing = 0;
    public grid!: HexGrid;

    public image = new Image();
    public imageLoaded = false;

    constructor(public coordinates: string) {
        super(coordinates);
        this.mass = this.generateMass();
        this.class = this.random.choice(SPECTRAL_CLASS.filter(c => c.key !== "bh".toUpperCase()));
        this.temperatur = this.genearteTemperature();
        this.type = this.mass >= 5 && this.class.type.length > 1 ? this.class.type[1] : this.class.type[0];
        this.innerRing = this.class.innerRing + Math.ceil(this.mass);
        this.outerRing = this.random.nextRange(this.class.minRings, this.class.maxRings) + this.innerRing;
        this.image.onload = ()=> this.imageLoaded = true;
        this.image.src = this.class.assets[0];
    }

    public get hexagonsCount() {
        return this.grid.grid.flat().length;
    }

    public get isGiant() {
        return this.mass >= 5;
    }

    protected generateMass(): number {
        switch (this.categorie) {
            case STAR_CATEGORIES.Pop1:
                return this.random.percentageChance(
                    [0.3, 0.5, 0.8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    [0.001, 0.01, 0.1, 1, 5, 15, 35, 45, 55, 45, 15, 5]
                );
            case STAR_CATEGORIES.Pop2:
                return this.random.percentageChance(
                    [0.3, 0.5, 0.8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    [0.1, 1, 2, 5, 35, 45, 55, 45, 35, 5, 2, 1, 0.1]
                );
            case STAR_CATEGORIES.Pop3:
                return this.random.percentageChance(
                    [5, 0.5, 0.8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    [5, 15, 45, 55, 45, 35, 15, 5, 1, 0.1, 0.01, 0.001]
                );
            default:
                return this.random.nextRange(0, 10) + this.random.nextFloat();
        }
    }

    private genearteTemperature() {
        return this.random.nextRange(this.class.min, this.class.max);
    }

    public generateGrid() {
        const grid = new HexGrid();
        grid.buildHexagonGrid(this.outerRing);
        grid.cutOut(this.innerRing);
        this.grid = grid;
    }

    public draw(
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        context: CanvasRenderingContext2D) {
        if(this.imageLoaded) {
            
        }
    }

    public onClick() {
        console.log(this);
    }
}

export class BlackHole extends Sun {
    public mass = Infinity;
    public innerRing: number = -1;
    public outerRing: number = 0;

    public image = new Image();
    public imageLoaded = false;

    constructor(public coordiantes: string) {
        super(coordiantes);
        this.class = SPECTRAL_CLASS.find(f => f.key === "bh".toUpperCase())!;
        this.mass = Infinity;
        this.innerRing = this.class.innerRing;
        this.outerRing = 0;
        this.image.onload = ()=> this.imageLoaded = true;
        this.image.src = this.class.assets[0];
    }

    override get childBodiesCount() {
        return 0;
    }

    public randomCordinates() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let coordinate = "";
        for (let x = 0; x < 3; x++) {
            for (let i = 0; i < 2; i++) {
                const randomIndex = Math.floor(this.random.nextFloat() * characters.length);
                coordinate += characters[randomIndex];
            }
        }
        coordinate += "/" + Math.ceil(Math.random() * 12);
        return coordinate;
    }
}

export class Planet extends Body {
    constructor(public coordinates: string) {
        super(coordinates);
    }
}

export class StarSystem {
    private random: PRNG;

    public suns: Sun[] = [];
    public planets: { [key: string]: Planet } = {};
    public grid!: HexGrid;

    public imageLoaded = false;
    public image = new Image();

    constructor(public coordinates: string) {
        this.random = new PRNG(this.coordinates);
        this.initializeSuns();
        this.initializeGrid();
        this.initializePlanets();
    }

    public initializeSuns() {
        if (this.random.nextRange(0, 25) === 12) {
            this.suns.push(new BlackHole(this.coordinates));
        } else {
            this.suns.push(new Sun(this.coordinates));
        }
    }

    public initializeGrid() {
        this.suns.forEach((s) => s.generateGrid());
        this.suns.sort((a: Sun, b: Sun) => b.outerRing - a.outerRing);
        this.suns[0].grid.centerTile.applyBody(this.suns[0]);
        this.grid = this.suns[0].grid;
        this.grid.getCorners();
        if (this.suns.length > 1) {
            for (let i = 1; i < this.suns.length; i++) {
                const corner = this.random.choice(this.grid.getCorners());
                this.suns[i].grid.defineCenterPoint(corner.coords);
                this.grid.merge(this.suns[i].grid.grid);
                corner.applyBody(this.suns[i]);
            }
        }
    }

    public isBlackHole() {
        return this.suns[0] instanceof BlackHole;
    }

    public draw(
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        context: CanvasRenderingContext2D) {}

    public initializePlanets() {}
}
