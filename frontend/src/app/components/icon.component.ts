import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  host: {
    class: 'material-symbols-outlined c-icon',
  },
  template: `<ng-content></ng-content>`,
})
export class IconComponent {}