import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDropdownComponent } from './vendor-dropdown.component';

describe('VendorDropdownComponent', () => {
  let component: VendorDropdownComponent;
  let fixture: ComponentFixture<VendorDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
