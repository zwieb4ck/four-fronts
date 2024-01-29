import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  @Output() logout: EventEmitter<void> = new EventEmitter();

  public callLogout() {
    this.logout.emit();
  }
}
