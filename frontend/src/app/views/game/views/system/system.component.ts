import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GridRenderer,
  StarSystem,
  Tile,
  Camera,
  RenderingLayer,
  RENDERING_LAYER,
  HexGrid,
} from 'shared-modules';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
})
export class SystemComponent implements OnInit {
  public coordinates!: string;
  public renderer: GridRenderer<Tile> | null = null;

  private layer: RenderingLayer<CanvasRenderingContext2D>[] = [];
  private system: StarSystem | null = null;

  private get height() {
    return this.elm.nativeElement.querySelector("canvas").getBoundingClientRect().height - 60;
  }
  private get width() {
    return this.elm.nativeElement.querySelector("canvas").getBoundingClientRect().width;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public elm: ElementRef
  ) {
    this.route.params.subscribe(({ quadrant, system }) => {
      this.coordinates = `${quadrant}/${system}`;
      this.system = new StarSystem(this.coordinates);
    });
  }

  public ngOnInit(): void {
    const background = this.elm.nativeElement.querySelector('#background');
    const grid = this.elm.nativeElement.querySelector('#grid');
    const foreground = this.elm.nativeElement.querySelector('#foreground');
    const ui = this.elm.nativeElement.querySelector('#ui');
    this.layer = [
      {
        type: RENDERING_LAYER.BACKGROUND,
        context: background.getContext('2d'),
        canvas:background,
      },
      {
        type: RENDERING_LAYER.GRID,
        context: grid.getContext('2d'),
        canvas:grid,
      },
      {
        type: RENDERING_LAYER.FOREGROUND,
        context: foreground.getContext('2d'),
        canvas:foreground,
      },
      {
        type: RENDERING_LAYER.UI,
        context: ui.getContext('2d'),
        canvas:ui,
      },
    ];
    this.layer.forEach((l)=> {
      l.canvas.height = this.height;
      l.canvas.width = this.width;
    })
    if (this.layer.length > 0 && this.system) {
      console.log('was geht')
      const camera = new Camera(this.layer!);
      this.renderer = new GridRenderer(this.layer, camera);
      this.renderer.sideLength = 50;
      this.renderer.updateGrid(this.system.grid.grid)
      console.log(this.system, this.renderer, camera)
      
    }
  }
} 