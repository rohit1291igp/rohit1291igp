import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OutForDeliveryComponent } from './out-for-delivery-component';


describe('OutForDeliveryComponent', () => {
  let component: OutForDeliveryComponent;
  let fixture: ComponentFixture<OutForDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutForDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutForDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
