import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedImageReportComponent } from './uploaded-image-report.component';

describe('UploadedImageReportComponent', () => {
  let component: UploadedImageReportComponent;
  let fixture: ComponentFixture<UploadedImageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedImageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedImageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
