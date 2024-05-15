import { Tile } from "./Tile";
import { Body } from "./StarSystem";

export enum HEXGRID_TYPE {
    HEXAGON,
    GRID,
    RING,
    CUSTOM,
    UNDEFINED,
}

export class HexGrid {
    public grid: Tile[][] = [[]];
    public rings: number = -1;
    public width = 0;
    public height = 0;

    public gridType: HEXGRID_TYPE = HEXGRID_TYPE.UNDEFINED;

    constructor() {
        this.grid = [[]];
    }

    public get centerPoint() {
        return {
            x: this.rings > -1 ? this.rings : Math.floor(this.width / 2),
            y: this.rings > -1 ? this.rings : Math.floor(this.height / 2),
        };
    }

    public centerTile!: Tile;

    //#region HexGrid
    public buildHexagonGrid(rings: number): void {
        this.gridType = HEXGRID_TYPE.HEXAGON;
        this.rings = rings;
        this.width = this.rings * 2 + 1;
        let i, j, hexagons, xStart;
        for (i = 0; i < this.rings * 2 + 1; i++) {
            hexagons = this.width! - Math.abs(Math.floor(this.width! / 2) - i);
            xStart =
                (this.width! - 3) % 4 == 0
                    ? Math.ceil((this.width! - hexagons) / 2)
                    : Math.floor((this.width! - hexagons) / 2);
            this.grid[i] = [];
            for (j = xStart; j < xStart + hexagons; j++) {
                const hex = new Tile({ x: i, y: j });
                this.grid[i][j] = hex;
            }
        }
        this.applyRings(this.getTile(this.centerPoint) , this.rings);
        this.centerTile = this.grid[this.centerPoint.x][this.centerPoint.y];
    }

    public cutOut(innerRing: number) {
        this.gridType = HEXGRID_TYPE.RING;
        this.centerTile.rendered = false;
        const innerTiles = this.grid.flat().filter((t) => t && t.ring < innerRing && t.ring > 0);
        innerTiles.forEach((t) => {
            delete this.grid[t.coords.x][t.coords.y];
        });
    }

    public applyRings(tile: Tile, rings: number) {
        tile.ring = 0;
        for (let r = 0; r < rings; r++) {
            const current = this.grid.flat().filter((t) => t.ring === r);
            const next = current
                .map((c) => c.neighbors)
                .flat()
                .map((coords) => this.getTile(coords))
                .filter((t) => t && t.ring === -1);
            next.forEach((t) => (t.ring = r + 1));
        }
    }

    //#endregion

    //#region Grid
    public buildGrid(width: number, height: number): void {
        this.gridType = HEXGRID_TYPE.GRID;
        this.width = width;
        this.height = height;
        this.grid = new Array(this.height);
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                if (!this.grid[x]) {
                    this.grid[x] = [];
                }
                this.grid[x][y] = new Tile({ x: x, y: y });
            }
        }
    }
    //#endregion

    //#region customGrid
    
    public buildCustomGrid<T extends Tile>(grid:T[][]) {
        this.gridType = HEXGRID_TYPE.CUSTOM;
        this.width = grid.length;
        this.height = grid[0].length;
        this.grid = grid;
        grid.forEach((a,x) => a.forEach((b, y) => {
            if (grid[x][y] === undefined) {
                delete this.grid[x][y];
            }
        }))
    }

    //#endregion

    //#region utils

    public applyBody(coords: { x: number; y: number }, body: Body) {
        this.getTile(coords).applyBody(body);
    }

    public defineCenterPoint(newCenterPoint: { x: number; y: number }) {
        const diffVector = { x: newCenterPoint.x - this.centerPoint.x, y: newCenterPoint.y - this.centerPoint.y };
        this.grid.flat().forEach((t) => {
            t.coords.x = t.coords.x + diffVector.x;
            t.coords.y = t.coords.y + diffVector.y;
        });
    }

    public getCorners(): Tile[] {
        let corners = [];
        corners.push(this.grid[0].find((t) => t !== undefined)!);
        corners.push(this.grid[0].find((undefined, i) => i > this.centerPoint.y && this.grid[0][i + 1] === undefined)!);
        corners.push(this.grid[this.centerPoint.x][0]);
        corners.push(this.grid[this.centerPoint.x][this.grid[this.centerPoint.x].length - 1]);
        corners.push(this.grid[this.grid.length - 1].find((t) => t !== undefined)!);
        corners.push(
            this.grid[this.grid.length - 1].find(
                (undefined, i) => i > this.centerPoint.y && this.grid[this.grid.length - 1][i + 1] === undefined
            )!
        );
        return corners.filter((t) => t && t.body === null);
    }

    public merge(grid: Tile[][]) {
      let adapater = 0;
      grid.flat().forEach((t:Tile) => {
        if(t.coords.x < adapater) {
          adapater = t.coords.x;
        }
        const tx = t.coords.x + (adapater * -1);
        if (!this.grid[tx]) {
          this.grid[tx] = [];
        }
        if (!this.grid[tx][t.coords.y]) {
          this.grid[tx][t.coords.y] = t;
        }
        if (t.body) {
          console.log(this.grid[tx][t.coords.y])
          this.grid[tx][t.coords.y].body = t.body;
        }
      })
    }

    private getTile({ x, y }: { x: number; y: number }) {
        return this.grid[x][y] || null;
    }
    //#endregion

  }