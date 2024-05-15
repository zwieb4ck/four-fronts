import { Moon } from 'src/app/views/dashboard/solar-system/models/Moon.class';
import { Planet } from 'src/app/views/dashboard/solar-system/models/Planet.class';
import { Star } from 'src/app/views/dashboard/solar-system/models/Star.class';
import { Vector2 } from 'three';

export const BODY_TYPES = {
  TERRESTRIALPLANET: 'TerrestrialPlanet',
  GASGIANT: 'GasGiant',
  ICEGIANT: 'IceGiant',
  EXOPLANET: 'Exoplanet',
  HABITABLEPLANET: 'HabitablePlanet',
  DESERTPLANET: 'DesertPlanet',
  OCEANWORLD: 'OceanWorld',
  HOTJUPITER: 'HotJupiter',
  DWARFPLANET: 'DwarfPlanet',
  MAIN_SEQUENCE: 'MainSequenceStar',
  RED_GIANT: 'RedGiant',
  WHITE_DWRAFS: 'WhiteDwarf',
  NEUTRON: 'NeutronStar',
  MOON: 'Moon'
};

export const BODY_IMAGES = {
  TerrestrialPlanet: ['planets/terrestrial-planet.png'],
  GasGiant: ['planets/gas-giant.png'],
  IceGiant: ['planets/ice-giant.png'],
  Exoplanet: ['planets/exo-planet.png'],
  HabitablePlanet: ['planets/habitable-planet.png'],
  DesertPlanet: ['planets/desert-planet.png'],
  OceanWorld: ['planets/ocean-planet.png'],
  HotJupiter: ['planets/hot-jupiter.png'],
  DwarfPlanet: ['planets/dwarf-planet-1.png'],
  MainSequenceStar: ['suns/main-sequence.png'],
  RedGiant: ['suns/red-giant.png'],
  WhiteDwarf: ['suns/white-dwarf.png'],
  NeutronStar: ['suns/neutron-star.png'],
  Moon: ['moons/moon-1.png']
};

const CATEGORIES = {
  Planets: [
    'TerrestrialPlanet',
    'GasGiant',
    'IceGiant',
    'Exoplanet',
    'HabitablePlanet',
    'DesertPlanet',
    'OceanWorld',
    'HotJupiter',
    'DwarfPlanet',
  ],
  Suns: ['MainSequenceStar', 'RedGiant', 'WhiteDwarf', 'NeutronStar'],
};

export class Tile {
  public fill = false;
  public fillStyle = '#000000';
  public strokeStyle = 'rgba(255,255,255,0.15)';
  public lineWidth = 1;
  public sideLength: number = 0;
  public hexRectangleWidth: number = 0;
  public hexRectangleHeight: number = 0;
  public hexHeight: number = 0;
  public hexRadius: number = 0;
  public image: any = null;
  public imageLoaded = false;
  public body: Star | Planet | Moon | null = null;

  constructor(
    public context: CanvasRenderingContext2D,
    public pos: { x: number; y: number },
    public coords: { x: number; y: number }
  ) {}

  public static get angle() {
    return (30 * Math.PI) / 180;
  }

  public applyCelestialBody(body: Planet | Star) {
    this.image = new Image();
    this.body = body;
    this.image.src = `../../assets/images/${BODY_IMAGES[body.type]}`;
    console.log(body);
    this.image.onload = () => {
      this.imageLoaded = true;
      this.fill = true;
      this.draw(
        this.sideLength,
        this.hexRectangleWidth,
        this.hexRectangleHeight,
        this.hexHeight,
        this.hexRadius
      );
    };
  }

