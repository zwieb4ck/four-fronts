import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import HTTPService from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export default class DashboardService extends HTTPService {
  override target = '/dashboard'
}
