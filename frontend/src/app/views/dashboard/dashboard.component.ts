import { Component, ElementRef, OnInit } from '@angular/core';
import DashboardService from './dashboard.service';
import AuthService from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import UIService from 'src/app/core/services/ui.service';
import { Vector2, MathUtils } from 'three';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardPageComponent {
  public startMovePos: Vector2 = new Vector2();
  public isDragging: boolean = false;
  public startVector: Vector2 = new Vector2();
  public distanceVector: Vector2 = new Vector2();

  public cols = 15;
  public rows = 15;

  public get calcultedWidth(): number {
    return this.cols * 102;
  }

  public get calcultedHeight(): number {
    return this.rows * 88.63;
  }

  public get mapPosition(): Vector2 {
    return this.UIservice.mapPosition;
  }

  public set mapPosition(pos: Vector2) {
    this.UIservice.mapPosition = pos;
  }

  constructor(public UIservice: UIService, public ref: ElementRef, public authService: AuthService) {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.which === 2) {
        event.preventDefault();
        this.startMovePos = new Vector2(event.pageX, event.pageY);
        this.startVector = this.mapPosition;
        this.isDragging = true;
      }
    });
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isDragging) {
        this.distanceVector = new Vector2(
          (this.startMovePos.x - e.pageX) * -1,
          (this.startMovePos.y - e.pageY) * -1
        );
        this.mapPosition = new Vector2(
          MathUtils.clamp(
            this.startVector.x +
            this.distanceVector.x,
            ref.nativeElement.parentNode.getBoundingClientRect().width - this.calcultedWidth - 100,
            100),
            MathUtils.clamp(
            this.startVector.y +
            this.distanceVector.y,
            ref.nativeElement.parentNode.getBoundingClientRect().height - this.calcultedHeight - 100,
            100)
        );
      }
    });
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

  }

  public logout() {
    this.authService.logOut();
  }
}
