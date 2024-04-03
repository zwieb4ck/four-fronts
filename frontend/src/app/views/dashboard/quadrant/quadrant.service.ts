import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BODY_IMAGES, BODY_TYPES } from "src/app/core/classes/Tile";
import HTTPService from "src/app/core/services/http.service";

@Injectable({
    providedIn: "root"
})
export default class QuadrantService extends HTTPService {
    public override target: string = "/quadrant"
    
    public getQuadrant(seed:string): Observable<any> {
        console.log('get quadrant', seed)
        return this.get(`/${seed}`, {});
    }
}