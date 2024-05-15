import { Vector2 } from "three";
import { Body, StarSystem, Sun } from "./StarSystem";

export class Tile {
    public ring: number = -1;
    public body: Body | StarSystem | null = null;

    constructor(private _coords: { x: number; y: number }, public rendered: boolean = true) {
        this.coords = _coords;
    }

    public get coords() {
        return this._coords;
    }

    public set coords(val: { x: number; y: number }) {
        this._coords = val;
    }

    public get neighbors() {
        const { x, y } = this.coords;
        return [
            {
                x: x - 1,
                y: y,
            },
            {
                x: x - 1,
                y: x % 2 === 0 ? y - 1 : y + 1,
            },
            {
                x: x,
                y: y - 1,
            },
            {
                x: x,
                y: y + 1,
            },
            {
                x: x + 1,
                y: y,
            },
            {
                x: x + 1,
                y: x % 2 === 0 ? y - 1 : y + 1,
            },
        ];
    }

    public applyBody(body: Body | StarSystem) {
        this.body = body;
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
        if (this.body && this.body instanceof Sun && this.body.imageLoaded) {
            const size = this.body.isGiant ? hexRectangleHeight * 0.45 : hexRectangleHeight * 0.25;
            // if(this.body.isGiant) {
            //     size / 8
            // }
            context.drawImage(
                this.body.image,
                positionVector.x + hexRectangleWidth / 2 - size/2,
                positionVector.y + hexRectangleHeight / 2 - size/2,
                size,
                size
            );
        }
    }

    public onClick() {
        if(this.body) {
            return {
                type: "routing",
                value: this.body.coordinates,
            }
        }
        return {
            type: "noop",
            value: null,
        }
    }
}
