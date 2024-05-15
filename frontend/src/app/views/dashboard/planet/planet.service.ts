import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import HTTPService from "src/app/core/services/http.service";

@Injectable({
    providedIn: "root",
})
export default class PlanetService extends HTTPService {
  override target = '/planet'

  public getBody(quadrant: string, system: string, planet: string): Observable<any> {
    return this.get(`/${quadrant}/${system}/${planet}`,{});
  }
}