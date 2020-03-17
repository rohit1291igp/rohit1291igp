import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GvComponent } from './gv.component';

describe('GvComponent', () => {
  let component: GvComponent;
  let fixture: ComponentFixture<GvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
