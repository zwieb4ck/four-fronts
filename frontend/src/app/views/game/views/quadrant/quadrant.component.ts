import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RenderingLayer, Quadrant, GridRenderer, IHexagonData, HexGrid, RENDERING_LAYER, Camera } from 'shared-modules';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
})
export class QuadrantComponent implements OnInit {
  public layer: RenderingLayer<CanvasRenderingContext2D>[] = [];
  private quadrant: Quadrant | null = null;
  private camera!: Camera;
  private renderer!: GridRenderer<IHexagonData>;
  private coordinates = '';
  private renderSystem = true;
  private activeGrid: HexGrid | null = null;
  private layerInitialized = false;

  private get height() {
    return (
      this.elm.nativeElement.querySelector('canvas').getBoundingClientRect()
        .height - 60
    );
  }
  private get width() {
    return this.elm.nativeElement
      .querySelector('canvas')
      .getBoundingClientRect().width;
  }

  constructor(private route: ActivatedRoute, public elm: ElementRef, public router: Router) {
    this.route.params.subscribe(({ quadrant, system }) => {
      this.coordinates = `${quadrant}`;
      if (this.layerInitialized) {
        this.initQuadrant();
      }
    });
  }

  public ngOnInit(): void {
    //#region Init layers
    const background = this.elm.nativeElement.querySelector('#background');
    const grid = this.elm.nativeElement.querySelector('#grid');
    const foreground = this.elm.nativeElement.querySelector('#foreground');
    const ui = this.elm.nativeElement.querySelector('#ui');
    this.layer = [
      {
        type: RENDERING_LAYER.BACKGROUND,
        context: background.getContext('2d'),
        canvas: background,
      },
      {
        type: RENDERING_LAYER.GRID,
        context: grid.getContext('2d'),
        canvas: grid,
      },
      {
        type: RENDERING_LAYER.FOREGROUND,
        context: foreground.getContext('2d'),
        canvas: foreground,
      },
      {
        type: RENDERING_LAYER.UI,
        context: ui.getContext('2d'),
        canvas: ui,
      },
    ];
    this.layer.forEach((l) => {
      l.canvas.height = this.height;
      l.canvas.width = this.width;
    });
    this.layerInitialized = true;
    //#endregion
      this.initQuadrant();
  }

  public initQuadrant(): void {
    //#region init Quadrant selection
    this.quadrant = new Quadrant(this.coordinates);
    this.camera = new Camera(this.layer, true);
    this.renderer = new GridRenderer(this.layer, this.camera);

    this.camera.cursorClick.subscribe((clickVector) => {
      const target = this.renderer.getClickedTile(clickVector);
      if (target?.data?.onClick) {
        const cmd = target.data.onClick();
        if (cmd.type === "routing") {
          this.router.navigate(['game', ...cmd.value.split("/")])
        } else if(cmd.type === "showQuadrant") {
          this.toggleRenderSystem();
        }
      }
    });
    // this.renderer.toggleDebug();
    this.updateGrid();
    console.log(this.quadrant.findBlackHole());
    console.log(this.quadrant);
    //#endregion
  }
  
  public toggleRenderSystem() {
    this.renderSystem = !this.renderSystem;
    this.updateGrid();
  }
  
  private updateGrid() {
    if (this.renderSystem) {
      this.renderer.setBackground('assets/images/galaxy.png');
      this.renderer.sideLength = 60;
      this.camera.enable();
      this.activeGrid = this.quadrant!.system;
      this.renderer.updateGrid(this.activeGrid.grid);
    } else {
      this.renderer.setBackground('assets/images/backgrounds/quadrant.png');
      this.renderer.sideLength = 90;
      this.camera.disable();
      this.activeGrid = this.quadrant!.quadrant;
      this.renderer.updateGrid(this.activeGrid.grid);
    }
  }
}

