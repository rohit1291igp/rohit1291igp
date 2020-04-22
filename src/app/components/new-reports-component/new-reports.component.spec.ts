import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewReportsComponent } from './new-reports.component';


describe('NewReportsComponent', () => {
  let component: NewReportsComponent;
  let fixture: ComponentFixture<NewReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
