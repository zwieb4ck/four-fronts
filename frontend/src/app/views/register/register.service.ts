import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import HTTPService from 'src/app/core/services/http.service';

export interface ILoginResponse {
  auth: {
    token: string;
    refresh: string;
  };
  email: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  name: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export default class RegisterService extends HTTPService {
  public override target: string = '/user';

  public register(
    name: string,
    email: string,
    password: string,
  ): Observable<HttpResponse<ILoginResponse>> {
    return this.post('', { email, password, name });
  }
}
