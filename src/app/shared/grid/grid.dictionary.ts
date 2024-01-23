import { Vector2 } from "three";

export const OGridVector = {
    TOP_LEFT: new Vector2(0 , -1),
    TOP_RIGHT: new Vector2(1 , -1),
    LEFT: new Vector2(-1 , 0),
    RRIGHT: new Vector2(1 , 0),
    BOTTOM_LEFT: new Vector2(0 , 1),
    BOTTOM_RIGHT: new Vector2(1 , 1),
}

export type GridVector = typeof OGridVector[keyof typeof OGridVector];