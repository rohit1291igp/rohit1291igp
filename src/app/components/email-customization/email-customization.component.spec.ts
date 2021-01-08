import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCustomizationComponent } from './email-customization.component';

describe('EmailCustomizationComponent', () => {
  let component: EmailCustomizationComponent;
  let fixture: ComponentFixture<EmailCustomizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailCustomizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
