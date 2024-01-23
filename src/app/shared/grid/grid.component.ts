import { Component, Input, OnInit } from '@angular/core';
import { Vector2 } from 'three';
import { Tile } from '../tile/tile.component';
import UIService from '../services/UiService';
import { GridVector, OGridVector } from './grid.dictionary';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
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

  public setTileAndNeighborsHover(tile: Tile) {
    this.grid.flat().forEach((tile: Tile) => {
      tile.setHover(false);
    });
    tile.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.BOTTOM_LEFT)?.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.BOTTOM_RIGHT)?.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.LEFT)?.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.RRIGHT)?.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.TOP_LEFT)?.setHover(true);
    this.getNeighborTileWithVector(tile, OGridVector.TOP_RIGHT)?.setHover(true);
  }

  public setTileAndNeighborsActive(tile: Tile) {
    this.grid.flat().forEach((tile: Tile) => {
      tile.active = false;
    });
    tile.active = true;
    this.getNeighborTileWithVector(tile, OGridVector.BOTTOM_LEFT)?.setActive(true);
    this.getNeighborTileWithVector(tile, OGridVector.BOTTOM_RIGHT)?.setActive(true);
    this.getNeighborTileWithVector(tile, OGridVector.LEFT)?.setActive(true);
    this.getNeighborTileWithVector(tile, OGridVector.RRIGHT)?.setActive(true);
    this.getNeighborTileWithVector(tile, OGridVector.TOP_LEFT)?.setActive(true);
    this.getNeighborTileWithVector(tile, OGridVector.TOP_RIGHT)?.setActive(true);

  }

  private getNeighborTileWithVector(originTile: Tile, gridVEctor: GridVector): null|Tile {
      const leftShift: number = originTile.position.y % 2 === 0 && gridVEctor.y !== 0 ? -1 : 0;
      if(originTile.position.y + gridVEctor.y < 0 || originTile.position.y + gridVEctor.y === this.rows) return null;
      if(originTile.position.x + leftShift + gridVEctor.x < 0 || originTile.position.x + leftShift + gridVEctor.x === this.cols) return null;

      return this.grid[originTile.position.y + gridVEctor.y][originTile.position.x + gridVEctor.x + leftShift];   
  }
}