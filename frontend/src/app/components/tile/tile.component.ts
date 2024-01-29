import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vector2 } from 'three';

export class Tile {
  public type: string = "";
  public powered: boolean = false;
  public active: boolean = false;

  constructor(public position: Vector2) { }
}

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
})
export class TileComponent {
  @Input() tile!: Tile;

  @Output() clicked: EventEmitter<Tile> = new EventEmitter();

  public handleClick() {
    this.clicked.emit(this.tile);
  }
}
