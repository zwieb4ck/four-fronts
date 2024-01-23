import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vector2 } from 'three';

export class Tile {
  public type: string = "";
  public powered: boolean = false;
  public active: boolean = false;
  public hover: boolean = false;

  public setActive(active: boolean) {
    this.active = active;
  }

  public setHover(hover: boolean) {
    this.hover = hover;
  }

  constructor(public position: Vector2) { }
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  @Input() tile!: Tile;

  @Output() clicked: EventEmitter<Tile> = new EventEmitter();
  @Output() hover: EventEmitter<Tile> = new EventEmitter();

  public handleClick() {
    this.clicked.emit(this.tile);
  }

  public handleHover() {
    this.hover.emit(this.tile);
  }
}
