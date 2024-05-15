import { Subject } from 'rxjs';
import { Vector2 } from 'three';
import { Vector3 } from 'three';

export declare class BlackHole extends Sun {
    coordiantes: string;
    mass: number;
    innerRing: number;
    outerRing: number;
    image: HTMLImageElement;
    imageLoaded: boolean;
    constructor(coordiantes: string);
    get childBodiesCount(): number;
    randomCordinates(): string;
}

declare class Body_2 {
    coordinates: string;
    protected random: PRNG;
    protected childen: Body_2[];
    type: string;
    mass: number;
    image: HTMLImageElement;
    imageLoaded: boolean;
    protected get childBodiesCount(): number;
    constructor(coordinates: string);
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D): void;
}
export { Body_2 as Body }

export declare class Camera {
    layer: RenderingLayer<CanvasRenderingContext2D>[];
    disabled: boolean;
    cursorClick: Subject<Vector2>;
    cameraPosition: Subject<Vector2>;
    scaleFactor: Subject<number>;
    startVector: Vector2;
    private dragDelay;
    private clickStartTS;
    private isDragging;
    private isScaling;
    private lastScaleFactor;
    private currentScaleFactor;
    private dragStartVector;
    private clickPointerPos;
    private scene;
    constructor(layer: RenderingLayer<CanvasRenderingContext2D>[], disabled?: boolean);
    enable(): void;
    disable(): void;
    private applyBindings;
    private handleDragging;
    private handleLeftClick;
    private handleRightClick;
    private handleScaling;
}

export declare class GridRenderer<T extends IHexagonData> extends Renderer {
    layer: RenderingLayer<CanvasRenderingContext2D>[];
    camera: Camera;
    sideLength: number;
    hexHeight: number;
    hexRadius: number;
    hexRectangleHeight: number;
    hexRectangleWidth: number;
    transform: Transform;
    private scaleFactor;
    private cameraPos;
    private computedSideLength;
    private gridData;
    private inputGrid;
    private background;
    private clickPosition;
    constructor(layer: RenderingLayer<CanvasRenderingContext2D>[], camera: Camera);
    updateScaleFactor(scaleFactor: number): void;
    updatePosition(pos: Vector2): void;
    setBackground(url: string): void;
    updateGrid(inputGrid: T[][]): void;
    getClickedTile(e: Vector2): Hexagon<T>;
    protected Start(): void;
    protected EarlyUpdate(): void;
    protected Update(): void;
    getCenterPositionOfGrid(): void;
    private getHexPositionVector;
    private updateValues;
    protected debug(): void;
}

export declare class Hexagon<T extends IHexagonData> {
    data: T;
    context: CanvasRenderingContext2D;
    coordinates: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    };
    private fill;
    private fillStyle;
    private strokeStyle;
    private lineWidth;
    private sideLength;
    private hexRectangleWidth;
    private hexRectangleHeight;
    private hexHeight;
    private hexRadius;
    constructor(data: T, context: CanvasRenderingContext2D, coordinates: {
        x: number;
        y: number;
    }, position: {
        x: number;
        y: number;
    });
    static get angle(): number;
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, debug: boolean): void;
    debug(): void;
    makeGreen(fill: boolean): void;
    isIntersect(point: Vector2): boolean;
    isPointInHexagon(point: Vector2): boolean;
    pointInPolygon(point: Vector2, polygon: {
        x: number;
        y: number;
    }[]): boolean;
}

export declare class HexGrid {
    grid: Tile[][];
    rings: number;
    width: number;
    height: number;
    gridType: HEXGRID_TYPE;
    constructor();
    get centerPoint(): {
        x: number;
        y: number;
    };
    centerTile: Tile;
    buildHexagonGrid(rings: number): void;
    cutOut(innerRing: number): void;
    applyRings(tile: Tile, rings: number): void;
    buildGrid(width: number, height: number): void;
    buildCustomGrid<T extends Tile>(grid: T[][]): void;
    applyBody(coords: {
        x: number;
        y: number;
    }, body: Body_2): void;
    defineCenterPoint(newCenterPoint: {
        x: number;
        y: number;
    }): void;
    getCorners(): Tile[];
    merge(grid: Tile[][]): void;
    private getTile;
}

export declare enum HEXGRID_TYPE {
    HEXAGON = 0,
    GRID = 1,
    RING = 2,
    CUSTOM = 3,
    UNDEFINED = 4
}

export declare interface ICmd {
    type: string;
    value: any;
}

export declare interface IHexagonData {
    rendered: boolean;
    draw?: (sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D) => void;
    onClick?: () => ICmd;
}

export declare interface IRouteCommand extends ICmd {
    type: string;
    value: string;
}

