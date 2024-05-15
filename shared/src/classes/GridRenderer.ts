import { Subject } from "rxjs";
import { Vector2 } from "three";
import { MathUtils } from "three/src/math/MathUtils.js";
import { ICmd } from "./Quadrant";

export interface IHexagonData {
    rendered: boolean;
    draw?: (
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        context: CanvasRenderingContext2D
    ) => void;
    onClick?: () => ICmd;
}

export class Hexagon<T extends IHexagonData> {
    private fill = false;
    private fillStyle = "#000000";
    private strokeStyle = "rgba(255,255,255,1)";
    private lineWidth = 1;
    private sideLength: number = 0;
    private hexRectangleWidth: number = 0;
    private hexRectangleHeight: number = 0;
    private hexHeight: number = 0;
    private hexRadius: number = 0;

    constructor(
        public data: T,
        public context: CanvasRenderingContext2D,
        public coordinates: { x: number; y: number },
        public position: { x: number; y: number }
    ) {}

    public static get angle() {
        return (30 * Math.PI) / 180;
    }

    public draw(
        sideLength: number,
        hexRectangleWidth: number,
        hexRectangleHeight: number,
        hexHeight: number,
        hexRadius: number,
        positionVector: Vector2,
        debug: boolean
    ) {
        if (this.data?.draw !== undefined) {
            this.data.draw(
                sideLength,
                hexRectangleWidth,
                hexRectangleHeight,
                hexHeight,
                hexRadius,
                positionVector,
                this.context
            );
        }
        this.sideLength = sideLength;
        this.hexRectangleWidth = hexRectangleWidth;
        this.hexRectangleHeight = hexRectangleHeight;
        this.hexHeight = hexHeight;
        this.hexRadius = hexRadius;

        this.position = positionVector;

        this.context.fillStyle = this.fillStyle;
        this.context.strokeStyle = this.strokeStyle;
        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();
        this.context.moveTo(this.position.x + this.hexRadius, this.position.y);
        this.context.lineTo(this.position.x + this.hexRectangleWidth, this.position.y + this.hexHeight);
        this.context.lineTo(
            this.position.x + this.hexRectangleWidth,
            this.position.y + this.hexHeight + this.sideLength
        );
        this.context.lineTo(this.position.x + this.hexRadius, this.position.y + this.hexRectangleHeight);
        this.context.lineTo(this.position.x, this.position.y + this.sideLength + this.hexHeight);
        this.context.lineTo(this.position.x, this.position.y + this.hexHeight);
        this.context.closePath();
        this.context.stroke();
        if (this.fill) {
            this.context.fillStyle = "green";
            this.context.fill();
        }

        if (debug) {
            this.debug();
        }
        if (this.data.draw) {
            this.data.draw(
                sideLength,
                hexRectangleWidth,
                hexRectangleHeight,
                hexHeight,
                hexRadius,
                positionVector,
                this.context
            );
        }
    }

    public debug() {
        this.context.beginPath();

        // this.context.moveTo(this.position.x, this.position.y);
        // this.context.lineTo(this.position.x + this.hexRectangleWidth, this.position.y + this.hexRectangleHeight);
        // this.context.moveTo(this.position.x + this.hexRectangleWidth, this.position.y);
        // this.context.lineTo(this.position.x, this.position.y + this.hexRectangleHeight);
        // this.context.lineTo(this.position.x, this.position.y);
        // this.context.lineTo(this.position.x + this.hexRectangleWidth, this.position.y);
        // this.context.lineTo(this.position.x + this.hexRectangleWidth, this.position.y + this.hexRectangleHeight);
        // this.context.lineTo(this.position.x, this.position.y + this.hexRectangleHeight);
        // this.context.lineTo(this.position.x, this.position.y);
        this.context.strokeStyle = "magenta";
        this.context.stroke();
    }

    public makeGreen(fill: boolean) {
        this.fill = fill;
    }

    public isIntersect(point: Vector2) {
        return Math.sqrt((point.x - this.position.x) ** 2 + (point.y - this.position.y) ** 2) < this.hexRadius;
    }

