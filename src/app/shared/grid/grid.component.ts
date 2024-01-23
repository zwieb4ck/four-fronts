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
    this.getNeighborsInRadius(tile, 2).forEach(tile => tile.setHover(true));
  }

  public setTileAndNeighborsActive(tile: Tile) {
    this.grid.flat().forEach((tile: Tile) => {
      tile.active = false;
    });
    this.getNeighborsInRadius(tile, 1).forEach(tile => tile.setActive(true));

  }

  private getNeighborTileWithVector(originTile: Tile, gridVEctor: GridVector): null|Tile {
      const leftShift: number = originTile.position.y % 2 === 0 && gridVEctor.y !== 0 ? -1 : 0;
      if(originTile.position.y + gridVEctor.y < 0 || originTile.position.y + gridVEctor.y === this.rows) return null;
      if(originTile.position.x + leftShift + gridVEctor.x < 0 || originTile.position.x + leftShift + gridVEctor.x === this.cols) return null;

      return this.grid[originTile.position.y + gridVEctor.y][originTile.position.x + gridVEctor.x + leftShift];   
  }

  private getNeighborsInRadius(originTile: Tile, radius: number): Array<Tile> {
    let result = new Array<Tile>();
    result.push(originTile);
    for(let i = 0; i < radius; i++) {
      result.forEach(res => {
        const neighbors = this.getNeighbors(res);
        result = result.concat(neighbors);
      });
    }

    return result.filter((tile, index, array) => array.indexOf(tile) === index);
  }

  private getNeighbors(originTile: Tile): Array<Tile> {
    const result = new Array<null|Tile>();
    result.push(originTile);
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.BOTTOM_LEFT));
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.BOTTOM_RIGHT));
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.LEFT));
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.RRIGHT));
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.TOP_LEFT));
    result.push(this.getNeighborTileWithVector(originTile, OGridVector.TOP_RIGHT));

    return result.flatMap(res => res ? [res] : []);
  }
}