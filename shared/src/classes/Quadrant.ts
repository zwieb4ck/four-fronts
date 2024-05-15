import { Vector2, Vector3 } from "three";
import { PRNG } from "./PRNG";
import { BlackHole, StarSystem } from "./StarSystem";
import { HexGrid } from "./Grid";
import { Tile } from "./Tile";

export interface ICmd {
    type: string;
    value: any;
}

export interface IRouteCommand extends ICmd {
    type: string;
    value: string;
}

export class QuadrantTile extends Tile {
    public position: Vector2 = new Vector2();
    public label = "View Systems";

    constructor(coords: { x: number; y: number }, public rendered: boolean = true) {
        super(coords, rendered);
    }

    public onClick(): ICmd {
        return {
            type: "showQuadrant",
            value: "true",
        };
    }

    public draw(
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        context: CanvasRenderingContext2D
    ) {
        this.position = positionVector;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#ffffff";
        context.filter = "drop-shadow(16px 16px 20px rbga(0,0,0,1))";
        // context.moveTo(this.position.x + hexRadius, this.position.y);
        // context.lineTo(this.position.x + hexRectangleWidth, this.position.y + hexHeight);
        // context.lineTo(this.position.x + hexRectangleWidth, this.position.y + hexHeight + sideLength);
        // context.lineTo(this.position.x + hexRadius, this.position.y + hexRectangleHeight);
        // context.lineTo(this.position.x, this.position.y + sideLength + hexHeight);
        // context.lineTo(this.position.x, this.position.y + hexHeight);
        context.font = "100 20px Inter";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText(
            this.label,
            this.position.x + hexRectangleWidth / 2,
            this.position.y + hexRectangleHeight / 2,
            hexRectangleWidth - 20
        );
    }
}

export class NeighborQuadrantTile extends QuadrantTile {
    constructor(coords: { x: number; y: number }, public label: string, public rendered: boolean = true) {
        super(coords, rendered);
    }

    onClick(): IRouteCommand {
        return {
            type: "routing",
            value: this.label,
        };
    }
}

export class Quadrant {
    private characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    public random: PRNG;
    public systems: number;
    public quadrant = new HexGrid();
    public system = new HexGrid();
    public starSystem: { [coords: string]: StarSystem } = {};

    constructor(public coordinates: string) {
        this.random = new PRNG(coordinates);
        this.systems = this.random.nextRange(1, 12);
        this.starSystem = this.createSystem(this.coordinates, this.systems);
        this.createGrid();
        console.log("test")
        this.applyBodiesToTiles();
    }

    private createSystem(coordinates: string, amount: number) {
        const systemsAmount = amount;
        const starSystem: { [coords: string]: StarSystem } = {};
        for (let i = 0; i < systemsAmount; i++) {
            const systemCoords = `${coordinates}/${i + 1}`;
            starSystem[systemCoords] = new StarSystem(systemCoords);
        }
        return starSystem;
    }

    public coordPairToIndex(pair: string) {
        return this.characters.indexOf(pair[0]) * 36 + this.characters.indexOf(pair[1]);
    }

    public indexToCoordPair(index: number) {
        let primary = Math.floor(index / 36);
        let secondary = index % 36;
        return this.characters[primary] + this.characters[secondary];
    }

    public adjustCoordinatePair(coordPair: string, delta: number) {
        let currentIndex = this.coordPairToIndex(coordPair);
        let newIndex = (currentIndex + delta + 1296) % 1296; // 36 * 36 = 1296
        return this.indexToCoordPair(newIndex);
    }

    public adjustCoordinates(coords: string, vector: Vector3) {
        let x1 = coords.slice(0, 2);
        let y1 = coords.slice(2, 4);
        let z1 = coords.slice(4, 6);

        let xNew = this.adjustCoordinatePair(x1, vector.x);
        let yNew = this.adjustCoordinatePair(y1, vector.y);
        let zNew = this.adjustCoordinatePair(z1, vector.z);

        return xNew + yNew + zNew;
    }

    private createGrid() {
        const grid = [
            [
                undefined,
                new NeighborQuadrantTile(
                    { x: 0, y: 0 },
                    this.adjustCoordinates(this.coordinates, new Vector3(1, 0, 0)),
                    true
                ),
                new NeighborQuadrantTile(
                    { x: 0, y: 1 },
                    this.adjustCoordinates(this.coordinates, new Vector3(0, 1, 0)),
                    true
                ),
            ],
            [
                new NeighborQuadrantTile(
                    { x: 1, y: 0 },
                    this.adjustCoordinates(this.coordinates, new Vector3(0, 0, -1)),
                    true
                ),
                new QuadrantTile({ x: 1, y: 1 }, true),
                new NeighborQuadrantTile(
                    { x: 1, y: 2 },
                    this.adjustCoordinates(this.coordinates, new Vector3(0, 0, 1)),
                    true
                ),
            ],
            [
                undefined,
                new NeighborQuadrantTile(
                    { x: 2, y: 0 },
                    this.adjustCoordinates(this.coordinates, new Vector3(0, -1, 0)),
                    true
                ),
                new NeighborQuadrantTile(
                    { x: 2, y: 1 },
                    this.adjustCoordinates(this.coordinates, new Vector3(-1, 0, 0)),
                    true
                ),
            ],
        ];
        this.quadrant.buildCustomGrid(grid as Tile[][]);
        this.system.buildGrid(8, 4);
    }

    public applyBodiesToTiles() {
        /*const tilesForBodies = this.random.choiceMultipleUnique(this.system.grid.flat(), this.systems);
        console.log(this.systems, this.starSystem)
        tilesForBodies.forEach((t, i)=>t.body = Object.values(this.starSystem)[i].suns[0]);*/
        let systems = Object.values(this.starSystem)
        for (let i = 0; i < systems.length; i++) {
            const tile = this.random.choice(this.system.grid.flat().filter(t => !t.body));
            tile.applyBody(systems[i].suns[0]);
        }
    }

    // private getNextAdress(firstChar:string, secondChar: string, Vector: number) {
    //     if (COORDS_TEMPLATE.indexOf(secondChar) === 0 || COORDS_TEMPLATE.indexOf(secondChar) === COORDS_TEMPLATE.length - 1) {

    //     }
    // }

    public randomCordinates() {
        let coordinate = "";
        for (let x = 0; x < 3; x++) {
            for (let i = 0; i < 2; i++) {
                const randomIndex = Math.floor(Math.random() * this.characters.length);
                coordinate += this.characters[randomIndex];
            }
        }
        return coordinate;
    }

    public findBlackHole() {
        let tries = 0;
        let blackHole = null;
        while (tries < 10) {
            const randomCoords = this.randomCordinates();
            const amount = new Quadrant(randomCoords).systems;
            const system = this.createSystem(randomCoords, amount);
            const suns = Object.values(system).map((sy) => sy.suns[0]);
            const blackHoles = suns.filter((s) => s instanceof BlackHole);
            if (blackHoles.length > 0) {
                blackHole = randomCoords + `/${suns.indexOf(blackHoles[0]) + 1}`;
                break;
            }
            if (tries === 999) {
                console.error("no blackHole Found");
            }
            tries++;
        }
        return blackHole;
    }
}
