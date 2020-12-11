import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPageManagementComponent } from './offer-page-management.component';

describe('OfferPageManagementComponent', () => {
  let component: OfferPageManagementComponent;
  let fixture: ComponentFixture<OfferPageManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferPageManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
