import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import HTTPService, {
  IHTTPErrorResponse,
} from 'src/app/core/services/http.service';

export interface ILoginResponse {
  auth: {
    token: string;
    refresh: string;
  };
  email: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  startSystem: string,
  name: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export default class LoginService extends HTTPService {
  public override target: string = '/auth';

  public login(
    email: string,
    password: string
  ): Observable<HttpResponse<ILoginResponse>> {
    return this.post('/login', { email, password });
  }
}
