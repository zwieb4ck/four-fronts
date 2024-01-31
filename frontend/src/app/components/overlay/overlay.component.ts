import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Input() showSolarSystemActive: boolean = true;
  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() toggleSolarSystem: EventEmitter<void> = new EventEmitter();

  public callLogout() {
    this.logout.emit();
  }

  public showSolarSystem() {
    this.toggleSolarSystem.emit();
  }
}
