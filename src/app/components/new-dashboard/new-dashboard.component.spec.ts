import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDasboardComponent } from './new-dashboard.component';

describe('NewDasboardComponent', () => {
  let component: NewDasboardComponent;
  let fixture: ComponentFixture<NewDasboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
