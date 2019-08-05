import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectItemForDelivered } from './select-item.component';


describe('SelectItemForDelivered', () => {
  let component: SelectItemForDelivered;
  let fixture: ComponentFixture<SelectItemForDelivered>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectItemForDelivered ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectItemForDelivered);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
