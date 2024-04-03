import { Component, ElementRef, OnInit } from '@angular/core';
import DashboardService from './dashboard.service';
import AuthService from 'src/app/core/services/auth.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Route, Router } from '@angular/router';
import UIService from 'src/app/core/services/ui.service';
import { Vector2, MathUtils } from 'three';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardPageComponent implements OnInit {

  public quadrant: string | null = null;
  public system: string | null = null;
  public planet: string | null = null;

  constructor(private authService: AuthService, private router: Router, private activeRoute: ActivatedRoute) {
    router.events.forEach((event) => {
      if( event instanceof NavigationEnd) {
        const [quadrant, system, planet] = event.url.slice(1, event.url.length).split('/').slice(1, Infinity)
        this.quadrant = quadrant || null;
        this.system = system || null;
        this.planet = planet || null;
      }
    })
  }

  public get showSolarButton():boolean {
      return this.planet !== null;
  }

  public get showQuadrantButton():boolean {
      return this.system !== null;
  }

  public ngOnInit(): void {
    console.log(this.router);
  }

  public logout() {
    this.authService.logOut();
  }

  public goToSolarSystem() {
    this.router.navigate(['dashboard', this.quadrant, this.system]);
  }

  public goToQuadrant() {
    this.router.navigate(['dashboard', this.quadrant]);
  }
}
