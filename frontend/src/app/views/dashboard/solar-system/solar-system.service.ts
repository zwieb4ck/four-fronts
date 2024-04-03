import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import HTTPService from "src/app/core/services/http.service";

@Injectable({
    providedIn: "root",
})
export default class SolarSystemService extends HTTPService {
  override target = '/solar-system'

  public getBySeed(seed: string): Observable<any> {
    return this.get(`/${seed}`,{});
  }
}