import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import HTTPService from '../services/http.service';
import { NavigationService } from '../services/navigation.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private naviService: NavigationService,
    private activeRoute: ActivatedRoute
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (this.router.url.includes('/login')) {
          HTTPService.errorSubject.next(error);
          return throwError(() => error);
        }
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.naviService.rememberCurrentRoute(this.router.url);
          this.router.navigate(['/login', 'refresh']);
        }
        if (error instanceof HttpErrorResponse && error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.router.navigate(['/notfound']);
        }
        HTTPService.errorSubject.next(error);
        return throwError(() => error);
      })
    );
  }
}
