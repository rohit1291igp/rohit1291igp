import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryTaskComponent } from './delivery-task-component';


describe('DeliveryTaskComponent', () => {
  let component: DeliveryTaskComponent;
  let fixture: ComponentFixture<DeliveryTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
