import { mathRange } from "src/app/core/utils/randomRange";
import { BoxGeometry, Color, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, SphereGeometry } from "three";

export enum STAR_TYPES {
    MAIN_SEQUENCE = "MainSequenceStar",
    RED_GIANT = "RedGiant",
    WHITE_DWRAFS = "WhiteDwarf",
    NEUTRON = "NeutronStar",
}

export class Star {
    public mesh!: Mesh;
    public color: Color = new Color('#000000');
    public static type: STAR_TYPES;
    protected astronomicalUnit: number = 10;

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

    public getRandomPlanetCount() {
        return 0;
    }

    constructor(
        public type: STAR_TYPES,
        public gravity: number,
        public mass: number,
        public luminosity: number) {
    }

    protected createMesh(): void {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: this.color });
        this.mesh = new Mesh(geometry, material);
    }
}

export class MainSequenceStar extends Star {
    public static override type = STAR_TYPES.MAIN_SEQUENCE;

    constructor(type: STAR_TYPES, gravity: number, mass: number, luminosity: number) {
        super(type, gravity, mass, luminosity);
        this.color = new Color("#FDB813");
        this.createMesh();
    }

    public static override getRandomGravity() {
        return mathRange(0.5, 0.5);
    }

    public static override getRandomMass() {
        return mathRange(1, 1);
    }

    public static override getRandomLuminosity() {
        return mathRange(0.7, 1.3);
    }

    public static override getRandomPlanetCount() {
        return mathRange(4, 8)
    }

    public override getRandomPlanetCount() {
        return mathRange(4, 8)
    }
}

export class RedGiant extends Star {
    public static override type = STAR_TYPES.RED_GIANT;

    constructor(type: STAR_TYPES, gravity: number, mass: number, luminosity: number) {
        super(type, gravity, mass, luminosity);
        this.color = new Color("#FF5733");
        this.createMesh();
    }

    public static override getRandomGravity() {
        return mathRange(0.25, 0.75);
    }
    public static override getRandomMass() {
        return mathRange(3, 5);
    }
    public static override getRandomLuminosity() {
        return mathRange(1.5, 2);
    }

    public static override getRandomPlanetCount() {
        return mathRange(2, 5)
    }

    public override getRandomPlanetCount() {
        return mathRange(2, 5)
    }
}

export class WhiteDwarf extends Star {
    public static override type = STAR_TYPES.WHITE_DWRAFS;

    constructor(type: STAR_TYPES, gravity: number, mass: number, luminosity: number) {
        super(type, gravity, mass, luminosity);
        this.color = new Color("#FFFFFF");
        this.createMesh();
    }

    public static override getRandomGravity() {
        return mathRange(4, 6);
    }
    public static override getRandomMass() {
        return mathRange(0.6, 1.4);
    }
    public static override getRandomLuminosity() {
        return mathRange(0.6, 1.4);
    }

    public static override getRandomPlanetCount() {
        return mathRange(5, 10)
    }

    public override getRandomPlanetCount() {
        return mathRange(5, 10)
    }
}

export class NeutronStar extends Star {
    public static override type = STAR_TYPES.NEUTRON;

    constructor(type: STAR_TYPES, gravity: number, mass: number, luminosity: number) {
        super(type, gravity, mass, luminosity);
        this.color = new Color("#000019");
        this.createMesh();
    }

    public static override getRandomGravity() {
        return mathRange(4, 6);
    }
    public static override getRandomMass() {
        return mathRange(0.6, 1.4);
    }
    public static override getRandomLuminosity() {
        return mathRange(1.4, 3);
    }

    public static override getRandomPlanetCount() {
        return mathRange(0, 2);
    }

    public override getRandomPlanetCount() {
        return mathRange(0, 2);
    }

    protected override createMesh(): void {
        const geometry = new IcosahedronGeometry(1, 15);
        const material = new MeshPhysicalMaterial({
            color: this.color,
            roughness: 0,
            transmission: 1,
            thickness: 1.5,
            transparent: true,
        });
        this.mesh = new Mesh(geometry, material);
    }
}

export class StarFactory {
    static create(
        type: STAR_TYPES,
        gravity: number,
        mass: number,
        luminosity: number,
    ): Star {
        switch (type) {
            case STAR_TYPES.MAIN_SEQUENCE: return new MainSequenceStar(type, gravity, mass, luminosity);
            case STAR_TYPES.RED_GIANT: return new RedGiant(type, gravity, mass, luminosity);
            case STAR_TYPES.WHITE_DWRAFS: return new WhiteDwarf(type, gravity, mass, luminosity);
            case STAR_TYPES.NEUTRON: return new NeutronStar(type, gravity, mass, luminosity);
            default: return new Star(type, gravity, mass, luminosity);
        }
    }

    public static getRandomType(): typeof Star {
        const mainSequenceChances = new Array(20).fill(MainSequenceStar);
        const redGiantChances = new Array(8).fill(RedGiant);
        const whiteDwarfChances = new Array(2).fill(WhiteDwarf);
        const neutronChances = new Array(1).fill(NeutronStar);
        const allChances = [
            ...mainSequenceChances,
            ...redGiantChances,
            ...whiteDwarfChances,
            ...neutronChances
        ];
        return allChances[Math.floor(Math.random() * allChances.length)];
    }
}