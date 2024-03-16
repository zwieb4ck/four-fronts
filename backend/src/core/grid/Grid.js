const { Tile } = require("./Tile");

class HexGrid {
  constructor(rings) {
    this.grid = [[]];
    this.rings = rings;
    this.width = rings * 2 + 1;
    this.buildHexagonGrid();
  }

  buildHexagonGrid() {
    let i, j, hexagons, xStart;
    for (i = 0; i < this.rings * 2 + 1; i++) {
      hexagons = this.width - Math.abs(Math.floor(this.width / 2) - i);
      xStart =
        (this.width - 3) % 4 == 0
          ? Math.ceil((this.width - hexagons) / 2)
          : Math.floor((this.width - hexagons) / 2);
      this.grid[i] = [];
      for (j = xStart; j < xStart + hexagons; j++) {
        const hex = new Tile({ x: i, y: j });
        this.grid[i][j] = hex;
      }
    }
    this.centerX = Math.floor(this.grid.length / 2);
    this.centerY = Math.floor(this.grid[this.centerX].length / 2);
    this.updateHexagonRings();

  }
  
  updateHexagonRings() {
    for (let x = 0; x < this.grid.length; x++) {
      for (let y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y] != null) {
          this.grid[x][y].ring = this.determineRing(x, y);
        }
      }
    }
  }
  
  determineRing(x, y) {
    let dx = Math.abs(x - this.centerX);
    let dy = Math.abs(y - this.centerY);
    if (dx % 2 === 1) {
      dy -= Math.floor(dx / 2);
    } else {
      dy -= dx / 2;
    }
    return Math.max(dx, dy);
  }
}

module.exports = { HexGrid}