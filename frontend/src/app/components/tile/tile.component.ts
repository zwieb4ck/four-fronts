import { Component, EventEmitter, Input, Output } from '@angular/core';
import PseudoRandom from 'src/app/core/utils/PseudoRandom';
import { Vector2 } from 'three';
import { generateUUID } from 'three/src/math/MathUtils';

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

  private id: string = generateUUID();

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

  public createMockData() {
    if (this.building) return;
    const prng = new PseudoRandom(this.id);
    const hasResource = prng.choice([true, false, false]);
    if (hasResource) {
      const resources = [
        "Iron",
        "Coal",
        "Sili",
        "Alum",
        "Copp",
        "Lith"
      ];
      this.resource = {
        type: prng.choice(resources),
        amount: 1,
      }
    }
    const hasBuilding = prng.choice([true, false]);
    if (hasBuilding && this.hasPower) {
      if (hasResource) {
        this.building = {
          type: "Mine",
          level: 1
        }
      } else {
        const buildings = [
          "Stahlwerk",
          "DiodenFactory",
          "Schmelze",
          "Kabelwerk",
          "Laserfabrik",
          "KI-Labor",
          "Werft",
          "WaffenFabrik",
          "Glashütte",
          "PanzerungsFabrik",
          "ComputerLabor"
        ]
        this.building = {
          type: prng.choice(buildings),
          level: 1,
        }
      }
    }
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
    if (this.tile.resource) {
      return this.tile.resource.type;
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