    public isPointInHexagon(point: Vector2) {
        let hexCorners = [
            { x: this.position.x + this.hexRadius, y: this.position.y },
            {
                x: this.position.x + this.hexRectangleWidth,
                y: this.position.y + this.hexHeight,
            },
            {
                x: this.position.x + this.hexRectangleWidth,
                y: this.position.y + this.hexHeight + this.sideLength,
            },
            {
                x: this.position.x + this.hexRadius,
                y: this.position.y + this.hexRectangleHeight,
            },
            { x: this.position.x, y: this.position.y + this.sideLength + this.hexHeight },
            { x: this.position.x, y: this.position.y + this.hexHeight },
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
                    ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) +
                        polygon[i].x
            ) {
                isInside = !isInside;
            }
        }

        return isInside;
    }
}

export class Camera {
    public cursorClick: Subject<Vector2> = new Subject();
    public cameraPosition: Subject<Vector2> = new Subject();
    public scaleFactor: Subject<number> = new Subject();

    public startVector: Vector2;

    private dragDelay: number = 200;
    private clickStartTS: number = 0;
    private isDragging: boolean = false;
    private isScaling: boolean = false;
    private lastScaleFactor = 0;
    private currentScaleFactor = 1;
    private dragStartVector: Vector2 | null = null;

    private clickPointerPos: Vector2 = new Vector2(-1, -1);
    private scene: HTMLCanvasElement;

    constructor(public layer: RenderingLayer<CanvasRenderingContext2D>[], public disabled: boolean = false) {
        this.scene = layer[layer.length - 1].canvas;
        this.startVector = new Vector2(0, 0);
        this.cameraPosition.next(this.startVector);
        this.applyBindings();
    }

    public enable() {
        this.disabled = false;
    }

    public disable() {
        this.cameraPosition.next(new Vector2(0, 0));
        this.scaleFactor.next(1);
        this.disabled = true;
    }

    private applyBindings() {
        this.scene.addEventListener(
            "contextmenu",
            (e) => {
                e.preventDefault();
            },
            false
        );
        this.scene.addEventListener(
            "mousedown",
            (e: MouseEvent) => {
                this.clickPointerPos = new Vector2(e.pageX, e.pageY);

                if (e.button === 0) {
                    this.clickStartTS = Date.now();
                    this.isDragging = true;
                    this.dragStartVector = new Vector2(e.offsetX, e.offsetY);
                } else if (e.button === 2) {
                    this.handleRightClick(e);
                }
            },
            false
        );
        this.scene.addEventListener(
            "mousemove",
            (e) => {
                if (this.isDragging) {
                    this.handleDragging(e);
                }

                if (this.isScaling) {
                    this.handleScaling(e);
                }
            },
            false
        );
        this.scene.addEventListener(
            "mouseup",
            (e) => {
                this.isDragging = false;
                this.isScaling = false;
                if (
                    this.dragStartVector &&
                    Math.abs(this.dragStartVector.x - e.offsetX) < 15 &&
                    Math.abs(this.dragStartVector.y - e.offsetY) < 15 &&
                    Date.now() - this.clickStartTS < this.dragDelay
                ) {
                    this.handleLeftClick(e);
                }
                this.dragStartVector = null;
            },
            false
        );
    }

    private handleDragging(e: MouseEvent) {
        if (this.disabled) return;
        this.startVector = new Vector2(
            this.startVector.x + e.offsetX - this.dragStartVector!.x,
            this.startVector.y + e.offsetY - this.dragStartVector!.y
        );
        this.dragStartVector = new Vector2(e.offsetX, e.offsetY);
        this.cameraPosition.next(this.startVector);
    }

    private handleLeftClick(e: MouseEvent) {
        this.clickPointerPos = new Vector2(e.offsetX, e.offsetY);
        this.cursorClick.next(this.clickPointerPos);
    }

    private handleRightClick(e: MouseEvent) {
        if (this.disabled) return;
        this.isScaling = true;
        this.lastScaleFactor = this.currentScaleFactor;
    }

    private handleScaling(e: MouseEvent) {
        if (this.disabled) return;
        const distanceX = e.pageX - this.clickPointerPos.x;
        const distanceY = e.pageY - this.clickPointerPos.y;
        this.currentScaleFactor = MathUtils.clamp(this.lastScaleFactor - (distanceX - distanceY) / 400, 0.001, 15);
        this.scaleFactor.next(this.currentScaleFactor);
    }
}

class Background {
    public static = false;

    private image = new Image();
    private imageLoaded = false;

