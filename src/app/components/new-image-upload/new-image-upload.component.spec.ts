import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageUploadComponent } from './new-image-upload.component';

describe('NewImageUploadComponent', () => {
  let component: NewImageUploadComponent;
  let fixture: ComponentFixture<NewImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewImageUploadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
