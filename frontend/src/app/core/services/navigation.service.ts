import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private currentRoute: string = '/';

  constructor(private router: Router) {}

  rememberCurrentRoute(route: string): void {
    this.currentRoute = route;
  }

  back(): void {
    if (this.currentRoute.length > 0) {
      this.router.navigate([this.currentRoute]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
