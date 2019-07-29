import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnDeliveredComponent } from './undelivered-component';


describe('UnDeliveredComponent', () => {
  let component: UnDeliveredComponent;
  let fixture: ComponentFixture<UnDeliveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnDeliveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
