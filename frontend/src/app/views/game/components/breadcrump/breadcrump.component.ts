import { Component, Input } from '@angular/core';
export type BreadCrump = {
  target: string,
  label: string,
  link: string,
}

@Component({
  selector: 'app-breadcrump',
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.css']
})
export class BreadcrumpComponent {

  constructor() {
  }

  @Input() public breadcrumps: BreadCrump[] = []

}
