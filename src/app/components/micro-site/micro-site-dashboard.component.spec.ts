import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroSiteDasboardComponent } from './micro-site-dashboard.component';

describe('MicroSiteDasboardComponent', () => {
  let component: MicroSiteDasboardComponent;
  let fixture: ComponentFixture<MicroSiteDasboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroSiteDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroSiteDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
