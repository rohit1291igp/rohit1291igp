import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayCalenderManagementComponent } from './holiday-calender-management.component';

describe('HolidayCalenderManagementComponent', () => {
  let component: HolidayCalenderManagementComponent;
  let fixture: ComponentFixture<HolidayCalenderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayCalenderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayCalenderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