  public draw(
    sideLength: number,
    hexRectangleWidth: number,
    hexRectangleHeight: number,
    hexHeight: number,
    hexRadius: number
  ) {
    this.sideLength = sideLength;
    this.hexRectangleWidth = hexRectangleWidth;
    this.hexRectangleHeight = hexRectangleHeight;
    this.hexHeight = hexHeight;
    this.hexRadius = hexRadius;

    this.context.fillStyle = this.fillStyle;
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;

    this.context.beginPath();
    this.context.moveTo(this.pos.x + this.hexRadius, this.pos.y);
    this.context.lineTo(
      this.pos.x + this.hexRectangleWidth,
      this.pos.y + this.hexHeight
    );
    this.context.lineTo(
      this.pos.x + this.hexRectangleWidth,
      this.pos.y + this.hexHeight + this.sideLength
    );
    this.context.lineTo(
      this.pos.x + this.hexRadius,
      this.pos.y + this.hexRectangleHeight
    );
    this.context.lineTo(
      this.pos.x,
      this.pos.y + this.sideLength + this.hexHeight
    );
    this.context.lineTo(this.pos.x, this.pos.y + this.hexHeight);
    this.context.closePath();
    this.context.stroke();
    if (this.imageLoaded && this.fill) {
      this.context.fillStyle = this.fillStyle;
      let factor = 0;
      if (CATEGORIES.Planets.includes(this.body!.type)) {
        factor = 0.4
      } else if(this.body!.type === BODY_TYPES.MOON) {
        factor = 0.2;
      } else {
        factor = 0.7;
      }
      const size =
        Math.min(this.hexRectangleWidth, this.hexRectangleHeight) * factor;
      const x = this.pos.x + this.hexRectangleWidth / 2 - size / 2;
      const y = this.pos.y + this.hexRectangleHeight / 2 - size / 2;
      this.context.drawImage(this.image, x, y, size, size);
    }
    if (!this.imageLoaded && this.fill) {
      this.context.fillStyle = "rgba(255,255,255,0.1"
      this.context.fill();
    }
  }

  public updatePosition(x: number, y: number) {
    this.pos = {
      x,
      y,
    };
  }

  //#region Calc Intersect
  public isIntersect(point: Vector2) {
    return (
      Math.sqrt((point.x - this.pos.x) ** 2 + (point.y - this.pos.y) ** 2) <
      this.hexRadius
    );
  }

  public isPointInHexagon(point: Vector2) {
    let hexCorners = [
      { x: this.pos.x + this.hexRadius, y: this.pos.y },
      {
        x: this.pos.x + this.hexRectangleWidth,
        y: this.pos.y + this.hexHeight,
      },
      {
        x: this.pos.x + this.hexRectangleWidth,
        y: this.pos.y + this.hexHeight + this.sideLength,
      },
      {
        x: this.pos.x + this.hexRadius,
        y: this.pos.y + this.hexRectangleHeight,
      },
      { x: this.pos.x, y: this.pos.y + this.sideLength + this.hexHeight },
      { x: this.pos.x, y: this.pos.y + this.hexHeight },
    ];

    const doesIntersect = this.pointInPolygon(point, hexCorners);
    return doesIntersect;
  }

  public pointInPolygon(point: Vector2, polygon: { x: number; y: number }[]) {
    let isInside = false;
    let minX = polygon[0].x,
      maxX = polygon[0].x;
    let minY = polygon[0].y,
      maxY = polygon[0].y;
    for (let n = 1; n < polygon.length; n++) {
      let q = polygon[n];
      minX = Math.min(q.x, minX);
      maxX = Math.max(q.x, maxX);
      minY = Math.min(q.y, minY);
      maxY = Math.max(q.y, maxY);
    }

    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false;
    }

    let i = 0,
      j = polygon.length - 1;
    for (j; i < polygon.length; j = i++) {
      if (
        polygon[i].y > point.y != polygon[j].y > point.y &&
        point.x <
          ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) /
            (polygon[j].y - polygon[i].y) +
            polygon[i].x
      ) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  //#endregion

  //#region hover
  public emphazise() {
    this.strokeStyle = '#ffffff';
  }

  public understate() {
    this.strokeStyle = 'rgba(255,255,255,0.15)';
  }
  //#endregion

  //#region debug
  public makeGreen() {
    if (this.fill) {
      this.fill = false;
    } else {
      this.fill = true;
    }
  }
  //#endregion
}
