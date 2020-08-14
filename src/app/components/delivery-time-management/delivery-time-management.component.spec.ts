import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTimeManagementComponent } from './delivery-time-management.component';

describe('DeliveryTimeManagementComponent', () => {
  let component: DeliveryTimeManagementComponent;
  let fixture: ComponentFixture<DeliveryTimeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTimeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTimeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
