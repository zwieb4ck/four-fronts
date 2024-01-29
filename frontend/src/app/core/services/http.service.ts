import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

export interface IHTTPErrorResponse {
  code: number;
  message: string;
  stack: string;
}

@Injectable({
  providedIn: 'root',
})
export default class HTTPService {
  protected backendUrl: string = 'http://localhost:5000/v1';

  public target: string = '';

  public static errorSubject: Subject<HttpErrorResponse> =
    new Subject<HttpErrorResponse>();

  constructor(public http: HttpClient) {}

  get<T>(
    path: string,
    params: { [key: string]: string | number | boolean }
  ): Observable<HttpResponse<T>> {
    return this.http
      .get(`${this.backendUrl}${this.target}${path}/`, params)
      .pipe(
        map((res: Object) => {
          const body = res as T;
          return new HttpResponse({
            body: body,
            url: `${this.backendUrl}${this.target}${path}/`,
          });
        })
      );
  }

  post<T>(
    path: string,
    params: { [key: string]: string | number | boolean }
  ): Observable<HttpResponse<T>> {
    return this.http
      .post(`${this.backendUrl}${this.target}${path}/`, params)
      .pipe(
        map((res: Object) => {
          const body = res as T;
          return new HttpResponse({
            body: body,
            url: `${this.backendUrl}${this.target}${path}/`,
          });
        })
      );
  }

  put<T>(
    path: string,
    params: { [key: string]: string | number | boolean }
  ): Observable<HttpResponse<T>> {
    return this.http
      .put(`${this.backendUrl}${this.target}${path}/`, params)
      .pipe(
        map((res: Object) => {
          const body = res as T;
          return new HttpResponse({
            body: body,
            url: `${this.backendUrl}${this.target}${path}/`,
          });
        })
      );
  }

  patch<T>(
    path: string,
    params: { [key: string]: string | number | boolean }
  ): Observable<HttpResponse<T>> {
    return this.http
      .patch(`${this.backendUrl}${this.target}${path}/`, params)
      .pipe(
        map((res: Object) => {
          const body = res as T;
          return new HttpResponse({
            body: body,
            url: `${this.backendUrl}${this.target}${path}/`,
          });
        })
      );
  }

  delete<T>(
    path: string,
    params: { [key: string]: string | number | boolean }
  ): Observable<HttpResponse<T>> {
    return this.http
      .delete(`${this.backendUrl}${this.target}${path}/`, params)
      .pipe(
        map((res: Object) => {
          const body = res as T;
          return new HttpResponse({
            body: body,
            url: `${this.backendUrl}${this.target}${path}/`,
          });
        })
      );
  }
}
