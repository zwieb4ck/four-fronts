import { Component, Input, OnInit } from '@angular/core';
import { Vector2 } from 'three';
import { Tile } from '../tile/tile.component';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  @Input() public rows = 1;
  @Input() public cols = 1;
  @Input() public width!: number;

  public get calcultedWidth(): string {
    return this.width + 'px';
  }

  public grid: Tile[][] = [];

  public ngOnInit() {
    for (let y = 0; y < this.rows; y++) {
      const row = [];

      for (let x = 0; x < this.cols - (y % 2); x++) {
        row.push(new Tile(new Vector2(x, y)));
      }

      this.grid.push(row);
    }
  }

  public setTileAndNeighborsActive(tile: Tile) {
    this.grid.flat().forEach((tile: Tile) => {
      tile.active = false;
    });
    tile.active = true;
    if (tile.position.y % 2 === 0) {
      if (this.grid[tile.position.y - 1] && this.grid[tile.position.y - 1][tile.position.x]) {
        this.grid[tile.position.y - 1][tile.position.x].active = true;
      }

      if (this.grid[tile.position.y - 1] && this.grid[tile.position.y - 1][tile.position.x - 1]) {
        this.grid[tile.position.y - 1][tile.position.x - 1].active = true;
      }

      if (this.grid[tile.position.y] && this.grid[tile.position.y][tile.position.x - 1]) {
        this.grid[tile.position.y][tile.position.x - 1].active = true;
      }

      if (this.grid[tile.position.y] && this.grid[tile.position.y][tile.position.x + 1]) {
        this.grid[tile.position.y][tile.position.x + 1].active = true;
      }

      if (this.grid[tile.position.y + 1] && this.grid[tile.position.y + 1][tile.position.x]) {
        this.grid[tile.position.y + 1][tile.position.x].active = true;
      }

      if (this.grid[tile.position.y + 1] && this.grid[tile.position.y + 1][tile.position.x - 1]) {
        this.grid[tile.position.y + 1][tile.position.x - 1].active = true;
      }
    } else {
      if (this.grid[tile.position.y - 1] && this.grid[tile.position.y - 1][tile.position.x]) {
        this.grid[tile.position.y - 1][tile.position.x].active = true;
      }

      if (this.grid[tile.position.y - 1] && this.grid[tile.position.y - 1][tile.position.x + 1]) {
        this.grid[tile.position.y - 1][tile.position.x + 1].active = true;
      }

      if (this.grid[tile.position.y] && this.grid[tile.position.y][tile.position.x - 1]) {
        this.grid[tile.position.y][tile.position.x - 1].active = true;
      }

      if (this.grid[tile.position.y] && this.grid[tile.position.y][tile.position.x + 1]) {
        this.grid[tile.position.y][tile.position.x + 1].active = true;
      }

      if (this.grid[tile.position.y + 1] && this.grid[tile.position.y + 1][tile.position.x]) {
        this.grid[tile.position.y + 1][tile.position.x].active = true;
      }

      if (this.grid[tile.position.y + 1] && this.grid[tile.position.y + 1][tile.position.x + 1]) {
        this.grid[tile.position.y + 1][tile.position.x + 1].active = true;
      }

    }

  }

}