import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreadCrump } from './components/breadcrump/breadcrump.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  public breadCrumps: BreadCrump[] = [];
  public coordinates: string = "";

  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.coordinates = e.url;
        const [quadrant, system, body] = e.url.split('/').slice(2, 5);
        const serializedBreadcrumps: BreadCrump[] = [];
        const moons = ['a', 'b', 'c', 'd', 'e', 'f'];

        if (quadrant.length) {
          serializedBreadcrumps.push({
            target: quadrant,
            label: quadrant,
            link: `/game/${quadrant}`
          });
        }

        if (system?.length) {
          serializedBreadcrumps.push({
            target: system,
            label: `System ${system}`,
            link: `/game/${quadrant}/${system}`
          });
        }

        if (body?.length) {
          const [planet, moon] = body.match(/[a-zA-Z]+|[0-9]+/g) as [
            string,
            string | undefined
          ];
          // const planet = body.substring(0, body.length - 1);
          if (moon) {
            serializedBreadcrumps.push({
              target: body,
              label: `Planet ${planet} Moon ${moon}`,
              link: `/game/${quadrant}/${system}/${body}`
            });
          } else {
            serializedBreadcrumps.push({
              target: body,
              label: `Planet ${body}`,
              link: `/game/${quadrant}/${system}/${body}`
            });
          }
        }
        this.breadCrumps = serializedBreadcrumps;
      }
    });
  }

  public ngOnInit(): void {
  }
}
