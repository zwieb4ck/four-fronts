import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumpComponent } from './breadcrump.component';

describe('BreadcrumpComponent', () => {
  let component: BreadcrumpComponent;
  let fixture: ComponentFixture<BreadcrumpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumpComponent]
    });
    fixture = TestBed.createComponent(BreadcrumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
