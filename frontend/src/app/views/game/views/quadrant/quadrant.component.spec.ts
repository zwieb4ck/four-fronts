import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadrantComponent } from './quadrant.component';

describe('QuadrantComponent', () => {
  let component: QuadrantComponent;
  let fixture: ComponentFixture<QuadrantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadrantComponent]
    });
    fixture = TestBed.createComponent(QuadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
