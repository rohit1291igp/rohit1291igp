import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutDashboardComponent } from './payout-dashboard.component';

describe('PayoutDashboardComponent', () => {
  let component: PayoutDashboardComponent;
  let fixture: ComponentFixture<PayoutDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