    constructor(public backgroundUrl: string, public layer: RenderingLayer<CanvasRenderingContext2D>) {
        this.image.src = backgroundUrl;
        this.image.onload = () => (this.imageLoaded = true);
    }

    public draw() {
        if (!this.imageLoaded) return;
        this.layer.context.filter = "opacity(0.74)";
        this.image.width = this.layer.canvas.width;
        const offsetY = this.layer.canvas.height / 2 - this.image.height / 2;
        const offsetX = this.layer.canvas.width / 2 - this.image.width / 2;
        this.layer.context.drawImage(this.image, offsetX, offsetY, this.layer.canvas.width, this.image.height);
    }
}

export enum RENDERING_LAYER {
    BACKGROUND,
    GRID,
    FOREGROUND,
    UI,
}

export type RenderingLayer<T> = {
    context: T;
    type: RENDERING_LAYER;
    canvas: HTMLCanvasElement;
};

export class Renderer {
    private windowHeight: number;
    private windowWidth: number;
    private _isDebugging: boolean = false;

    get debugging(): boolean {
        return this._isDebugging;
    }

    constructor(public layer: RenderingLayer<CanvasRenderingContext2D>[]) {
        this.windowHeight = (layer[0].context.canvas.parentNode as HTMLElement).clientHeight;
        this.windowWidth = (layer[0].context.canvas.parentNode as HTMLElement).clientWidth;
        layer.forEach((l) => {
            l.canvas.height = this.windowHeight;
            l.canvas.width = this.windowWidth;
        });
        this.Awake();
        this.render();
        this.Start();
    }

    protected Awake() {}
    protected Start() {}
    protected EarlyUpdate() {}
    protected Update() {}
    protected LateUpdate() {}

    private render() {
        requestAnimationFrame(() => this.render());
        this.layer.forEach((layer) => layer.context.clearRect(0, 0, this.windowWidth, this.windowHeight));
        if (this._isDebugging) {
            this.drawGizmos();
            this.debug();
        }
        this.EarlyUpdate();
        this.Update();
        this.LateUpdate();
    }

    public toggleDebug() {
        this._isDebugging = !this._isDebugging;
    }
    protected debug() {}

    private drawGizmos() {
        const context = this.layer[this.layer.length - 1].context;
        context.beginPath();
        context.moveTo(this.windowWidth / 2, this.windowHeight / 2);
        context.lineTo(this.windowWidth / 2 + 150, this.windowHeight / 2);
        context.strokeStyle = `red`;
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(this.windowWidth / 2, this.windowHeight / 2);
        context.lineTo(this.windowWidth / 2, this.windowHeight / 2 - 150);
        context.strokeStyle = "green";
        context.stroke();
        context.closePath();
    }
}

export type Transform = {
    height: number;
    width: number;
    x: number;
    y: number;
};

export class GridRenderer<T extends IHexagonData> extends Renderer {
    public sideLength = 50;
    public hexHeight = 0;
    public hexRadius = 0;
    public hexRectangleHeight = 0;
    public hexRectangleWidth = 0;
    public transform: Transform = { x: 0, y: 0, height: 0, width: 0 };

    private scaleFactor: number = 1;
    private cameraPos: Vector2 = new Vector2(0, 0);
    private computedSideLength = 0;
    private gridData: Hexagon<T>[][] = [[]];
    private inputGrid: T[][] = [[]];
    private background: Background | null = null;
    private clickPosition: Vector2 | null = null;

    constructor(public layer: RenderingLayer<CanvasRenderingContext2D>[], public camera: Camera) {
        super(layer);
        this.camera?.scaleFactor.subscribe((factor: number) => this.updateScaleFactor(factor));
        this.camera?.cursorClick.subscribe((pos: Vector2) => (this.clickPosition = pos));
        this.camera?.cameraPosition.subscribe((cameraPos: Vector2) => this.updatePosition(cameraPos));
    }

    public updateScaleFactor(scaleFactor: number) {
        this.scaleFactor = scaleFactor;
    }

    public updatePosition(pos: Vector2) {
        this.cameraPos = pos;
        this.updateGrid(this.inputGrid);
    }

    public setBackground(url: string) {
        const backgroundContext = this.layer.find((l) => l.type === RENDERING_LAYER.BACKGROUND);
        if (!backgroundContext) {
            throw new Error("Background context not found");
        }
        this.background = new Background(url, backgroundContext);
    }

