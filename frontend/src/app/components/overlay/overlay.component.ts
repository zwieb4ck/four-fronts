import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Input() showSolarSystemActive: boolean = true;
  @Input() showQuadrantActive: boolean = true;
  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() toggleSolarSystem: EventEmitter<void> = new EventEmitter();
  @Output() toggleQuadrant: EventEmitter<void> = new EventEmitter();

  public callLogout() {
    this.logout.emit();
  }

  public showSolarSystem() {
    this.toggleSolarSystem.emit();
  }

  public showQuadrant() {
    this.toggleQuadrant.emit();
  }
}
