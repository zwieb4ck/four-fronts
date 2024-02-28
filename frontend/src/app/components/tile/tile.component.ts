import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vector2 } from 'three';

export type Building = {
  type: string;
  level: number;
}

export type Resource = {
  type: string,
  amount: number,
}

export interface ITile {
  building: Building | null;
  resource: Resource | null;
  position: Vector2;
  hasPower: boolean;
  isRevealed: boolean;
}

export class Tile {
  public active: boolean = false;
  public hover: boolean = false;

  public building: Building | null;
  public resource: Resource | null;
  public position: Vector2;
  public hasPower: boolean;
  public isRevealed: boolean;

  public setActive(active: boolean) {
    this.active = active;
  }

  public setHover(hover: boolean) {
    this.hover = hover;
  }

  constructor(data: ITile) {
    this.building = data.building;
    this.building = data.building;
    this.resource = data.resource;
    this.position = new Vector2(data.position.x, data.position.y);
    this.hasPower = data.hasPower;
    this.isRevealed = data.isRevealed;
  }
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
})
export class TileComponent {
  @Input() tile!: any;

  @Output() clicked: EventEmitter<Tile> = new EventEmitter();
  @Output() hover: EventEmitter<Tile> = new EventEmitter();

  public get tileLabel(): string {
    if (this.tile.building && !this.tile.resource) {
      return this.tile.building.type;
    }
    if (this.tile.building && this.tile.resource) {
      return `${this.tile.building.type} ${this.tile.resource.type}`;
    }
    return `${this.tile.position.x}/${this.tile.position.y}`
  }

  public handleClick() {
    this.clicked.emit(this.tile);
  }

  public handleHover() {
    this.hover.emit(this.tile);
  }
}