    public updateGrid(inputGrid: T[][]) {
        this.gridData = [[]];
        this.updateValues();
        this.inputGrid = inputGrid;
        inputGrid.forEach((row: T[], x: number) => {
            row.forEach((t: T, y: number) => {
                // needed to rotate the grid by 90deg therefore we need to adjust ny/nx
                const positionVector = this.getHexPositionVector(x, y);
                const layer = this.layer.find((l) => l.type === RENDERING_LAYER.GRID);
                if (!layer) {
                    console.error("No layer named Grid found!");
                    return;
                }
                const hex = new Hexagon<T>(t, layer.context, { x, y }, { x: positionVector.x, y: positionVector.y });

                if (!this.gridData[x]) {
                    this.gridData[x] = [];
                }
                this.gridData[x][y] = hex;
            });
        });
        this.getCenterPositionOfGrid();
    }

    public getClickedTile(e: Vector2) {
        const target = this.gridData.flat().filter((hex) => !!hex && hex.isPointInHexagon(e))[0];
        this.gridData
            .flat()
            .filter((hex) => hex)
            .forEach((hex) => hex.makeGreen(false));
        return target;
    }

    protected override Start(): void {}

    protected override EarlyUpdate(): void {
        this.updateValues();

        if (!this.gridData) return;
        const data = this.gridData.flat().filter((f) => f.position);

        if (data.length === 0) return;
        const offsetX = this.gridData.length % 2 !== 0 ? this.hexRadius : 0;

        const x = Math.min(...data.map((f) => f.position.x)) - offsetX;
        const y = Math.min(...data.map((f) => f.position.y));
        const width = Math.max(...data.map((f) => f.position.x + this.hexRectangleWidth)) + offsetX;
        const height = Math.max(...data.map((f) => f.position.y + this.hexRectangleHeight));
        this.transform = {
            x,
            y,
            height: height - y,
            width: width - x,
        };
    }

    protected override Update(): void {
        if (!this.gridData) return;
        for (let x = 0; x < this.gridData.length; x++) {
            for (let y = 0; y < this.gridData[x].length; y++) {
                const hex = this.gridData[x][y];
                if (hex && hex.data.rendered === true) {
                    hex.draw(
                        this.computedSideLength,
                        this.hexRectangleWidth,
                        this.hexRectangleHeight,
                        this.hexHeight,
                        this.hexRadius,
                        this.getHexPositionVector(x, y),
                        this.debugging
                    );
                }
            }
        }
        if (this.background) {
            this.background.draw();
        }
    }

    getCenterPositionOfGrid() {}

    private getHexPositionVector(x: number, y: number) {
        const windowHeight = this.layer[0].canvas.height;
        const windowWidth = this.layer[0].canvas.width;
        const offsetX = (windowWidth - this.transform.width) / 2 + this.cameraPos.x;
        const offsetY = (windowHeight - this.transform.height) / 2 + this.cameraPos.y;
        const nx = y * this.hexRectangleWidth + (x % 2) * this.hexRadius + offsetX;
        const ny = x * (this.computedSideLength + this.hexHeight) + offsetY;
        return new Vector2(nx, ny);
    }

    private updateValues() {
        this.computedSideLength = this.sideLength * this.scaleFactor;
        this.hexHeight = Math.sin(Hexagon.angle) * this.computedSideLength;
        this.hexRadius = Math.cos(Hexagon.angle) * this.computedSideLength;
        this.hexRectangleHeight = this.computedSideLength + 2 * this.hexHeight;
        this.hexRectangleWidth = 2 * this.hexRadius;
    }

    protected override debug(): void {
        const ctx = this.layer[3].context;
        ctx.beginPath();
        ctx.moveTo(this.transform.x, this.transform.y);
        ctx.lineTo(this.transform.x + this.transform.width, this.transform.y);
        ctx.lineTo(this.transform.x + this.transform.width, this.transform.y + this.transform.height);
        ctx.lineTo(this.transform.x, this.transform.y + this.transform.height);
        ctx.lineTo(this.transform.x, this.transform.y);

        ctx.strokeStyle = "blue";
        ctx.stroke();
        // ctx.fill();
        ctx.closePath();

        if (this.clickPosition !== null) {
            ctx.beginPath();
            ctx.arc(this.clickPosition.x, this.clickPosition.y, 4, 0, Math.PI * 2, false);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
        }
    }
}
