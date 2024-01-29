import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import AuthService from '../services/auth.service';

@Injectable()
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      if (
        !this.authService.user?.isAdmin &&
        !this.authService.user?.isSuperAdmin
      ) {
        this.router.navigate(['unauthorized']);
      }
    }
    return true;
  }
}
