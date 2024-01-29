import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '../enums/storageKeys.enum';
import HTTPService, { IHTTPErrorResponse } from './http.service';
import { Observable } from 'rxjs';
import { ILoginResponse } from 'src/app/views/login/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export class User {
  public isSuperAdmin: boolean = false;
  public isAdmin: boolean = false;
  public name: string = '';
  public email: string = '';
  public _id: string = '';

  constructor(loginData: ILoginResponse) {
    this.isSuperAdmin = loginData.isSuperAdmin || false;
    this.isAdmin = loginData.isAdmin || false;
    this.name = loginData.name;
    this.email = loginData.email;
    this._id = loginData._id;
  }

  public get id(): string {
    return this._id;
  }
}

@Injectable({
  providedIn: 'root',
})
export default class AuthService extends HTTPService {
  public override target: string = '/auth';
  public _user: User | null = null;
  public isLoggedIn: boolean = false;

  constructor(private _http: HttpClient, private router: Router) {
    super(_http);
  }

  get token(): string {
    return window.localStorage.getItem(STORAGE_KEY.TOKEN) || '';
  }

  get refreshToken(): string {
    return window.localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN) || '';
  }

  public get loggedIn(): boolean {
    if (this.token.length > 0) return true;
    return false;
  }

  public get user(): User | null {
    const storedUser = window.localStorage.getItem(STORAGE_KEY.USER);
    if (!this._user && storedUser) {
      this._user = new User(
        JSON.parse(storedUser) as unknown as ILoginResponse
      );
    }
    return this._user;
  }

  public adaptLoginData(loginData: ILoginResponse): void {
    window.localStorage.setItem(STORAGE_KEY.TOKEN, loginData.auth.token);
    window.localStorage.setItem(
      STORAGE_KEY.REFRESH_TOKEN,
      loginData.auth.refresh
    );
    this._user = new User(loginData);
    window.localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(this._user));
    this.isLoggedIn = true;
  }

  public logOut() {
    window.localStorage.removeItem(STORAGE_KEY.TOKEN);
    window.localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
    this.delete('/logout', {});
    this.isLoggedIn = false;
    this.router.navigate(['login', 'logout']);
  }

  public updateToken(): Observable<any | IHTTPErrorResponse> {
    return this.post('/refresh', {
      token: this.refreshToken,
    });
  }
}
