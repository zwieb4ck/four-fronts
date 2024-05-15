import { clamp } from 'three/src/math/MathUtils';
import { Tile } from './Tile';

export class HexGrid {
  public width = 0;
  public grid: Tile[][] = [[]];
  public sideLength = 50;
  public computedSideLength = 50;
  public hexHeight = 0;
  public hexRadius = 0;
  public hexRectangleHeight = 0;
  public hexRectangleWidth = 0;

  constructor(
    public context: CanvasRenderingContext2D,
    public rings: number,
    public startX: number,
    public startY: number,
    public scaleFactor: number = 1
  ) {
    this.width = this.rings * 2 + 1;
    this.updateScaleFactor(this.scaleFactor);
    const centerX = (this.width / 2) * this.hexRectangleWidth;
    const centerY =
      (this.width / 2) * (this.computedSideLength + this.hexHeight);
    var i, j, hexagons, xStart;
    let int = 0;
    for (i = 0; i < this.width; i++) {
      hexagons = this.width - Math.abs(Math.floor(this.width / 2) - i);
      xStart =
        (this.width - 3) % 4 == 0
          ? Math.ceil((this.width - hexagons) / 2)
          : Math.floor((this.width - hexagons) / 2);

      for (j = xStart; j < xStart + hexagons; j++) {
        int++;
        const x =
          j * this.hexRectangleWidth +
          (i % 2) * this.hexRadius +
          (this.startX - centerX);
        const y =
          i * (this.computedSideLength + this.hexHeight) +
          (this.startY - centerY);
        if (!this.grid[i]) {
          this.grid[i] = [];
        }
        const hex = new Tile(this.context, { x, y }, { x: i, y: j });
        this.grid[i][j] = hex;
        hex.draw(
          this.computedSideLength,
          this.hexRectangleWidth,
          this.hexRectangleHeight,
          this.hexHeight,
          this.hexRadius
        );
      }
    }
  }

  public apply(grid: [[{body?: any}]]) {
    const center = Math.floor(grid.length/ 2);
    for(let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        if (grid[x][y] && grid[x][y].body) {
          // ts-ginore-next-line
          this.grid[x][y].applyCelestialBody(grid[x][y].body);
        }
      }
    }
  }

  public applyTest(grid: [[null|true]]) {
    for(let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        if (grid[x][y] === true) {
          // ts-ginore-next-line
          this.grid[x][y].makeGreen();
        }
      }
    }
  }

  public updatePosition(startX: number, startY: number): void {
    this.startX = startX;
    this.startY = startY;
    let hexagons = 0;
    let xStart = 0;
    const centerX = (this.width / 2) * this.hexRectangleWidth;
    const centerY =
      (this.width / 2) * (this.computedSideLength + this.hexHeight);
    for (let i = 0; i < this.width; i++) {
      hexagons = this.width - Math.abs(Math.floor(this.width / 2) - i);
      xStart =
        (this.width - 3) % 4 == 0
          ? Math.ceil((this.width - hexagons) / 2)
          : Math.floor((this.width - hexagons) / 2);

      for (let j = xStart; j < xStart + hexagons; j++) {
        const x =
          j * this.hexRectangleWidth +
          (i % 2) * this.hexRadius +
          (this.startX - centerX);
        const y =
          i * (this.computedSideLength + this.hexHeight) +
          (this.startY - centerY);
        if (!this.grid[i]) {
          this.grid[i] = [];
        }
        this.grid[i][j].updatePosition(x, y);
      }
    }
  }

  public updateScaleFactor(scaleFactor: number) {
    this.scaleFactor = scaleFactor;
    this.computedSideLength = clamp(this.sideLength * scaleFactor, 20, window.innerHeight / 2)
    this.hexHeight = Math.sin(Tile.angle) * this.computedSideLength;
    this.hexRadius = Math.cos(Tile.angle) * this.computedSideLength;
    this.hexRectangleHeight = this.computedSideLength + 2 * this.hexHeight;
    this.hexRectangleWidth = 2 * this.hexRadius;
  }

  public draw() {
    this.grid.flat().forEach((t: Tile) => {
      t.draw(
        this.computedSideLength,
        this.hexRectangleWidth,
        this.hexRectangleHeight,
        this.hexHeight,
        this.hexRadius
      );
    });
  }
}
