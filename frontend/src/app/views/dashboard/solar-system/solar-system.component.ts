import { Component, ElementRef, OnInit } from '@angular/core';
import { HexGrid } from 'src/app/core/classes/Grid';
import { Tile } from 'src/app/core/classes/Tile';
import PseudoRandom from 'src/app/core/utils/PseudoRandom';
import { Vector2 } from 'three';
import SolarSystemService from './solar-system.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.css'],
})
export class SolarSystemComponent implements OnInit {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public grid: HexGrid | null = null;
  public rings: number = 7;

  private dragging = false;
  private dragStart = { x: -1, y: -1 };
  private startX = 1;
  private startY = 1;
  private rightClickPointer = { x: -1, y: -1 };
  private isScaling = false;
  private scaleFactor = 1;
  private lastScaleFactor = this.scaleFactor;
  private clickTimeout: any = null;
  private clickPoint: any = null;
  private seed: string = '';

  public get height() {
    return this.elm.nativeElement.getBoundingClientRect().height;
  }
  public get width() {
    return this.elm.nativeElement.getBoundingClientRect().width;
  }

  constructor(
    private elm: ElementRef,
    private solarService: SolarSystemService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.seed = `${params['quadrant']}/${params['system']}`;
    });
  }

  private addListeners(): void {
    this.canvas.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        if (e.button === 0) {
          if (this.clickTimeout === null) {
            // this.clickTimeout = setTimeout(() => {
            this.dragging = true;
            this.dragStart = { x: e.pageX, y: e.pageY };
            // }, 150);
          }
          const point = new Vector2(e.offsetX, e.offsetY);
          this.clickPoint = point;
          this.grid?.grid.flat().forEach((tile: Tile) => {
            if (tile.isPointInHexagon(point)) {
              // tile.makeGreen();
            }
          });
        }
        if (e.button === 2) {
          e.preventDefault();
          this.isScaling = true;
          this.rightClickPointer = { x: e.pageX, y: e.pageY };
          this.lastScaleFactor = this.scaleFactor;
        }
      },
      false
    );

    this.canvas.addEventListener(
      'contextmenu',
      (e: MouseEvent) => e.preventDefault(),
      false
    );

    this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
      if (this.clickTimeout !== null) {
        this.clickTimeout = null;
      }
      this.dragging = false;
      this.dragStart = { x: -1, y: -1 };
      this.isScaling = false;
      this.rightClickPointer = { x: -1, y: -1 };
    });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.dragging) {
        this.startX = this.startX + e.pageX - this.dragStart.x;
        this.startY = this.startY + e.pageY - this.dragStart.y;
        this.dragStart = { x: e.pageX, y: e.pageY };
      } else if (this.isScaling) {
        const distanceX = e.pageX - this.rightClickPointer.x;
        const distanceY = e.pageY - this.rightClickPointer.y;
        const min =
          window.innerHeight / (this.rings * 2 + 1) / 8 / this.grid!.sideLength;
        this.scaleFactor = Math.max(
          min,
          Math.min(3, this.lastScaleFactor - (distanceX - distanceY) / 400)
        );
      } else {
        const cursor = new Vector2(e.offsetX, e.offsetY);
        this.grid?.grid
          .flat()
          .map((t) =>
            t.isPointInHexagon(cursor) ? t.emphazise() : t.understate()
          );
      }
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.dragging = false;
      this.dragStart = { x: -1, y: -1 };
      this.isScaling = false;
      this.rightClickPointer = { x: -1, y: -1 };
    });
  }

  public ngOnInit(): void {
    this.canvas = this.elm.nativeElement.querySelector('.solar-system')!;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.startX = this.width / 2;
    this.startY = this.height / 2;
    this.createHexGrid();
    this.addListeners();
    this.animate();
  }

  private createHexGrid() {
    this.solarService.getBySeed(this.seed).subscribe(({ body }) => {
      console.log('jet', this.seed, body.grid.rings);
      this.grid = new HexGrid(
        this.context,
        body.grid.rings,
        this.startX,
        this.startY
      );
      this.grid.draw();
      this.grid.apply(body.grid.grid);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.context.clearRect(0, 0, this.width, this.height);
    if (this.grid) {
      this.grid.updatePosition(this.startX, this.startY);
      this.grid.updateScaleFactor(this.scaleFactor);
      this.grid.draw();
    }
  }
}

