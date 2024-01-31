import { Component, ElementRef, OnInit } from '@angular/core';
import DashboardService from './dashboard.service';
import AuthService from 'src/app/core/services/auth.service';
import { Route, Router } from '@angular/router';
import UIService from 'src/app/core/services/ui.service';
import { Vector2, MathUtils } from 'three';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  public get showSolarButton():boolean {
      return !this.router.url.includes('solar-system')
  }

  public ngOnInit(): void {
    console.log(this.router);
  }

  public logout() {
    this.authService.logOut();
  }

  public goToSolarSystem() {
    this.router.navigate(['dashboard/solar-system']);
  }
}
