import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgvDashboardComponent } from './egv-dashboard.component';

describe('EgvDashboardComponent', () => {
  let component: EgvDashboardComponent;
  let fixture: ComponentFixture<EgvDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgvDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgvDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
