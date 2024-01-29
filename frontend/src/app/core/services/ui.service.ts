import { Injectable } from "@angular/core";
import { MathUtils, Vector2 } from "three";

@Injectable({
    providedIn: 'root'
})

export default class UIService {
    public get zoomFactor(): number {
        return parseFloat(localStorage.getItem('zoomFactor') || '1');
    }

    public set zoomFactor(value: number) {
        localStorage.setItem('zoomFactor', `${MathUtils.clamp(value, 0.015, 1)}`);
    }
    public get seed(): string {
        if(localStorage.getItem('seed')) {
            return localStorage.getItem('seed')!;
        }
        return Math.round(Math.random() * 10000000).toString();
    }

    public set seed(value: string) {
        localStorage.setItem('seed', value);
    }
    public get mapPosition(): Vector2 {
        let pos = new Vector2(1,1);
        if (localStorage.getItem('mapPosition')) {
            localStorage.getItem('mapPosition')
            const storedPos = JSON.parse(localStorage.getItem('mapPosition')!) as Vector2;
            pos = new Vector2(storedPos.x, storedPos.y);
        }
        return pos;
    }

    public set mapPosition(pos: Vector2) {
        localStorage.setItem('mapPosition', JSON.stringify(pos));
    }
}