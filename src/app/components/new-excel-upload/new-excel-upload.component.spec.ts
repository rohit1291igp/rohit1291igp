import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExcelUploadComponent } from './new-excel-upload.component';

describe('new-', () => {
  let component: NewExcelUploadComponent;
  let fixture: ComponentFixture<NewExcelUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExcelUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExcelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
