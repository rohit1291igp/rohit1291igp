import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgvwalletComponent } from './egvwallet.component';

describe('EgvwalletComponent', () => {
  let component: EgvwalletComponent;
  let fixture: ComponentFixture<EgvwalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgvwalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgvwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
