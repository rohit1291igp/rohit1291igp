import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactUsEditComponent } from './contact-us-edit.component';


describe('ContactUsEditComponent', () => {
  let component: ContactUsEditComponent;
  let fixture: ComponentFixture<ContactUsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactUsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