export declare class NeighborQuadrantTile extends QuadrantTile {
    label: string;
    rendered: boolean;
    constructor(coords: {
        x: number;
        y: number;
    }, label: string, rendered?: boolean);
    onClick(): IRouteCommand;
}

export declare class Planet extends Body_2 {
    coordinates: string;
    constructor(coordinates: string);
}

export declare class PRNG {
    private m;
    private a;
    private c;
    private state;
    private secret;
    constructor(seed: string, secret?: string);
    nextInt(): number;
    nextFloat(): number;
    nextRange(start: number, end: number): number;
    choice<T>(array: T[]): T;
    choiceMultipleUnique<T>(array: T[], amount: number): T[];
    generate(): number;
    generateConsistentNumberFromString(str: string): number;
    private arrayShuffle;
    percentageChance<T>(values: T[], chances: number[]): T;
}

export declare class Quadrant {
    coordinates: string;
    private characters;
    random: PRNG;
    systems: number;
    quadrant: HexGrid;
    system: HexGrid;
    starSystem: {
        [coords: string]: StarSystem;
    };
    constructor(coordinates: string);
    private createSystem;
    coordPairToIndex(pair: string): number;
    indexToCoordPair(index: number): string;
    adjustCoordinatePair(coordPair: string, delta: number): string;
    adjustCoordinates(coords: string, vector: Vector3): string;
    private createGrid;
    applyBodiesToTiles(): void;
    randomCordinates(): string;
    findBlackHole(): string | null;
}

export declare class QuadrantTile extends Tile {
    rendered: boolean;
    position: Vector2;
    label: string;
    constructor(coords: {
        x: number;
        y: number;
    }, rendered?: boolean);
    onClick(): ICmd;
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D): void;
}

export declare class Renderer {
    layer: RenderingLayer<CanvasRenderingContext2D>[];
    private windowHeight;
    private windowWidth;
    private _isDebugging;
    get debugging(): boolean;
    constructor(layer: RenderingLayer<CanvasRenderingContext2D>[]);
    protected Awake(): void;
    protected Start(): void;
    protected EarlyUpdate(): void;
    protected Update(): void;
    protected LateUpdate(): void;
    private render;
    toggleDebug(): void;
    protected debug(): void;
    private drawGizmos;
}

export declare enum RENDERING_LAYER {
    BACKGROUND = 0,
    GRID = 1,
    FOREGROUND = 2,
    UI = 3
}

export declare type RenderingLayer<T> = {
    context: T;
    type: RENDERING_LAYER;
    canvas: HTMLCanvasElement;
};

declare type SpectralClass = {
    key: string;
    min: number;
    max: number;
    type: string[];
    innerRing: number;
    minRings: number;
    maxRings: number;
    assets: string[];
};

export declare enum STAR_CATEGORIES {
    Pop1 = 0,
    Pop2 = 1,
    Pop3 = 2
}

export declare class StarSystem {
    coordinates: string;
    private random;
    suns: Sun[];
    planets: {
        [key: string]: Planet;
    };
    grid: HexGrid;
    imageLoaded: boolean;
    image: HTMLImageElement;
    constructor(coordinates: string);
    initializeSuns(): void;
    initializeGrid(): void;
    isBlackHole(): boolean;
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D): void;
    initializePlanets(): void;
}

export declare class Sun extends Body_2 {
    coordinates: string;
    categorie: STAR_CATEGORIES;
    mass: number;
    temperatur: number;
    class: SpectralClass;
    innerRing: number;
    outerRing: number;
    grid: HexGrid;
    image: HTMLImageElement;
    imageLoaded: boolean;
    constructor(coordinates: string);
    get hexagonsCount(): number;
    get isGiant(): boolean;
    protected generateMass(): number;
    private genearteTemperature;
    generateGrid(): void;
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D): void;
    onClick(): void;
}

export declare class Tile {
    private _coords;
    rendered: boolean;
    ring: number;
    body: Body_2 | StarSystem | null;
    constructor(_coords: {
        x: number;
        y: number;
    }, rendered?: boolean);
    get coords(): {
        x: number;
        y: number;
    };
    set coords(val: {
        x: number;
        y: number;
    });
    get neighbors(): {
        x: number;
        y: number;
    }[];
    applyBody(body: Body_2 | StarSystem): void;
    draw(sideLength: number, hexRectangleWidth: number, hexRectangleHeight: number, hexHeight: number, hexRadius: number, positionVector: Vector2, context: CanvasRenderingContext2D): void;
    onClick(): {
        type: string;
        value: string;
    } | {
        type: string;
        value: null;
    };
}

export declare type Transform = {
    height: number;
    width: number;
    x: number;
    y: number;
};

export { }
