import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import QuadrantService from './quadrant.service';
import { BODY_IMAGES } from 'src/app/core/classes/Tile';
import AuthService from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
})
export class QuadrantComponent {
  public systems: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public quadrantService: QuadrantService,
    public authService: AuthService,
  ) {
    this.route.params.subscribe((params) => {
      this.quadrantService
        .getQuadrant(params['quadrant'])
        .subscribe((data) => (this.systems = data.body));
    });
  }

  public getImage(type: string) {
      return (BODY_IMAGES as {[key:string]:string[]})[type][0];
  }

  public navigateTo(cords: string) {
    this.router.navigate(['dashboard', ...cords.split('/')])
  }
}
