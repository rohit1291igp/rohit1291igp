import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPriorityComponent } from './delivery-priority.component';

describe('DeliveryPriorityComponent', () => {
  let component: DeliveryPriorityComponent;
  let fixture: ComponentFixture<DeliveryPriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
