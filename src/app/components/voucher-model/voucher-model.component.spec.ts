import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherModelComponent } from './voucher-model.component';

describe('VoucherModelComponent', () => {
  let component: VoucherModelComponent;
  let fixture: ComponentFixture<VoucherModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
