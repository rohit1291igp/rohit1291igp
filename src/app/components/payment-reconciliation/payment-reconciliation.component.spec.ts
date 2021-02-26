import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReconciliationComponent } from './payment-reconciliation.component';

describe('PaymentReconciliationComponent', () => {
  let component: PaymentReconciliationComponent;
  let fixture: ComponentFixture<PaymentReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
