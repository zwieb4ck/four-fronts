import { Component, ElementRef, OnInit } from '@angular/core';
import AuthService from 'src/app/core/services/auth.service';
import UIService from 'src/app/core/services/ui.service';
import { Vector2, MathUtils } from 'three';
import PlanetService from './planet.service';
import { ActivatedRoute } from '@angular/router';
import { Moon } from '../solar-system/models/Moon.class';
import { Planet } from '../solar-system/models/Planet.class';
import { Grid } from 'src/app/core/classes/Grid';
import { StarSystem } from 'shared-modules';
@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.css'],
})
export class PlanetComponent implements OnInit {
  public body: Planet | Moon | null = null;
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;

  private dragging = false;
  private dragStart = { x: -1, y: -1 };
  private startX = 1;
  private startY = 1;
  private rightClickPointer = { x: -1, y: -1 };
  private isScaling = false;
  private scaleFactor = 0.1;
  private lastScaleFactor = this.scaleFactor;
  private clickTimeout: any = null;
  private clickPoint: any = null;
  private seed: string = '';

  private grid: Grid | null = null;
  private system!: StarSystem;

  public get height() {
    return this.elm.nativeElement.getBoundingClientRect().height;
  }
  public get width() {
    return this.elm.nativeElement.getBoundingClientRect().width;
  }

  constructor(
    public planetService: PlanetService,
    public activeRoute: ActivatedRoute,
    public elm: ElementRef
  ) {
    this.activeRoute.params.subscribe(({ quadrant, system, planet }) => {
      // this.planetService.getBody(quadrant, system, planet).subscribe((res) => {
      //   this.body = res.body;
      //   console.log(this.body!.grid);
      //   this.drawGrid();
      //   this.addListeners();
      //   this.animate();
      // });
      const starSystem = new StarSystem(`${quadrant}/${system}`);
      console.log(starSystem);
        this.drawGrid();
        this.addListeners();
        this.animate();
    });
  }

  public ngOnInit(): void {
    this.canvas = this.elm.nativeElement.querySelector('.planet')!;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private addListeners(): void {
    this.canvas.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        if (e.button === 0) {
          if (this.clickTimeout === null) {
            this.dragging = true;
            this.dragStart = { x: e.pageX, y: e.pageY };
          }
          const point = new Vector2(e.offsetX, e.offsetY);
          this.clickPoint = point;
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
          window.innerHeight / (25 * 2 + 1) / 8 / this.grid!.sideLength;
        this.scaleFactor = Math.max(
          min,
          Math.min(3, this.lastScaleFactor - (distanceX - distanceY) / 400)
        );
      } else {
        const cursor = new Vector2(e.offsetX, e.offsetY);
        this.grid?.grid.flat().map((t) => {
          if (t) {
            return t.isPointInHexagon(cursor) ? t.emphazise() : t.understate();
          }
          return false;
        });
      }
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.dragging = false;
      this.dragStart = { x: -1, y: -1 };
      this.isScaling = false;
      this.rightClickPointer = { x: -1, y: -1 };
    });
  }

  drawGrid() {
    this.grid = new Grid(
      this.context,
      this.startX,
      this.startY,
      this.system!.grid.grid,
      this.scaleFactor
    );
    this.grid.draw();
    console.log(this.grid)
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.context.clearRect(0, 0, this.width, this.height);
    if (this.grid) {
      this.grid.draw();
    }
  }
}
