import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgvStatementComponent } from './egv-statement.component';

describe('EgvStatementComponent', () => {
  let component: EgvStatementComponent;
  let fixture: ComponentFixture<EgvStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgvStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgvStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
